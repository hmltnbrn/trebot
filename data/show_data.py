import sys
import urllib2
import json
import re
from bs4 import BeautifulSoup

# {"category":"3-LETTER WORDS",
# "air_date":"2004-12-31",
# "question":"'In the title of an Aesop fable, this insect shared billing with a grasshopper'",
# "value":"$200",
# "answer":"the ant",
# "round":"Jeopardy!",
# "show_number":"4680"}

class Show(object):

    def __init__(self, link):
        self.link = link
        self.html = BeautifulSoup(urllib2.urlopen(link), "html.parser")
        self.show_number, self.air_date = self.html.find(id='game_title').find('h1').find(text=True).split(' - ')
        self.rounds = self.set_rounds()

    def set_rounds(self):
        first_round = Round("Jeopardy!", self.html.find(id='jeopardy_round').find(class_='round'))
        second_round = Round("Double Jeopardy!", self.html.find(id='double_jeopardy_round').find(class_='round'))
        return [first_round, second_round]

    def get_data(self):
        data = []
        for round in self.rounds:
            for category in round.categories:
                for clue in category.clues:
                    data.append({
                        "link": self.link,
                        "air_date": self.air_date,
                        "show_number": self.show_number.split(" #")[1],
                        "round": round.name,
                        "category": category.name,
                        "value": clue.value,
                        "question": clue.question,
                        "answer": clue.answer
                    })
        return data

class Round(Show):

    def __init__(self, name, html):
        self.name = name
        self.html = html
        self.categories = self.set_categories()

    def set_categories(self):
        categories = []
        cats = self.html.findAll(class_='category')
        clues = self.html.findAll(class_='clue')
        for i in xrange(len(cats)):
            categories.append(Category(cats[i].find(class_='category_name').find(text=True), clues[i:len(clues):6]))
        return categories

class Category(Round):

    def __init__(self, name, html):
        self.name = name
        self.html = html
        self.clues = self.set_clues()

    def set_clues(self):
        clues = []
        for i in xrange(len(self.html)):
            value = self.html[i].find(class_="clue_value")
            dd_value = self.html[i].find(class_="clue_value_daily_double")
            question = self.html[i].find(class_="clue_text")
            answer_div = self.html[i].find("div")
            if(value and question and answer_div):
                clues.append(Clue(value.find(text=True), question.find(text=True), re.search('<em class="correct_response">(.*)</em>', answer_div["onmouseover"]).group(1)))
            elif(dd_value and question and answer_div):
                clues.append(Clue(dd_value.find(text=True), question.find(text=True), re.search('<em class="correct_response">(.*)</em>', answer_div["onmouseover"]).group(1)))
        return clues

class Clue(Category):

    def __init__(self, value, question, answer):
        self.value = value
        self.question = question
        self.answer = answer

def get(link):
    show = Show(link)

    return show.get_data()

if __name__ == "__main__":
    show = Show(sys.argv[1]) # first argument is j-archive link to show

    data = show.get_data()

    with open('show_data.json', 'w+') as f:
        json.dump(data, f)
