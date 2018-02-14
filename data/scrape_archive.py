import sys
import show_links
import show_data
import json

if __name__ == "__main__":
    first_season = int(sys.argv[1]) # first argument is season to start on

    jeopardy_data = []

    links = show_links.get(first_season)

    for i in xrange(len(links)):
        print str(i + 1) + '/' + str(len(links))
        jeopardy_data += show_data.get(links[i])

    with open('jeopardy_data.json', 'w+') as f:
        json.dump(jeopardy_data, f)
