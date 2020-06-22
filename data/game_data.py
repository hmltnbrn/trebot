import sys
from urllib.request import urlopen
import json
import re
import datetime
import uuid
from bs4 import BeautifulSoup

# "link": "http://www.j-archive.com/showgame.php?game_id=6578",
# "season": "36",
# "air_date": "2020-03-13T00:00:00",
# "show_number": "8180",
# "round": "Double Jeopardy!",
# "category": "THE NORMAN CONQUEST",
# "value": 2000,
# "question": "On Christmas day 1066, Ealdred, the Archbishop of York, crowned William King of England at this church",
# "answer": "Westminster Abbey",
# "daily_double_wager": 2000

class Game(object):

    def __init__(self, link, season):
        self.link = link
        self.html = self.get_html()
        self.season = str(season)
        self.show_number, self.air_date = self.html.find(id='game_title').find('h1').find(text=True).split(' - ')
        self.before_double = self.check_double()
        self.rounds = self.set_rounds()
    
    def get_html(self):
        html = urlopen(self.link).read().decode('utf-8')
        return BeautifulSoup(html, 'lxml') # requires the lxml Python module to be installed

    def check_double(self):
        if(datetime.datetime.strptime(self.air_date, '%A, %B %d, %Y').isoformat() < "2001-11-26T00:00:00"):
            return True
        else:
            return False

    def set_rounds(self):
        rounds = []
        first_round = self.html.find(id='jeopardy_round')
        second_round = self.html.find(id='double_jeopardy_round')
        final_round = self.html.find(id='final_jeopardy_round')
        if first_round:
            rounds.append(Round(1, "Jeopardy!", self.before_double, first_round))
        if second_round:
            rounds.append(Round(2, "Double Jeopardy!", self.before_double, second_round))
        if final_round:
            rounds.append(Round(3, "Final Jeopardy!", self.before_double, final_round))
        return rounds

    def get_data(self):
        data = []
        for round in self.rounds:
            for category in round.categories:
                for clue in category.clues:
                    data.append({
                        "link": self.link,
                        "season": self.season,
                        "air_date": datetime.datetime.strptime(self.air_date, '%A, %B %d, %Y').isoformat(),
                        "show_number": self.show_number.split(" #")[1],
                        "round": round.name,
                        "category": category.name,
                        "value": clue.value if clue.value is not None else "",
                        "question": clue.question,
                        "answer": clue.answer,
                        "daily_double": clue.daily_double,
                        "daily_double_wager": clue.daily_double_wager if clue.daily_double_wager is not None else ""
                    })
        return data

class Round(object):

    def __init__(self, id, name, before_double, html):
        self.id = id
        self.name = name
        self.before_double = before_double
        self.html = html
        self.categories = self.set_categories()

    def set_categories(self):
        categories = []
        cats = self.html.findAll(class_='category')
        clues = self.html.findAll(class_='clue')
        for i in range(len(cats)):
            cat_name = cats[i].find(class_='category_name')
            if cat_name:
                categories.append(Category(cat_name.find(text=True), clues[i:len(clues):6], self.id, self.before_double, self.html if self.name == 'Final Jeopardy!' else None, i))
        return categories

    def get_data(self):
        return {
            "id": self.id,
            "categories": [i.get_data() for i in self.categories]
        }

class Category(object):

    def __init__(self, name, html, round, before_double, answer_div, index):
        self.id = uuid.uuid4()
        self.name = name
        self.html = html
        self.round = round
        self.before_double = before_double
        self.answer_div = answer_div
        self.clues = self.set_clues(index)

    def set_clues(self, index):
        clues = []
        for i in range(len(self.html)):
            value = self.html[i].find(class_="clue_value") if self.html[i].find(class_="clue_value_daily_double") is None else self.html[i].find(class_="clue_value_daily_double")
            question = self.html[i].find(class_="clue_text")
            answer = self.answer_div.findAll("div")[index] if self.answer_div is not None else self.html[i].find("div")
            if(value and question and answer):
                if(question.get_text() != "="):
                    clues.append(Clue(value.find(text=True), question.get_text(), BeautifulSoup(answer["onmouseover"], "lxml").find(class_="correct_response").get_text(), answer["onmouseover"], i, self.round, self.before_double))
            elif(question and answer):
                if(question.get_text() != "="):
                    clues.append(Clue("", question.get_text(), BeautifulSoup(answer["onmouseover"], "lxml").find(class_=re.compile("correct")).get_text(), answer["onmouseover"], i, self.round, self.before_double))
        return clues

    def get_data(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "clues": [i.get_data() for i in self.clues]
        }

class Clue(object):

    def __init__(self, value, question, answer, mouseover_text, slot, round, before_double):
        self.id = uuid.uuid4()
        self.value = None
        self.question = question
        self.answer = answer
        self.daily_double = False
        self.daily_double_wager = None
        self.slot = slot
        self.round = round
        self.before_double = before_double
        self.handle_value(value)

    def handle_value(self, value):
        if(value):
            if value[0] == "D":
                daily_double_value = re.sub("[$,]", "", value.split(" ")[1])
                self.daily_double = True
                self.daily_double_wager = int(daily_double_value) if daily_double_value != '' else None
                self.value = int(self.set_dd_value())
            else:
                self.value = int(value.replace("$", ""))

    def set_dd_value(self):
        if(self.round == 1):
            if(self.before_double == True):
                return str(self.slot + 1) + "00"
            else:
                return str((self.slot + 1)*2) + "00"
        elif(self.round == 2):
            if(self.before_double == True):
                return str((self.slot + 1)*2) + "00"
            else:
                return str((self.slot + 1)*4) + "00"
        else:
            return None

    def get_data(self):
        return {
            "id": str(self.id),
            "clue": self.question,
            "value": self.value,
            "answer": self.answer,
            "daily_double": self.daily_double,
            "daily_double_wager": self.daily_double_wager
        }

def get(link, season):
    game = Game(link, season)

    return game.get_data()

if __name__ == "__main__":
    print("Generating show data...")

    game = Game(sys.argv[1], sys.argv[2]) # first argument -- j-archive link | second -- season

    data = game.get_data()

    with open('game_data.json', 'w+') as f:
        json.dump(data, f)
        print("Finished successfully")
