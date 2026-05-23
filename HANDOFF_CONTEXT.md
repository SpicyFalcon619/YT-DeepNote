# YT DeepNote — Full Project Handoff Context
# For use in a new Claude conversation. Paste this entire document.

---

## ROLE & OPERATING MODE

You are the Lead Systems Architect and Autonomous Project Manager for **YT DeepNote**, a Manifest V3 Chrome Extension. You take full ownership, make all architectural decisions, and drive development without waiting for hand-holding. Be blunt and code-first. If a request is structurally unsound, say so and propose the correct alternative.

---

## PROJECT SUMMARY

**YT DeepNote** is a Chrome Extension (MV3) that provides:
- A `chrome.sidePanel` for side-by-side YouTube + notes
- WYSIWYG note editor (Tiptap) that stores Markdown under the hood
- Color-coded timestamp bookmarks with global hotkeys
- Playlist analytics (progress bar, remaining time)
- Screenshot-to-Note with OCR (Tesseract.js, fully local)
- Semantic bookmark clustering (auto-groups bookmarks into labeled categories)
- Local `.md` export + Notion API sync via full `chrome.identity` OAuth
- **"Integrated into YouTube" UI approach** — content script injects UI elements directly into YouTube's DOM (floating bookmark button on the player, timestamp chips in the progress bar, a small panel-toggle button) in addition to the side panel

---

## TECH STACK (LOCKED — DO NOT CHANGE)

| Concern | Decision |
|---|---|
| Build | Vite + vanilla TypeScript (no framework) |
| Editor | Tiptap (ProseMirror-based, headless) |
| Styling | Tailwind CSS (JIT, purged) |
| OCR | Tesseract.js WASM (local, no server) |
| Markdown serialization | Tiptap → Turndown → `.md` string |
| Notion sync | Official Notion API v1, `chrome.identity` OAuth |
| Storage | `chrome.storage.local` only, all writes through `storage.ts` |

---

## PHASE STATUS

| Phase | Title | Status |
|---|---|---|
| 1 | Manifest, scaffold, storage layer, side panel shell | ✅ COMPLETE |
| 2 | Content script DOM bridge + YouTube integration injection | ⬅️ NEXT |
| 3 | Bookmark engine + hotkeys |  |
| 4 | Rich text editor (Tiptap WYSIWYG → Markdown) |  |
| 5 | Playlist analytics |  |
| 6A | OCR capture (Tesseract.js) |  |
| 6B | Semantic clustering |  |
| 7 | Export (.md) + Notion OAuth sync |  |
| 8 | Polish, edge cases, packaging |  |

---

## PHASE 1 — WHAT WAS BUILT (COMPLETE)

### File tree (all exist, working)
```
yt-deepnote/
├── manifest.json              ← MV3, all permissions declared
├── package.json               ← All deps for all phases declared upfront
├── vite.config.ts             ← Multi-entry: SW + content + sidepanel + popup
├── tsconfig.json
├── tailwind.config.js         ← Custom design tokens (surface, accent, text)
├── postcss.config.js
├── public/
│   ├── manifest.json          ← Vite copies this to dist/ root
│   └── icons/                 ← icon16/48/128.png (red squares, placeholder)
└── src/
    ├── shared/
    │   ├── types.ts           ← ALL data models (source of truth)
    │   ├── storage.ts         ← ALL storage ops (never use chrome.storage directly)
    │   └── messages.ts        ← Typed sendToTab / sendToRuntime wrappers
    ├── background/
    │   └── service-worker.ts  ← Tab lifecycle, commands, Notion OAuth scaffold
    ├── content/
    │   └── injector.ts        ← SPA nav detection, video element, metadata scrape
    ├── sidepanel/
    │   ├── index.html
    │   ├── sidepanel.css      ← Tailwind + custom classes (ts-chip, bm-colors)
    │   └── sidepanel.ts       ← App shell, tab bar, pane routing, message listener
    └── popup/
        ├── index.html
        ├── popup.css
        └── popup.ts
```

### Key architectural decisions made in Phase 1

1. **Storage layer**: Every read/write goes through `src/shared/storage.ts`. Functions: `upsertVideoMeta`, `addBookmark`, `updateBookmark`, `deleteBookmark`, `getOrCreateNote`, `saveNote`, `addOcrCapture`, `saveClusters`. NEVER call `chrome.storage.local` directly from other files.

