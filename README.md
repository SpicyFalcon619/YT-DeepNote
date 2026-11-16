# YT DeepNote

**Take real notes on YouTube, without leaving the video.** A Chrome extension that turns a tutorial into a study session: timestamped Markdown notes, bookmarks on the progress bar, screenshots, playlist progress, and one-click sync of the whole session to Notion. It adds no framework and runs inside YouTube's page.

## Features (v1.2.0)

| | |
|---|---|
| **Side panel** | Keep your notes in Chrome's persistent side panel; they survive tab changes and stay in sync with the floating editor |
| **Timestamp chips** | `Alt+T` drops a clickable timestamp into the note; click it to jump the video to that moment |
| **Bookmarks** | A button in the player controls, plus coloured dots on the progress bar. `Alt+B` bookmarks from anywhere |
| **Playlist tracker** | Detects a playlist, builds a checklist and marks videos done automatically at 90% watched |
| **Screenshots** | Capture a video frame straight into the note, with resizable images |
| **Rich formatting** | Markdown shortcuts (`#`, `>`, ``` ``` ```, `-`, `1.`) and bold, italic, underline, strikethrough |
| **Home dashboard** | View, manage and export every note you have saved, across videos |
| **Notion sync** | Send title, URL, bookmarks and notes to a Notion database in one click |
| **Markdown export** | Download a `.md` file for Obsidian or Logseq |
| **Resizable window** | Drag any edge or corner, or go full-screen |
| **Isolated styling** | The editor lives in a Shadow DOM, so YouTube's CSS never touches your notes |

## Install (developer mode)

1. Download or clone this repository.
2. Open `chrome://extensions/` and turn on **Developer mode**.
3. Click **Load unpacked** and choose this folder.
4. Open any YouTube video and click the YT DeepNote button.

## Set up Notion sync

1. Create an integration at [notion.so/my-integrations](https://www.notion.so/my-integrations), name it "YT DeepNote", and copy its **Internal Integration Secret**.
2. Create a Notion database for your notes. In its `...` menu choose **Add connections** and select your integration.
3. Copy the database ID from its URL (the 32-character part before `?v=`).
4. In YT DeepNote, open **Settings**, paste the secret and the database ID, and save.

The token is stored in the extension's own storage and is sent only to Notion. See the [privacy policy](PRIVACY_POLICY.md).

## Keyboard shortcuts

| Shortcut | Where | Action |
|---|---|---|
| `Alt+B` | Anywhere on a video page | Bookmark the current moment |
| `Alt+T` | In the editor | Insert a timestamp chip |

## Roadmap

- [ ] Several notes and folders per video
- [ ] Local OCR: extract text from captured frames

See the [changelog](CHANGELOG.md) for what changed in each release.

## License

[MIT](LICENSE)
