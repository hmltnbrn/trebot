import sys
import json
import show_links
import show_data

if __name__ == "__main__":
    print "Beginning scrape"

    if len(sys.argv) == 3:
        first_season = int(sys.argv[1]) # first argument is season to start on
        last_season = int(sys.argv[2]) # second argument is season to end on
    elif len(sys.argv) == 2:
        first_season = int(sys.argv[1]) # first argument is season to start on
        last_season = None # no second argument will default to last possible season
    else:
        first_season = None # no arguments will default to first season and last possible season
        last_season = None

    jeopardy_data = []

    links = show_links.get(first_season, last_season)

    for i in xrange(len(links)):
        print str(i + 1) + '/' + str(len(links))
        jeopardy_data += show_data.get(links[i])

    with open('jeopardy_data.json', 'w+') as f:
        json.dump(jeopardy_data, f)
        print "Finished successfully"