2. **Message protocol**: Fully typed in `types.ts`. Use `sendToTab()` and `sendToRuntime()` from `messages.ts`. Never use raw `chrome.runtime.sendMessage` directly.

3. **Service worker**: Manages a `tabVideoMap: Map<number, string|null>` in memory. Listens to `chrome.tabs.onUpdated` to detect YouTube URLs, enables side panel per tab, relays messages between content ↔ side panel.

4. **Content script**: Runs in `MAIN` world. SPA navigation via `yt-navigate-finish` event. Scrapes: title, channel, duration, playlist. Handles: `GET_CURRENT_TIME`, `SEEK_TO`, `CAPTURE_FRAME`, `GET_VIDEO_METADATA` messages.

5. **Side panel state**: Single `AppState` object with `activeTabId`, `currentVideoId`, `currentTime`, `videoRecord`, `activePane`. Four panes: Notes, Bookmarks, Playlist, Library. Phases 3–5 replace pane placeholder content with real implementations.

6. **Notion OAuth**: Scaffolded in service worker. Uses `chrome.identity.launchWebAuthFlow`. Token exchange is commented as requiring a backend proxy (client_secret must never be in extension code).

---

## PHASE 2 — WHAT TO BUILD NEXT (FULL SPEC)

### Goal
Full bidirectional bridge between content script and side panel. Plus: inject YT-native-feeling UI elements directly into YouTube's DOM so the extension feels built-in, not bolted on.

### Part A: Real-time time sync
The content script should emit `VIDEO_TIME_UPDATE` messages on a throttled interval (every 500ms while playing). This drives the timestamp display in the side panel header.

**Implementation:**
```typescript
// In injector.ts — add after video element is found
let syncInterval: ReturnType<typeof setInterval> | null = null

function startTimeSync(video: HTMLVideoElement): void {
  if (syncInterval) clearInterval(syncInterval)
  syncInterval = setInterval(() => {
    if (!video.paused && !video.ended) {
      chrome.runtime.sendMessage({
        type: 'VIDEO_TIME_UPDATE',
        currentTime: video.currentTime,
        duration: video.duration,
      }).catch(() => {})
    }
  }, 500)
}
```

### Part B: YouTube DOM Injection (the "integrated" feel)
Inject these 3 UI elements into YouTube's DOM via the content script. Style them to match YouTube's dark UI (`#0f0f0f`, `#272727`, `rgba(255,255,255,0.9)`). Do NOT use Tailwind here — inline styles or a small injected `<style>` tag, because Tailwind's purge won't process content script DOM.

