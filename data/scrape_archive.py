import sys
import json
import show_links
import show_data

if __name__ == "__main__":
    print "Beginning scrape"

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

    jeopardy_data = []

    for i in xrange(len(links)):
        print str(i + 1) + '/' + str(len(links))
        jeopardy_data += show_data.get(links[i])

    with open('jeopardy_data.json', 'w+') as f:
        json.dump(jeopardy_data, f)
        print "Finished successfully"
