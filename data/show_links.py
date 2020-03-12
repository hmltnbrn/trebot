import sys
from urllib.request import urlopen
import json
from bs4 import BeautifulSoup

base_url = "http://j-archive.com/showseason.php?season="

def get_show_links(link):
    html = BeautifulSoup(urlopen(link), "lxml")
    links = html.find(id="content").find('table').findAll('td', {'align': 'left'})
    return [i.find('a')['href'] for i in links][::-1]

def get_last_season():
    print("Finding last season...")
    link = "http://j-archive.com/listseasons.php"
    html = BeautifulSoup(urlopen(link), "lxml")
    seasons = html.find(id="content").find('table').findAll('a')
    return int(seasons[0].find(text=True).split(" ")[1])

def get(first_season = 1, last_season = None):
    if not last_season:
        last_season = get_last_season()
    print("Starting with season " + str(first_season) + " and ending with season " + str(last_season))

    all_links = {}

    for season in range(first_season, last_season + 1):
        sys.stdout.write("\rFinding shows from season " + str(season) + "...")
        all_links[season] = get_show_links(base_url + str(season))

    return all_links

if __name__ == "__main__":
    print("Generating show links...")

    if len(sys.argv) == 3:
        first_season = int(sys.argv[1]) # first argument is season to start on
        last_season = int(sys.argv[2]) # second argument is season to end on
    elif len(sys.argv) == 2:
        first_season = int(sys.argv[1]) # first argument is season to start on
        last_season = get_last_season() # no second argument will default to last possible season
    else:
        first_season = 1 # no arguments will default to first season and last possible season
        last_season = get_last_season()

    print("Starting with season " + str(first_season) + " and ending with season " + str(last_season))

    all_links = {}

    for season in range(first_season, last_season + 1):
        sys.stdout.write("\rFinding shows from season " + str(season) + "...")
        all_links[season] = get_show_links(base_url + str(season))

    with open('show_links.json', 'w+') as f:
        json.dump(all_links, f)
        print("Finished successfully")
