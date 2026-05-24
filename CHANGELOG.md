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

## Ready to Publish
You can now zip up this directory and publish **YT DeepNote v1.1.0** to the Chrome Web Store! Excellent work driving these UX improvements.
