const axios = require('axios');
const cheerio = require('cheerio');

// Function to generate words from the prompt
async function generateWordsFromPrompt(prompt) {
  // Replace spaces in the prompt with underscores to form the Wikipedia URL
  const promptQuery = prompt.replace(/ /g, '_');
  const url = `https://en.wikipedia.org/wiki/${promptQuery}`;

  try {
    // Fetch the HTML content of the page
    const response = await axios.get(url);

    if (response.status === 200) {
      // Parse the HTML content using Cheerio
      const $ = cheerio.load(response.data);

      // Extract all text content from the page and clean it
      const text = $('body').text().toLowerCase();
      const words = text.match(/\b\w+\b/g);

      // Count the frequency of each word
      const wordCounts = {};
      words.forEach((word) => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });

      // Get the 100 most common words
      const commonWords = Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 100)
        .map(([word]) => word);

      return commonWords;
    } else {
      console.log(`Failed to fetch the page. Status code: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.error('Error fetching the page:', error);
    return [];
  }
}

// Function to open a distracted tab
function openDistractedTab() {
  const url = "data:text/html;charset=utf-8,<h1>You're getting distracted!</h1><p>Get back to work!</p>";
  require('child_process').exec(`start chrome "${url}"`);
}
prompt=null
// Main function to handle scraping and checking for distractions
async function main() {
  const prompt = prompt("Enter your prompt: ");
  const generatedWords = await generateWordsFromPrompt(prompt);
  console.log('Generated words based on the prompt:', generatedWords);

  // Fetching the Wikipedia page again to analyze headers
  const url = `https://en.wikipedia.org/wiki/${prompt.replace(/ /g, '_')}`;
  try {
    const response = await axios.get(url);

    if (response.status === 200) {
      const $ = cheerio.load(response.data);

      // Extract keywords from meta tags
      const keywordsMeta = $('meta[name="keywords"]').attr('content');
      const keywords = keywordsMeta ? keywordsMeta.split(',').map((keyword) => keyword.trim()) : [];
      console.log('Keywords:', keywords);

      // Extract main headers (h1, h2, etc.)
      const headers = {};
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag) => {
        headers[tag] = $(tag).map((_, header) => $(header).text().trim()).get();
      });

      // Display the headers
      Object.entries(headers).forEach(([tag, content]) => {
        console.log(`\n${tag.toUpperCase()} Headers:`);
        content.forEach((header) => console.log(`- ${header}`));
      });

      // Check for the existence of generated words in headers
      const foundTerms = generatedWords.reduce((acc, term) => {
        acc[term] = Object.values(headers).some((headers) =>
          headers.some((header) => header.toLowerCase().includes(term))
        );
        return acc;
      }, {});

      let ctr = Object.values(foundTerms).filter(Boolean).length;

      Object.entries(foundTerms).forEach(([term, found]) => {
        console.log(`'${term}' found in headers: ${found}`);
      });

      // Check if the count of found terms meets the threshold
      const threshold = 0.2 * generatedWords.length;
      if (ctr >= threshold) {
        console.log('Productive');
      } else {
        console.log('YOU ARE DISTRACTED!!');
        setTimeout(openDistractedTab, 5000); // Wait for 5 seconds before opening the distracting tab
      }
    } else {
      console.log(`Failed to fetch the page. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching the page:', error);
  }
}

main();
