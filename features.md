# ⚡ YT DeepNote — Feature Reference

> Manifest V3 Chrome Extension · YouTube Tracker · Bookmarks · Rich Notes

---

## 🏗️ Core Infrastructure

| Feature                 | What it does                                         | How it's built                                                                                   |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Chrome Side Panel**   | Side-by-side YouTube + notes without leaving the tab | `chrome.sidePanel` API, auto-enabled on YouTube tabs via `tabs.onUpdated`                        |
| **Typed Storage Layer** | All video data persisted by VideoId                  | Single `storage.ts` module over `chrome.storage.local` — never called directly elsewhere         |
| **SPA Navigation**      | Survives YouTube's client-side routing               | Listens for YouTube's custom `yt-navigate-finish` DOM event to re-inject UI on every page change |
| **Message Bus**         | Typed communication between all extension contexts   | `sendToTab()` / `sendToRuntime()` wrappers — content script ↔ service worker ↔ side panel        |

---

## 🎬 YouTube DOM Integration

| Feature                 | What it does                                            | How it's built                                                                                    |
| ----------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Bookmark Button**     | Native-feeling 🔖 button in the YouTube player controls | Injected into `.ytp-right-controls`, styled with YouTube's own `ytp-button` class                 |
| **Progress Bar Dots**   | Colored bookmark markers on the seek bar                | Colored dots injected at `left: (timestamp/duration × 100)%` inside `.ytp-progress-bar-container` |
| **Panel Toggle Banner** | "Open Notes" button in YouTube's recommendations column | Sticky banner injected at top of `#secondary`, calls `chrome.sidePanel.open()` via SW message     |
| **Live Timestamp Sync** | Real-time playback position in the side panel header    | Content script `setInterval` at 500ms → `VIDEO_TIME_UPDATE` → relayed to side panel               |

---

## 🔖 Bookmarks

| Feature                    | What it does                                 | How it's built                                                                                |
| -------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Color-coded Timestamps** | Named bookmarks in 6 colors at any timestamp | Stored as `{ timestamp, label, color, videoId }`, rendered sorted in Bookmarks pane           |
| **Click-to-Seek**          | Click any bookmark to jump to that moment    | Sends `SEEK_TO` message → content script sets `video.currentTime`                             |
| **Inline Rename**          | Double-click to rename a bookmark in place   | `contenteditable` span, blur event calls `updateBookmark()`                                   |
| **Global Hotkey Drop**     | Drop a bookmark without touching the mouse   | `Ctrl+Shift+B` → `chrome.commands` → SW gets current time → `addBookmark()` → re-renders dots |

---

## ✍️ Rich Text Editor

| Feature             | What it does                                             | How it's built                                                                                                         |
| ------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Tiptap WYSIWYG**  | Formatted editing experience, Markdown stored underneath | ProseMirror via Tiptap — HTML → Markdown via Turndown on every edit (debounced 500ms)                                  |
| **Toolbar**         | Full formatting toolbar above the editor                 | B / I / U / S / H1–H3 / Lists / Blockquote / Code / Link / Image / Timestamp / Highlight — each calls a Tiptap command |
| **Timestamp Chips** | Clickable `[▶ 3:42]` chips inline in notes               | Custom Tiptap inline node · `Ctrl+Shift+T` to insert · stored as `[▶ 3:42](ytdn://seek/222)` in Markdown               |
| **Image Support**   | Embed screenshots or images directly in notes            | File picker → canvas compression → JPEG 80% base64 → Tiptap Image node · warns at 1MB storage                          |

---

## 📋 Playlist Analytics

| Feature                  | What it does                                 | How it's built                                                                                   |
| ------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Progress Bar**         | Visual progress through the current playlist | Scrapes `ytd-playlist-panel-video-renderer` items, calculates watched / total percentage         |
| **Remaining Time + ETA** | Exact time left and estimated finish time    | Sums unwatched video durations · displays "3h 17m remaining · finish ~5:40 PM at 1×"             |
| **Video List**           | Scrollable list of all playlist videos       | Checkmarks for watched, `NOW` badge on current, click to navigate                                |
| **Edge Cases**           | Handles broken playlist states gracefully    | Private videos → `[Unavailable]` · live streams → skip ETA · YouTube Mix → "infinite mix" notice |

---

## 🔍 OCR Capture

| Feature                     | What it does                                      | How it's built                                                                                    |
| --------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Frame Capture**           | Grabs the current video frame instantly           | `Ctrl+Shift+S` → content script draws `<video>` to offscreen canvas → exports JPEG 85% base64     |
| **Local Text Extraction**   | Reads text from the captured frame, fully offline | Tesseract.js WASM (`createWorker('eng')`) — no API, no server, runs entirely in the extension     |
| **Auto-insert into Editor** | Drops extracted text into your notes at cursor    | Inserted as a blockquote with a timestamp chip above it · saved as `OcrCapture` record in storage |

---

## 🧠 Semantic Clustering

| Feature                  | What it does                                              | How it's built                                                                                     |
| ------------------------ | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Auto-grouping**        | Automatically organizes bookmarks into labeled categories | Triggers when a video has 5+ bookmarks · runs heuristic or API classifier                          |
| **Local Heuristic Mode** | Pattern-matches labels into clusters, no API needed       | Keyword lists for: Definitions · Key Points · Questions · Code Examples · Action Items · Resources |
| **Claude API Mode**      | AI-powered clustering for smarter groupings               | Sends bookmark labels to Anthropic API → returns JSON clusters · requires user's own API key       |
| **Grouped UI**           | Bookmarks pane switches to collapsible cluster view       | Flat list replaced by labeled collapsible sections when clusters exist                             |

---

## 📤 Export & Sync

| Feature                   | What it does                                          | How it's built                                                                                            |
| ------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Markdown Export**       | One-click export of notes + bookmarks as a `.md` file | Serializes `VideoRecord` → YAML frontmatter + Bookmarks table + Notes + OCR sections → `chrome.downloads` |
| **Notion Sync**           | Push notes to a Notion page for any video             | Full `chrome.identity` OAuth flow · one page per video · updates existing page if already synced          |
| **Secure Token Exchange** | OAuth without exposing secrets in extension code      | Token exchange proxied through a Cloudflare Worker · `client_secret` never lives in the extension         |

---

## 📚 Library

| Feature             | What it does                             | How it's built                                                                                |
| ------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| **All Videos View** | Browse every video you've taken notes on | Lists all `VideoId` entries from storage index with thumbnail, title, channel, bookmark count |
| **Search & Filter** | Find videos by channel, sort by activity | Client-side filtering against `storage.local` — no index server needed                        |
| **Bulk Export**     | Export multiple videos at once           | Select videos → zip of `.md` files via `chrome.downloads` or batch Notion sync                |

---

## ⌨️ Hotkeys

| Shortcut       | Action                                   |
| -------------- | ---------------------------------------- |
| `Ctrl+Shift+B` | Drop a bookmark at current timestamp     |
| `Ctrl+Shift+T` | Insert timestamp chip at cursor in notes |
| `Ctrl+Shift+S` | Capture current frame + run OCR          |