#### Element 1: Floating Bookmark Button on the Player Controls
- Target: `.ytp-right-controls` (YouTube's right control bar)
- A small bookmark icon button that sits next to the fullscreen button
- On click: drops a bookmark at current timestamp (shows a mini color picker popover)
- Uses YouTube's own button styling: `ytp-button` class + inline SVG

```
[YT player controls bar]  ─────────────────── [🔖] [⚙] [CC] [⛶]
                                                 ↑ injected
```

#### Element 2: Bookmark Chips on the Progress Bar
- Target: `.ytp-progress-bar` / `.ytp-timed-markers-container`
- For each bookmark on the current video, inject a small colored dot at the correct `left: X%` position
- On hover: show a tooltip with label + timestamp
- On click: seek to that timestamp
- Update whenever bookmarks change (re-inject on storage change)

```
[progress bar ══════════●══════════════════]
                  ↑ colored dot bookmark chip
```

#### Element 3: Panel Toggle Button (above the video)
- Target: `#secondary` (YouTube's right column, where recommendations live)
- Inject a sticky bar at the top of the secondary column: `[ 📝 YT DeepNote  ▶ Open Notes ]`
- Clicking it calls `chrome.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL' })` which the SW handles with `chrome.sidePanel.open()`
- This gives users a way to open the panel without knowing about the extension popup

#### Element 4: Timestamp marker on hover over notes (future-compatible)
- Not built in Phase 2, but leave a `data-ytdn-timestamp` attribute hook on injected elements so Phase 3 can wire seek behavior

### Part C: Injection lifecycle
YouTube is a SPA. All injected elements MUST be re-injected on `yt-navigate-finish`. Use a clean `inject()` / `teardown()` pattern:

```typescript
function teardownInjectedUI(): void {
  document.querySelectorAll('[data-ytdn]').forEach(el => el.remove())
}

function injectUI(): void {
  teardownInjectedUI()
  waitForElement('.ytp-right-controls', injectBookmarkButton)
  waitForElement('.ytp-progress-bar-container', injectProgressDots)
  waitForElement('#secondary', injectPanelToggle)
}

// waitForElement: poll with MutationObserver, 5s timeout, then give up silently
```

### Part D: Fix the Vite manifest copy issue (noted in Phase 1)
Add a Vite plugin in `vite.config.ts` that automatically copies the root `manifest.json` into `dist/` as part of the build, replacing the `public/manifest.json` duplication:

```typescript
// vite.config.ts addition
function manifestPlugin() {
  return {
    name: 'copy-manifest',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify(JSON.parse(
          require('fs').readFileSync('./manifest.json', 'utf-8')
        ), null, 2)
      })
    }
  }
}
```

### Part E: Message additions needed
Add to `types.ts`:
```typescript
| 'OPEN_SIDE_PANEL'         // injected button → SW
| 'BOOKMARKS_UPDATED'       // storage change → content script (re-render dots)
| 'VIDEO_TIME_UPDATE'       // content → SW (already in types, just needs to flow)
```

Add to `service-worker.ts`:
```typescript
// Handle OPEN_SIDE_PANEL from content script
if (message.type === 'OPEN_SIDE_PANEL' && sender.tab?.id) {
  chrome.sidePanel.open({ tabId: sender.tab.id })
}
```

### Phase 2 exit condition
- Bookmark dots appear on YouTube's progress bar
- Floating bookmark button appears in player controls
- Panel toggle button appears in YouTube's secondary column
- Clicking any bookmark dot seeks to that timestamp
- Side panel timestamp display updates in real time while video plays
- All injected UI survives SPA navigation (clicking to another video re-injects cleanly)

---

## PHASE 3 — BOOKMARK ENGINE (SPEC)

### Side panel bookmark pane (replace placeholder)
- List of bookmarks sorted by timestamp
- Click → seek
- Double-click label → inline edit (contenteditable span, blur to save)
- Color swatch click → color picker (6 swatches, no library needed)
- Delete button (hover reveals ✕)
- "Add bookmark" button at top (opens modal with label + color, pre-fills timestamp)
- Quick-add from hotkey: `COMMAND_DROP_BOOKMARK` arrives with `currentTime`, show a non-blocking toast "🔖 Bookmark at 3:42" with an inline rename field that auto-dismisses after 4s

### Hotkey flow
```
User presses Ctrl+Shift+B
  → chrome.commands fires in SW
  → SW calls sendToTab(GET_CURRENT_TIME)
  → content script returns { currentTime: 142.3 }
  → SW sends COMMAND_DROP_BOOKMARK + currentTime to side panel
  → side panel calls addBookmark(videoId, 142.3, 'Bookmark', defaultColor)
  → side panel fires BOOKMARKS_UPDATED to content script
  → content script re-renders progress bar dots
```

### Storage write path: always `storage.ts → addBookmark()`

---

## PHASE 4 — RICH TEXT EDITOR (SPEC)

### Tiptap setup
Extensions to include:
- Document, Paragraph, Text, History
- Bold, Italic, Underline, Strike
- Heading (levels 1-3)
- BulletList + ListItem, OrderedList
- Code (inline), CodeBlock
- Blockquote
- HorizontalRule
- Highlight (yellow default)
- Link (open in new tab)
- Image (base64, max 800px width, compressed to JPEG 80%)
- Placeholder ("Start writing your notes…")

Custom extension: **TimestampNode**
```typescript
// An inline node that renders as a clickable chip: [▶ 3:42]
// Stored in Markdown as: [▶ 3:42](ytdn://seek/222)
// On click: sends SEEK_TO message to content script
const TimestampNode = Node.create({
  name: 'timestamp',
  group: 'inline',
  inline: true,
  atom: true,
  addAttributes() {
    return { seconds: { default: 0 }, label: { default: '' } }
  },
  // renderHTML returns the .ts-chip span (class already in sidepanel.css)
  // parseHTML matches [▶ ...](ytdn://seek/...) links
})
```

### WYSIWYG Toolbar
Fixed toolbar above the editor. Buttons:
```
[B] [I] [U] [S] | [H1] [H2] [H3] | [•] [1.] ["] [<>] [—] | [🔗] [🖼] [🕐] [✨]
                                                                    ↑ timestamp  ↑ highlight
```
Each button calls the corresponding Tiptap command. Active state via `editor.isActive()`.

### Markdown storage
- On every editor `update` event (debounced 500ms): serialize HTML → Markdown via Turndown, call `saveNote(videoId, markdown, html)`
- On load: if `htmlContent` exists, load it directly into Tiptap (`editor.commands.setContent(html)`). If only `markdownContent` exists (imported/migrated), convert MD → HTML via `marked` then load.

### Image insertion
- Toolbar image button opens a file picker (`<input type="file" accept="image/*">`)
- Read as base64 via FileReader
- Compress: draw to canvas at max 800px width, export as JPEG 80%
- Insert via `editor.commands.setImage({ src: compressedDataUrl })`
- Storage note: large base64 images eat `storage.local` quota fast. Warn user if video record exceeds 1MB.

---

## PHASE 5 — PLAYLIST ANALYTICS (SPEC)

### Data flow
Content script already scrapes `ytd-playlist-panel-video-renderer` items and sends `PLAYLIST_DATA`. Side panel receives it and stores to `chrome.storage.local` under key `pl:${playlistId}`.

### UI in Playlist pane
```
PLAYLIST: "CS50 2024"  (14 videos)

[████████████░░░░░░░░░░░]  8 / 14  57%

  Time watched:    4h 23m
  Remaining:       3h 17m
  ETA at 1x:       finish ~5:40 PM

  ✓  1. Introduction to CS50         52:14
  ✓  2. C                            1:52:33
  ▶  3. Arrays                [NOW]  1:41:28
     4. Algorithms                   1:46:23
     ...
```

### Edge cases to handle
- Private/deleted videos: duration = 0, show "[Unavailable]"
- Live streams: skip duration calculation, show "LIVE"
- YouTube Mix playlists (`list=RD...`): these are infinite, show "Mix — no ETA available"
- Playlist not loaded yet: show "Open playlist panel on YouTube to load data"

---

## PHASE 6A — OCR CAPTURE (SPEC)

### Flow
```
Ctrl+Shift+S pressed
  → SW sends COMMAND_CAPTURE_OCR to side panel
  → side panel sends CAPTURE_FRAME to content script (via SW relay)
  → content script: canvas.drawImage(video), returns JPEG base64 + timestamp
  → side panel receives frame
  → runs Tesseract.js: await worker.recognize(imageDataUrl)
  → inserts extracted text into editor at cursor as a blockquote with timestamp chip above it
  → saves OcrCapture to storage
```

### Tesseract setup
- Import `{ createWorker }` from `tesseract.js`
- Initialize worker once, keep alive: `const worker = await createWorker('eng')`
- Show loading indicator in side panel during OCR ("Extracting text…")
- Tesseract WASM files: Vite must copy them to `dist/`. Add to `vite.config.ts`:
```typescript
// Tesseract worker files need to be in the extension root
// Copy from node_modules/tesseract.js/dist/ to dist/
```

### Inserted text format (in editor)
```
[▶ 3:42]  ← timestamp chip (TimestampNode)
> Extracted text from frame appears here as a blockquote.
> Multiple lines preserved.
```

---

## PHASE 6B — SEMANTIC CLUSTERING (SPEC)

### Trigger
Auto-runs when a video has 5+ bookmarks and `clusteringEnabled` is true.

### Local heuristic mode (default)
Pattern-match bookmark labels against keyword lists:
```typescript
const CLUSTER_RULES: Record<string, string[]> = {
  'Definitions':    ['def', 'define', 'what is', 'means', 'term'],
  'Key Points':     ['important', 'key', 'note', 'remember', 'main'],
  'Questions':      ['?', 'why', 'how', 'what', 'when', 'where'],
  'Code Examples':  ['code', 'example', 'demo', 'implement', 'function'],
  'Action Items':   ['todo', 'do', 'action', 'follow up', 'task'],
  'Resources':      ['link', 'resource', 'ref', 'see', 'read'],
}
```
Uncategorized bookmarks go into "General" cluster.

### Claude API mode (opt-in in settings)
Send all bookmark labels to the Anthropic API, ask it to return JSON clusters. Only available if user provides their own API key in settings.

### UI in bookmark pane
When clusters exist, render bookmarks grouped under collapsible cluster headers instead of a flat list.

---

## PHASE 7 — EXPORT & NOTION SYNC (SPEC)

### Markdown export format
```markdown
---
title: "Video Title Here"
channel: "Channel Name"
videoId: dQw4w9WgXcQ
url: https://youtube.com/watch?v=dQw4w9WgXcQ
exported: 2024-01-15T10:30:00Z
---

# Video Title Here

## Bookmarks

| Time | Label | Color |
|------|-------|-------|
| 1:23 | Key concept | 🟡 |
| 4:56 | Code example | 🔵 |

## Notes

[full markdown content of notes here]

## OCR Captures

### [▶ 3:42] Frame capture
> Extracted text from OCR here
```

### Notion sync
- Create one Notion page per video
- Page title = video title
- Properties: Video URL, Channel, Duration, Last Watched, Export Date
- Content blocks: H2 "Bookmarks" → table, H2 "Notes" → paragraph blocks (convert MD to Notion block format), H2 "OCR Captures" → toggle blocks
- Update existing page if one already exists for this videoId (store `notionPageId` in VideoRecord)

Add to `VideoRecord` type: `notionPageId?: string`

### Notion OAuth note
Token exchange requires a backend. For MVP: provide a hosted Cloudflare Worker (50 lines) that holds `client_secret` and does the exchange. Its URL is hardcoded in the extension. User never sees it. Document this clearly.

---

## PHASE 8 — POLISH (SPEC)

- Error boundaries: ad overlays (`#ad-container`), age-gated videos (no video element), embed iframes (different origin), live streams (no duration)
- Injected UI z-index conflicts: YouTube uses z-index up to 2200; use 2300 for our overlays
- Storage quota warning: alert if `usedBytes > 4MB` (quota is 5MB for `storage.local` — actually `QUOTA_BYTES` is 5MB but in practice Chrome allows ~10MB for extensions; still warn at 4MB)
- Onboarding: on first install, open side panel automatically with a 3-step tooltip tour
- `web-ext lint` pass before packaging
- Chrome Web Store: screenshots at 1280×800, short description ≤132 chars, privacy policy URL required

---

## DESIGN TOKENS (DO NOT DRIFT FROM THESE)

```
Background hierarchy:
  surface-base:    #0f0f0f   (main bg)
  surface-raised:  #1a1a1a   (cards, header)
  surface-overlay: #242424   (inputs, code blocks)
  surface-border:  #2e2e2e   (dividers, borders)

Text:
  text-primary:    #f1f1f1
  text-secondary:  #aaaaaa
  text-muted:      #666666

Accent colors (bookmark colors + UI):
  accent-red:      #ff4444   (brand color, active states)
  accent-yellow:   #ffd700
  accent-green:    #44cc77
  accent-blue:     #4488ff
  accent-purple:   #aa66ff
  accent-orange:   #ff8844

YouTube injection (match YT's own dark theme):
  yt-bg:           #0f0f0f
  yt-surface:      #272727
  yt-text:         rgba(255,255,255,0.9)
  yt-subtext:      rgba(255,255,255,0.5)
  Use YT's own classes where possible: ytp-button, etc.
```

---

## CRITICAL RULES (ENFORCE THESE IN ALL PHASES)

1. **Never call `chrome.storage.local` directly** — always use functions from `src/shared/storage.ts`
2. **Never use raw `chrome.runtime.sendMessage`** without the typed wrappers in `src/shared/messages.ts`
3. **Content script styles** — never use Tailwind in injected DOM elements; use inline styles or an injected `<style>` tag with `data-ytdn-styles` attribute so teardown can remove it
4. **SPA navigation** — every injected DOM element must be re-injectable and re-teardownable via `yt-navigate-finish`. Always tag injected elements with `data-ytdn="true"` for teardown selection
5. **Async message handling** — always return `true` from `onMessage.addListener` when using `sendResponse` asynchronously
6. **No framework** — vanilla TypeScript only in all modules. Tiptap is the one allowed "heavy" dependency because it's the editor
7. **Manifest stays in root** — `manifest.json` in project root is source of truth. `public/manifest.json` is a copy. In Phase 2, replace with the Vite manifestPlugin to eliminate duplication
8. **Type everything** — no `any` types. Add to `types.ts` before using a new shape

---

## STARTING PROMPT FOR NEW CONVERSATION

Paste this entire document, then say:

> "You are picking up YT DeepNote exactly where it was left off. Phase 1 is complete (scaffold, storage layer, side panel shell, service worker, content script). The Phase 1 zip has been downloaded by the user. Begin Phase 2 immediately: DOM bridge, real-time time sync, and YouTube UI injection (bookmark button in player controls, bookmark dots on progress bar, panel toggle in secondary column). The user wants the extension to feel integrated into YouTube, not bolted on. Start with the updated injector.ts and any new files needed. No preamble — output code."
