import sys
import urllib
from lxml.html import fromstring

# Extract URLs from superchargers.txt
# Use those URLs to crawl supercharger pages for stall numbers

def main(argv):

    sc_file = open("superchargers.txt","rw")
    url_prefix = "url: http://www.teslamotors.com/supercharger/"
    lines = sc_file.readlines()

    station = ''
    elevation = ''
    for line in lines:
        raw_line=line.rstrip('\n')

        # Get station name
        if "name:" in raw_line:
            words = raw_line.split(": ")
            station = words[1]

        # Use 'elevation' string for the future location in the data file for stall info
        if "elevation:" in line:
            elevation = line

        # Crawl supercharger webpage if it has an official page listed
        if url_prefix in raw_line:
            url = raw_line.split(" ")[1]
            content = urllib.urlopen(url).read()
            doc = fromstring(content)
            elements = doc.find_class('stalls')
            if elements > 1:
                element = elements[0]
                inner_text = element.text_content()

                # Change inner text from unicode to ascii 
                words = inner_text.encode('ascii','ignore')

                # Format is "Charging Stalls – <INTEGER>" 
		# Extract integer from words
                int_array = [int(s) for s in words.split() if s.isdigit()]
                num_stalls = int_array[0]
                print "%s: %d" % (station, num_stalls)
            else:
                print "%s: no data for stalls " % (station)

if __name__ == "__main__":
    main(sys.argv[1:])
