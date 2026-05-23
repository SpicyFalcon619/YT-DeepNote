# YT DeepNote

**YT DeepNote** is a powerful Google Chrome extension designed for students, researchers, and self-learners. It transforms the YouTube player into an advanced learning environment. Take beautiful, timestamped Markdown notes, drop precision bookmarks, capture on-screen video screenshots, and seamlessly export or 1-click sync everything directly to Notion.

## Features (v1.2.0-beta)

- **YouTube Player Integration:** A native Bookmark button injected directly into the YouTube player controls, and colored bookmark dots injected directly onto the YouTube progress scrub bar.
- **Clickable Timestamp Chips:** Press `Alt+T` to drop interactive timestamp chips into your notes. Click them to instantly seek the video.
- **Resizable & Fullscreen Editor:** Drag the bottom right corner to resize the floating overlay, or click the Maximize button for a distraction-free fullscreen canvas.
- **Global Home Dashboard:** A sleek, dedicated dashboard to view, manage, and export all your saved notes across different videos.
- **Rich Auto-Formatting:** Full support for Markdown shortcuts (`#`, `> `, ` ``` `, `- `, `1. `), as well as rich text mapping for bold, italics, underline, and strikethrough.
- **Live Bookmarks:** Drop bookmarks on the video timeline with instant click-to-seek playback.
- **Video Screenshots:** One-click to capture high-quality video frames directly into your notes.
- **Notion Sync:** Sync your entire learning session (Title, URL, Bookmarks, and Notes) directly into a Notion Database.
- **Markdown Export:** Download your notes to a beautifully formatted `.md` file for Obsidian or Logseq.

## Keyboard Shortcuts

- `Alt+B` : **Quick Bookmark** (Global). Drops a bookmark at the current video timestamp.
- `Alt+T` : **Insert Timestamp** (While editing). Drops a clickable timestamp chip into your notes.

## Installation (Developer Mode)

1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the folder containing this extension.
5. Open any YouTube video and click the YT DeepNote floating action button!

## Notion Integration (1-Minute Setup)

To enable the 1-click Notion Sync feature, you just need a standard Notion Internal Integration token.

### 1. Create a Notion Integration

1. Go to [Notion Developers](https://www.notion.so/my-integrations).
2. Click **New integration**, name it "YT DeepNote", and select the workspace where your database lives.
3. Once created, copy the **Internal Integration Secret**.

### 2. Connect Your Database

1. Create a new Notion Database for your notes.
2. Click the `...` menu in the top right of your Notion database page.
3. Click **Add connections** and search for "YT DeepNote" (the integration you just created). Select it to give it access.
4. Copy the Database ID from the URL.
   _Example: `https://notion.so/workspace/`**`1234567890abcdef1234567890abcdef`**`?v=...` (The bolded part is your ID)._

### 3. Link the Extension

1. Open a YouTube video and click the YT DeepNote button.
2. Click the **Settings (⚙️)** icon in the top right.
3. Paste your **Notion API Token** (the secret you copied) and your **Database ID**.
4. Click Save!

## Roadmap

We are actively building out exciting new capabilities for future releases, including Tiptap WYSIWYG editing, real-time sync, local OCR screenshot extraction, semantic clustering using Anthropic Claude, and a global library dashboard!

## License

MIT License. See `LICENSE` for more information.
