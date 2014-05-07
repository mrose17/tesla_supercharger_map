import sys
import urllib
from lxml.html import fromstring

# Uses URLs from superchargers.txt to crawl supercharger websites for stall count
# This script assumes that URLs are listed BEFORE the dateOpened line

def main(argv):
    url_prefix = "url: http://www.teslamotors.com/supercharger/"
    readonly_sc_file = open("../../webcontent/scripts/siteload/superchargers.txt","r")
    sc_lines = readonly_sc_file.readlines()
    readonly_sc_file.close()

    sc_file = open("../../webcontent/scripts/siteload/superchargers.txt","w+")
    station = ''
    num_stalls = -1 # -1 means stall count for station has not been retrieved

    for sc_line in sc_lines:
        if "numStalls:" not in sc_line:
            sc_file.write(sc_line)

        # Get supercharger name
        raw_line = sc_line.rstrip('\n')
        if "name:" in raw_line:
            num_stalls = -1 # new station entry
            words = raw_line.split(": ")
            station = words[1]

        # Crawl the supercharger's official webpage on teslamotors.com
        if url_prefix in raw_line:
            url = raw_line.split(" ")[1]
            content = urllib.urlopen(url).read()
            doc = fromstring(content)
            elements = doc.find_class('stalls')
            if len(elements) > 0: # CSS class 'stalls' has been found
                element = elements[0]
                inner_text = element.text_content()

                # Format is "Charging Stalls \xe2 NUM_STALLS"
                # Change inner text from unicode to ascii
                encoded_line = inner_text.encode('ascii','ignore')

                # Extract integer from encoded_line
                int_array = [int(s) for s in encoded_line.split() if s.isdigit()]
                num_stalls = int_array[0]
                print "%s: %d" % (station, num_stalls)

        if "dateOpened:" in sc_line and num_stalls > -1:
            sc_file.write('numStalls: {0}\n'.format(num_stalls))


    sc_file.close()

if __name__ == "__main__":
    main(sys.argv[1:])
