import http from 'http';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key (see "Set up your API key" above)
const API_KEY = 'AIzaSyAlWv9StZc6SR5dmmidAsr-ZypraVx6w7g'; // Replace with your actual key
const genAI = new GoogleGenerativeAI(API_KEY);

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Check if the request method is OPTIONS (preflight request)
  if (req.method === 'OPTIONS') {
    // Respond with a 200 status code to indicate that CORS is allowed
    res.writeHead(200);
    res.end();
    return;
  }

  // Check if the request method is POST and the path is '/ajax'
  if (req.method === 'POST' && req.url === '/ajax') {
    let data = '';

    // Listen for data chunks
    req.on('data', chunk => {
      data += chunk;
    });

    // Listen for the end of the request
    req.on('end', () => {
      // Here, you can process the received data
      console.log('Received data:', data);

      // For demonstration purposes, let's echo back the received data
      res.writeHead(200, { 'Content-Type': 'application/json' });
let prepromt = `
You are an AI Bot named ChatSonic,and Your creator is Nilesh Gurav.,give answers to all the questions if possible,yand keep the answers short, from here the question starts :-
`;

      // Example usage of Google Generative AI
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = prepromt+data;

      
      model.generateContent(prompt)
        .then(result => {
          const response = result.response;
          const generatedText = response.text();
          console.log(generatedText);

          // Send the generated text as part of the response
          res.end(JSON.stringify({ message: 'Received data successfully', data: generatedText }));
        })
        .catch(error => {
          console.error('Error generating content:', error);
          res.end(JSON.stringify({ error: 'Error generating content' }));
        });
    });
  } else {
    // Handle other requests
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Define the port number
const PORT = 3001;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
