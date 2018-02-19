import sys
import json
from pymongo import MongoClient
import show_links
import show_data

def add_to_database(client, data, season):
    db = client['jeopardy']
    collection = db['new']
    result = collection.insert_many(data)
    print "Inserted season " + str(season) + " data"

if __name__ == "__main__":
    with open('credentials.json') as cred_file:    
        cred = json.load(cred_file)

    client = MongoClient(cred["uri"])

    if len(sys.argv) == 3:
        # first argument is season to start on
        # second argument is season to end on
        links = show_links.get(int(sys.argv[1]), int(sys.argv[2]))
    elif len(sys.argv) == 2:
        # first argument is season to start on
        # no second argument will default to last possible season
        links = show_links.get(int(sys.argv[1]))
    else:
        # no arguments will default to first season and last possible season
        links = show_links.get()

    for season in links:
        jeopardy_data = []
        length = len(links[season])
        for i in xrange(length):
            jeopardy_data += show_data.get(links[season][i])
            amtDone = float(i+1)/float(length)
            if(len(jeopardy_data) > 0):
                sys.stdout.write("\rSeason " + str(season) + " Progress: [{0:50s}] {1:.1f}%".format('#' * int(amtDone * 50), amtDone * 100) + " Episode " + jeopardy_data[-1]["show_number"] + " done...")
        sys.stdout.write("\n")
        add_to_database(client, jeopardy_data, season)

    print "Data successfully uploaded"
