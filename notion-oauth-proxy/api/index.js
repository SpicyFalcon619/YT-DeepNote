const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// These environment variables MUST be set in your Vercel/Render dashboard
const CLIENT_ID = process.env.NOTION_CLIENT_ID;
const CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;
const REDIRECT_URI = process.env.EXTENSION_REDIRECT_URI; 

app.post('/auth/notion', async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  // Notion requires Basic Auth for token exchange
  const encoded = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  
  try {
    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encoded}`
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to exchange token');
    }
    
    res.json(data); // Returns { access_token, workspace_name, etc. }
  } catch (error) {
    console.error('OAuth Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// For local testing
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
}

module.exports = app;
