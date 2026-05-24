# YT DeepNote v1.2.0 Release

We've supercharged YT DeepNote with a highly-requested feature for course-takers: The Playlist Tracker, along with massive under-the-hood stability improvements for data sync and usability!

## ✨ What's New in v1.2.0

### 1. YouTube Playlist Progress Tracker
When navigating to a YouTube playlist, YT DeepNote now silently scrapes the series and adds a brand new **Playlist Progress** section to your UI.
- Displays a dynamic progress bar for your entire playlist.
- A beautiful checklist allows you to manually tick off videos you've finished.
- **Auto-Completion:** A smart `timeupdate` hook checks when you pass the 90% completion mark of any video and automatically marks it as done.
- The Side Panel seamlessly fetches playlist data from your active YouTube tab to stay perfectly synced.

### 2. Custom 8-Way Window Resizing
We ripped out the standard, restrictive CSS resize handles. The floating UI now acts like a native desktop window—you can drag and resize it from any of the 4 edges or 4 corners!

### 3. Collapsible UI Sections
You can now click on the section titles (e.g., "Bookmarks", "Playlist Progress") to collapse their contents, freeing up valuable screen real estate while you focus on note-taking.

### 4. Cross-Tab Live Storage Syncing
We implemented a robust `chrome.storage.onChanged` listener. If you have YT DeepNote open in the Side Panel and on the floating YouTube tab simultaneously, typing in one will instantly and magically sync the characters to the other.

### 5. Persistent Image Resizing
Resizing images via native browser handles (dragging the image corners) inside the WYSIWYG editor previously failed to save. We added a `mouseup` interceptor that accurately captures native resizing bounds and saves them.
- Our custom Markdown exporter now intelligently exports `<img>` tags with explicit width measurements (e.g., `<img width="400">`) instead of standard Markdown `![]()` syntax, ensuring your images look perfect in Notion/Obsidian.

---

# YT DeepNote v1.1.0 Release

Congratulations! The beta tags have been dropped, and YT DeepNote v1.1.0 is officially wrapped up and pushed to your main branch. This version introduces massive improvements to the architecture and user experience.

## ✨ What's New in v1.1.0

### 1. Chrome Side Panel Integration
The "Dock" button no longer relies on a simulated sidebar. It now triggers Chrome's Native Side Panel API (`chrome.sidePanel`), shifting your entire WYSIWYG note-taking environment into a resilient, permanent browser sidebar.
- It stays open even if you navigate between different YouTube videos.
- It fetches video timestamps and screenshots remotely via Chrome Extension Messaging.
- It seamlessly syncs with your floating UI when toggled.

### 2. Full Space Editor Mode
The editor toolbar now features an Expand icon that collapses the video title and bookmarks list, letting your Markdown editor stretch to use 100% of the available vertical space. Perfect for deep focus and long essays.

### 3. Native Markdown Preview
We implemented a sleek, developer-styled monospace Markdown Preview. A single click hides the visual editor and shows you the raw, export-ready syntax highlighting of your notes. 

### 4. Smart Format Highlighting
The formatting toolbar is now dynamic. As you click or type anywhere in your notes, the Bold, Italic, and Underline buttons instantly glow or fade based on the formatting of the text underneath your cursor—even accommodating edge-case selections.

### 5. Seamless "Fullscreen" Settings
By default, the floating red launcher and the immersive UI now intelligently hide themselves when you enter true Fullscreen mode in YouTube, protecting your cinematic experience. You can toggle this behavior at any time from the new checkbox in the settings menu.

## 🛠️ Quality of Life Fixes
- **Bookmark Overflows:** The bookmarks list now features an elegant internal scrollbar to prevent it from pushing the UI off-screen.
- **Color Picker Scaling:** The active red bookmark circle now expands beautifully without being cropped by container edges.
- **Drag Safety:** Added rigorous screen-boundary constraints to ensure the floating UI can never be dragged out-of-bounds or lost under your browser tabs.
- **Connection Recovery:** Clicking the 'X' to close the native Side Panel immediately communicates with the YouTube tab to restore your floating red launcher.
