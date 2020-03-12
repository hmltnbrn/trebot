import sys
from urllib.request import urlopen
import json
import re
import datetime
from bs4 import BeautifulSoup

# "category": "POLITICS",
# "link": "http://www.j-archive.com/showgame.php?game_id=368",
# "value": "$100",
# "air_date": "1985-02-08T00:00:00",
# "answer": "Election Day",
# "season": "1",
# "question": "1st Tuesday after the 1st Monday in November",
# "round": "Jeopardy!",
# "show_number": "110"

class Show(object):

    def __init__(self, link, season):
        self.link = link
        self.html = self.get_html()
        self.season = str(season)
        self.show_number, self.air_date = self.html.find(id='game_title').find('h1').find(text=True).split(' - ')
        self.rounds = self.set_rounds()

    def get_html(self):
        html = urlopen(self.link).read().decode('utf-8')
        return BeautifulSoup(html, 'lxml') # requires the lxml Python module to be installed

    def set_rounds(self):
        rounds = []
        first_round = self.html.find(id='jeopardy_round')
        second_round = self.html.find(id='double_jeopardy_round')
        final_round = self.html.find(id='final_jeopardy_round')
        if first_round:
            rounds.append(Round("Jeopardy!", first_round))
        if second_round:
            rounds.append(Round("Double Jeopardy!", second_round))
        if final_round:
            rounds.append(Round("Final Jeopardy!", final_round))
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
                        "value": clue.value,
                        "question": clue.question,
                        "answer": clue.answer
                    })
        return data

class Round(object):

    def __init__(self, name, html):
        self.name = name
        self.html = html
        self.categories = self.set_categories()

    def set_categories(self):
        categories = []
        cats = self.html.findAll(class_='category')
        clues = self.html.findAll(class_='clue')
        for i in range(len(cats)):
            cat_name = cats[i].find(class_='category_name')
            if cat_name:
                categories.append(Category(cat_name.find(text=True), clues[i:len(clues):6], self.html if self.name == 'Final Jeopardy!' else None))
        return categories

class Category(object):

    def __init__(self, name, html, answer_div = None):
        self.name = name
        self.html = html
        self.answer_div = answer_div
        self.clues = self.set_clues()

    def set_clues(self):
        clues = []
        for i in range(len(self.html)):
            value = self.html[i].find(class_="clue_value") if self.html[i].find(class_="clue_value_daily_double") is None else self.html[i].find(class_="clue_value_daily_double")
            question = self.html[i].find(class_="clue_text")
            answer = self.answer_div.find("div") if self.answer_div is not None else self.html[i].find("div")
            if(value and question and answer):
                clues.append(Clue(value.find(text=True), question.decode_contents(), re.search('<em class="correct_response">(.*)</em>', answer["onmouseover"]).group(1)))
            elif(question and answer):
                clues.append(Clue("", question.decode_contents(), re.search(r'<em class=\\"correct_response\\">(.*)</em>', answer["onmouseover"]).group(1)))
        return clues

class Clue(object):

    def __init__(self, value, question, answer):
        self.value = value
        self.question = question
        self.answer = answer

def get(link, season):
    show = Show(link, season)

    return show.get_data()

if __name__ == "__main__":
    print("Generating show data...")

    show = Show(sys.argv[1], sys.argv[2]) # first argument -- j-archive link | second -- season

    data = show.get_data()

    with open('show_data.json', 'w+') as f:
        json.dump(data, f)
        print("Finished successfully")
