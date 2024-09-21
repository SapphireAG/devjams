const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Ensure you have node-fetch installed
const app = express();
const port = 3001;

app.use(cors()); // Allow all origins, methods, and headers
app.use(express.json()); // Middleware to parse JSON bodies

// In-memory storage for saved prompts
let savedPrompts = [];

// Endpoint to get saved prompts
app.get('/prompts', (req, res) => {
  res.json({ savedPrompts });
});

// Endpoint to save a new prompt
app.post('/prompts', (req, res) => {
  const { prompt } = req.body;
  if (prompt) {
    savedPrompts.push(prompt);
    res.json({ message: 'Prompt saved.', savedPrompts });
  } else {
    res.status(400).json({ message: 'Prompt is required.' });
  }
});

// Endpoint to fetch response from Gemini API
app.post('/gemini', async (req, res) => {
  const { prompt } = req.body;
  const geminiApiKey = 'AIzaSyB_Q7STnMR74cWMyWg3hb8VDGt8UWsmJKc'; // Replace with your actual Gemini API key

  try {
    // Constructing the prompt to explicitly ask for 3 relevant links and 100 relevant words
    const enhancedPrompt = ${prompt}\n\nPlease provide three relevant website links and a list of 100 words that are closely related to the topic.;

    const response = await fetch(
      https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey},
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: enhancedPrompt, // Use the modified prompt here
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const generatedContent = data.candidates[0]?.content.parts[0]?.text || '';

    // Function to extract up to 3 URLs from the generated content
    const extractUrls = (content) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g; // Regex pattern to match URLs
      const matches = content.match(urlRegex); // Find all URL matches
      return matches ? matches.slice(0, 3) : []; // Return the first 3 matches or an empty array
    };

    // Function to extract 100 words from the generated content
    const extractWords = (content) => {
      const wordList = content.match(/\b(\w+)\b/g); // Match all words
      return wordList ? wordList.slice(0, 100) : []; // Return the first 100 words
    };

    const websites = extractUrls(generatedContent);
    const search_terms = extractWords(generatedContent);

    // If URLs and words are found, respond with them
    if (websites.length > 0 && search_terms.length > 0) {
      res.json({
        message: 'Top 3 links and related words found:',
        links: websites,
        words: search_terms,
      });
    } else {
      res.json({
        message: 'No links or related words found in the response.',
      });
    }
  } catch (error) {
    console.error('Error fetching response:', error.message);
    res.status(500).json({ message: 'Error fetching response.', error: error.message });
  }
});

app.listen(port, () => {
  console.log(Server running on http://localhost:${port});
});