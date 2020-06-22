import sys
import json
import datetime
import argparse
from pymongo import MongoClient
import game_links
import game_data

def add_to_database(client, collection_name, data, season):
    db = client['jeopardy']
    collection = db[collection_name]
    collection.insert_many(data)
    print("Inserted season " + str(season) + " data")

if __name__ == "__main__":
    with open('credentials.json') as cred_file:
        cred = json.load(cred_file)

    client = MongoClient(cred["uri"])

    collection_name = datetime.datetime.today().strftime('%Y%m%d') # collection name follows pattern of yyyymmdd for current date

    parser = argparse.ArgumentParser(description="Scrape J! Archive")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-s", "--season", nargs=2, metavar=('start_season', 'end_season'), type=int, choices=range(1, 37), help="Scrape specific seasons")
    group.add_argument("-ss", "--season-start", nargs=1, metavar=('start_season'), type=int, choices=range(1, 37), help="Scrape from start season and end at end of show")
    group.add_argument("-a", "--all", action='store_true', help="Scrape all seasons")
    args = parser.parse_args()

    if args.all:
        links = game_links.get()
    elif args.season:
        if args.season[0] > args.season[1]:
            parser.error("First season must be less than last season")
        else:
            links = game_links.get(args.season[0], args.season[1])
    elif args.season_start:
        links = game_links.get(args.season_start[0])
    else:
        parser.error("There's been an error. Oops.")

    for season in links:
        jeopardy_data = []
        length = len(links[season])
        for i in range(length):
            jeopardy_data += game_data.get(links[season][i], season)
            amtDone = float(i+1)/float(length)
            if(len(jeopardy_data) > 0):
                sys.stdout.write("\rSeason " + str(season) + " Progress: [{0:50s}] {1:.1f}%".format('#' * int(amtDone * 50), amtDone * 100) + " Episode " + jeopardy_data[-1]["show_number"] + " done...")
        sys.stdout.write("\n")
        add_to_database(client, collection_name, jeopardy_data, season)

    print("Data successfully uploaded")
