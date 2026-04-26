require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies and serve static files
app.use(express.json());
app.use(express.static('public'));

// Initialize Gemini
const ai = new GoogleGenAI({});

// We keep a single chat session in memory for this simple app
// This will remember the conversation history!
let chatSession;

try {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
  });
} catch (error) {
  console.error("Failed to initialize Gemini:", error);
}

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const language = req.body.language || 'English';

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!chatSession) {
    return res.status(500).json({ error: 'AI is not initialized. Check your API key.' });
  }

  try {
    const prompt = `${userMessage}\n\n(Please respond in ${language})`;
    const response = await chatSession.sendMessage({
      message: prompt
    });
    
    res.json({ reply: response.text });
  } catch (error) {
    console.error('Error communicating with AI:', error.message);
    res.status(500).json({ error: 'Failed to generate response. Ensure your API key is valid.' });
  }
});

// Restart the conversation
app.post('/api/reset', (req, res) => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
  });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Oryn AI Server running!`);
  console.log(`👉 Open http://localhost:${PORT} in your browser\n`);
});
