import requests
import webbrowser
import time
from bs4 import BeautifulSoup

def open_distracted_tab():
    url = "data:text/html;charset=utf-8,%3Ch1%3EYou're%20getting%20distracted!%3C%2Fh1%3E%3Cp%3EGet%20back%20to%20work!%3C%2Fp%3E"
    webbrowser.open_new_tab(url)

# URL of the webpage you want to scrape
url = 'https://en.wikipedia.org/wiki/FIFA_World_Cup'  # Replace with the target URL

# Fetch the HTML content of the page
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract keywords from meta tags
    keywords_meta = soup.find('meta', attrs={'name': 'keywords'})
    if keywords_meta:
        keywords = keywords_meta.get('content', '').split(',')
        print('Keywords:', [keyword.strip() for keyword in keywords])
    else:
        print('No keywords found.')

    # Extract main headers (h1, h2, etc.)
    headers = {}
    for tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
        headers[tag] = [header.get_text(strip=True) for header in soup.find_all(tag)]
    
    # Display the headers
    for tag, content in headers.items():
        print(f'\n{tag.upper()} Headers:')
        for header in content:
            print(f'- {header}')
else:
    print(f"Failed to fetch the page. Status code: {response.status_code}")

# Example: Check for the existence of specific words in headers
search_terms = ['python', 'API', 'Data', 'Programming']
found_terms = {
    term: any(term.lower() in header.lower() for headers in headers.values() for header in headers)
    for term in search_terms
}
ctr = sum(found_terms.values())  # Count how many search terms were found

for term, found in found_terms.items():
    print(f"'{term}' found in headers: {found}")

# Check if the count of found terms meets the threshold
threshold = 0.2 * len(search_terms)
if ctr >= threshold:
     pass
else:
    print("YOUR DISTRACTED!!")
    time.sleep(5)  # Wait for 5 seconds before opening the distracting tab
    open_distracted_tab()
