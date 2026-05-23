# YT DeepNote

**YT DeepNote** is a powerful Google Chrome extension designed for students, researchers, and self-learners. It transforms the YouTube player into an advanced learning environment. Take beautiful, timestamped Markdown notes, drop precision bookmarks, capture on-screen video screenshots, and seamlessly export or 1-click sync everything directly to Notion.

## Features (v1.0.0-beta)

*   **Float & Dock Overlay Editor:** An immersive, glassmorphic block-based editor overlaid directly on the video.
*   **Rich Auto-Formatting:** Full support for Markdown shortcuts (`#`, `> `, ` ``` `, `- `, `1. `).
*   **Live Bookmarks:** Drop bookmarks on the video timeline with instant click-to-seek playback.
*   **Video Screenshots:** One-click to capture high-quality video frames directly into your notes.
*   **Notion Sync:** Sync your entire learning session (Title, URL, Bookmarks, and Notes) directly into a Notion Database via secure OAuth.
*   **Markdown Export:** Download your notes to a beautifully formatted `.md` file for Obsidian or Logseq.
*   **Zero-Bleed Sandboxing:** Housed safely in a Shadow DOM so YouTube's CSS never conflicts with your writing.

## Installation (Developer Mode)

1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the folder containing this extension.
5. Open any YouTube video and click the YT DeepNote floating action button!

## Notion Integration (Developer Setup)

To enable the 1-click Notion Sync feature, you need to set up a free Notion Integration and deploy a tiny OAuth proxy.

### 1. Create a Notion Integration
1. Go to [Notion Developers](https://www.notion.so/my-integrations).
2. Click **New integration**, name it "YT DeepNote", and select your workspace.
3. Once created, go to the **Distribution** tab and make it **Public**.
4. Set the Redirect URI to: `https://<YOUR_CHROME_EXTENSION_ID>.chromiumapp.org/`
5. Copy your **Client ID** and **Client Secret**.

### 2. Deploy the OAuth Proxy
Because Chrome Extensions cannot securely store client secrets, you must deploy the provided proxy server.
1. Navigate to the `notion-oauth-proxy/` folder in this repository.
2. Deploy the folder to [Vercel](https://vercel.com/) or [Render](https://render.com/).
3. In your Vercel/Render dashboard, add the following Environment Variables:
   *   `NOTION_CLIENT_ID` = (from Notion)
   *   `NOTION_CLIENT_SECRET` = (from Notion)
   *   `EXTENSION_REDIRECT_URI` = `https://<YOUR_CHROME_EXTENSION_ID>.chromiumapp.org/`

### 3. Update the Extension Code
1. Open `background.js` in the extension root.
2. Update the configuration constants at the top of the file:
   ```javascript
   const NOTION_CLIENT_ID = 'your_client_id_here';
   const OAUTH_PROXY_URL = 'https://your-deployed-proxy.vercel.app/auth/notion';
   ```
3. Reload the extension in Chrome!

## Roadmap
We are actively building out exciting new capabilities for future releases, including Tiptap WYSIWYG editing, real-time sync, local OCR screenshot extraction, semantic clustering using Anthropic Claude, and a global library dashboard!

## License
MIT License. See `LICENSE` for more information.
