// content.js
// Inject Immersive Shadow DOM Overlay

const ICONS = {
  home: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  bold: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v8"/><path d="M15 20a4 4 0 0 0 0-8H6v8Z"/></svg>`,
  italic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`,
  underline: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>`,
  strike: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>`,
  h1: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="m17 12 3-2v8"/></svg>`,
  h2: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-2.75 4-4.5 4-7a2 2 0 0 0-4-1"/></svg>`,
  ul: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  ol: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`,
  quote: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>`,
  code: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  link: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  dock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
  float: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="8" y="8" width="8" height="8" rx="1" ry="1"/></svg>`,
  trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  export: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  sync: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M12 11v6"/><path d="m9 14 3 3 3-3"/></svg>`,
  settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  open: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-8"/><path d="m15 15-3-3-3 3"/><path d="M4 16v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/></svg>`,
  maximize: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
  minimize: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`,
  refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  camera: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  timestamp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
};

const SHADOW_CSS = `
  :host {
    /* Dark Mode Defaults */
    --bg-dark: rgba(15, 15, 15, 0.85);
    --bg-card: rgba(39, 39, 39, 0.7);
    --border: rgba(255, 255, 255, 0.1);
    --accent: var(--user-accent, #ff0000);
    --accent-hover: var(--user-accent, #cc0000);
    --text: #ffffff;
    --text-dim: #aaaaaa;
    --font: 'Roboto', 'YouTube Noto', sans-serif;
  }

  @media (prefers-color-scheme: light) {
    :host {
      --bg-dark: rgba(255, 255, 255, 0.85);
      --bg-card: rgba(240, 240, 240, 0.7);
      --border: rgba(0, 0, 0, 0.15);
      --text: #111111;
      --text-dim: #555555;
    }
  }
  
  * { box-sizing: border-box; }
  
  .yt-deepnote-app {
    position: fixed;
    z-index: 9999999;
    font-family: var(--font);
    color: var(--text);
    background: var(--bg-dark);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border);
  }
  .yt-deepnote-app.floating {
    top: 20px;
    right: 20px;
    width: 380px;
    height: 600px;
    background: var(--bg-dark);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    resize: both;
    min-width: 300px;
    min-height: 400px;
  }
  .yt-deepnote-app.fullscreen {
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0;
    resize: none;
    z-index: 99999999;
  }
  .yt-deepnote-app.docked {
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    background: var(--bg-dark);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
  }
  .yt-deepnote-app.hidden {
    display: none !important;
  }

  /* Toggle Button */
  .toggle-launcher {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--accent);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(255,0,0,0.4);
    z-index: 999999;
    border: none;
    transition: transform 0.2s;
  }
  .toggle-launcher:hover { transform: scale(1.1); background: var(--accent-hover); }
  .toggle-launcher.hidden { display: none; }

  /* Header (Draggable) */
  .header {
    padding: 12px 16px;
    background: rgba(0,0,0,0.2);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
  }
  .floating .header { cursor: grab; }
  .floating .header:active { cursor: grabbing; }

  .header-left { display: flex; align-items: center; gap: 8px; font-weight: 500; font-size: 14px; }
  .header-controls { display: flex; gap: 4px; }
  
  button.icon-btn {
    background: transparent;
    border: none;
    color: var(--text-dim);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  button.icon-btn:hover { background: rgba(255,255,255,0.1); color: var(--text); }

  .content-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .content-scroll::-webkit-scrollbar { width: 6px; }
  .content-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }

  /* Video Meta */
  .video-meta { font-size: 13px; color: var(--text-dim); display: flex; justify-content: space-between; }
  .video-title { font-size: 15px; font-weight: 500; color: white; margin-bottom: 4px; line-height: 1.3; }

  /* Bookmarks */
  .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-dim); margin-bottom: 8px; font-weight: 600; }
  .bookmark-form { display: flex; gap: 8px; margin-bottom: 12px; }
  .bookmark-input { flex: 1; background: rgba(0,0,0,0.3); border: 1px solid var(--border); color: white; padding: 8px; border-radius: 6px; font-family: var(--font); font-size: 13px; outline: none; }
  .bookmark-input:focus { border-color: var(--accent); }
  .primary-btn { background: var(--accent); color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 13px; transition: 0.2s; }
  .primary-btn:hover { background: var(--accent-hover); }

  .colors { display: flex; gap: 6px; margin-bottom: 12px; }
  .color { width: 20px; height: 20px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: 0.2s; }
  .color.active { transform: scale(1.2); border-color: white; }

  .bookmarks-list { display: flex; flex-direction: column; gap: 6px; }
  .bm-item { display: flex; align-items: center; gap: 8px; background: var(--bg-card); padding: 8px; border-radius: 6px; border-left: 3px solid var(--accent); cursor: pointer; font-size: 13px; transition: 0.2s; }
  .bm-item:hover { background: rgba(255,255,255,0.1); }
  .bm-time { font-family: monospace; color: var(--text-dim); font-size: 12px; background: rgba(0,0,0,0.3); padding: 2px 4px; border-radius: 4px; }
  .bm-name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bm-delete { opacity: 0; color: var(--text-dim); }
  .bm-item:hover .bm-delete { opacity: 1; color: var(--accent); }
  .empty { font-size: 13px; color: var(--text-dim); text-align: center; padding: 12px; border: 1px dashed var(--border); border-radius: 6px; }

  /* Editor */
  .editor-container { display: flex; flex-direction: column; flex: 1; min-height: 250px; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; resize: vertical; }
  .editor-toolbar { display: flex; gap: 2px; padding: 4px; background: rgba(0,0,0,0.3); border-bottom: 1px solid var(--border); flex-wrap: wrap; }
  .editor-toolbar button { background: transparent; border: none; color: var(--text-dim); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; transition: 0.2s; }
  .editor-toolbar button:hover { background: rgba(255,255,255,0.1); color: white; }
  
  /* Use a contenteditable div for true WYSIWYG */
  .editor-content { flex: 1; padding: 12px; outline: none; font-size: 14px; line-height: 1.5; overflow-y: auto; }
  .editor-content:empty:before { content: attr(placeholder); color: var(--text-dim); pointer-events: none; display: block; }
  
  .editor-content h1, .editor-content h2, .editor-content h3 { margin-top: 0; margin-bottom: 8px; font-weight: 500; }
  .editor-content h1 { font-size: 18px; }
  .editor-content h2 { font-size: 16px; }
  .editor-content blockquote { border-left: 3px solid var(--accent); margin: 0 0 8px 0; padding-left: 12px; color: var(--text-dim); font-style: normal; background: rgba(0,0,0,0.2); padding: 8px 8px 8px 12px; border-radius: 0 6px 6px 0; }
  .editor-content pre { background: rgba(0,0,0,0.4); padding: 12px; border-radius: 6px; font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 13px; font-style: normal; overflow-x: auto; margin: 0 0 8px 0; border: 1px solid rgba(255,255,255,0.1); color: #e0e0e0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); }
  .editor-content code { background: rgba(0,0,0,0.3); padding: 2px 4px; border-radius: 4px; font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 13px; font-style: normal; color: #ff7b72; }
  .editor-content a { color: var(--accent); text-decoration: none; border-bottom: 1px dashed var(--accent); transition: 0.2s; font-weight: 500; }
  .editor-content a:hover { border-bottom-style: solid; filter: brightness(1.2); }
  .editor-content img { max-width: 100%; border-radius: 6px; display: block; width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
  
  .editor-content .img-wrapper { position: relative; display: inline-block; max-width: 100%; }
  .editor-content .img-wrapper:hover .img-delete-btn { opacity: 1; pointer-events: auto; }
  .editor-content .img-delete-btn { position: absolute; top: 12px; right: -8px; background: rgba(0,0,0,0.8); color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0; pointer-events: none; transition: 0.2s; z-index: 10; font-size: 14px; border: 1px solid var(--border); box-shadow: 0 2px 8px rgba(0,0,0,0.5); }
  .editor-content .img-delete-btn:hover { background: var(--accent); transform: scale(1.1); }
  
  .editor-content .block { outline: none; min-height: 1.5em; line-height: 1.5; margin: 0; }
  .editor-content p.block { margin: 0 0 4px 0; }
  .editor-content .block.ul-item { display: list-item; margin-left: 20px; list-style-type: disc; }
  .editor-content .block.ol-item { display: list-item; margin-left: 20px; list-style-type: decimal; }
  
  .ts-chip { background: var(--accent); color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; cursor: pointer; user-select: none; font-weight: bold; margin-right: 4px; display: inline-block; vertical-align: middle; }
  .ts-chip:hover { filter: brightness(1.2); }

  /* Footer Actions */
  .actions { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--border); background: rgba(0,0,0,0.2); }
  .action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; background: var(--bg-card); border: 1px solid var(--border); color: white; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: 0.2s; }
  .action-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }

  /* Settings Modal */
  .modal-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 10; opacity: 0; pointer-events: none; transition: 0.2s; }
  .modal-overlay.active { opacity: 1; pointer-events: auto; }
  .modal { background: var(--bg-dark); border: 1px solid var(--border); padding: 20px; border-radius: 12px; width: 90%; max-width: 320px; display: flex; flex-direction: column; gap: 12px; }
  .modal h3 { margin: 0; font-size: 15px; font-weight: 500; }
  .modal label { font-size: 12px; color: var(--text-dim); }
  .modal input { background: rgba(0,0,0,0.3); border: 1px solid var(--border); color: white; padding: 8px; border-radius: 6px; font-size: 13px; outline: none; width: 100%; }
`;

class YTDeepNote {
  constructor() {
    this.videoData = null;
    this.storedData = { bookmarks: [], htmlNotes: '' };
    this.isDocked = false;
    this.isFullscreen = false;
    this.selectedColor = '#ff0000';
    this.colors = ['#ff0000', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
    
    this.initShadowDOM();
    this.pollInterval = setInterval(() => this.updateVideoMeta(), 1000);
  }

  initShadowDOM() {
    // Prevent multiple injections
    if (document.getElementById('yt-deepnote-root')) return;

    this.container = document.createElement('div');
    this.container.id = 'yt-deepnote-root';
    // Start with a very high z-index to ensure it sits over everything initially
    this.container.style.position = 'relative';
    this.container.style.zIndex = '999999';
    document.body.appendChild(this.container);

    this.shadow = this.container.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = SHADOW_CSS;
    this.shadow.appendChild(style);

    this.render();
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = `yt-deepnote-app floating`;
    
    this.launcher = document.createElement('button');
    this.launcher.className = `toggle-launcher hidden`;
    this.launcher.innerHTML = ICONS.open;
    this.launcher.title = "Open YT DeepNote";

    this.wrapper.innerHTML = `
      <div class="header" id="dragHandle">
        <div class="header-left">
          <span style="color: var(--accent)">▶</span> YT DeepNote
        </div>
        <div class="header-controls">
          <button class="icon-btn" id="btnHome" title="Home Dashboard">${ICONS.home}</button>
          <button class="icon-btn" id="btnMaximize" title="Fullscreen">${ICONS.maximize}</button>
          <button class="icon-btn" id="btnDock" title="Dock/Float">${ICONS.dock}</button>
          <button class="icon-btn" id="btnSettings" title="Settings">${ICONS.settings}</button>
          <button class="icon-btn" id="btnClose" title="Close">${ICONS.close}</button>
        </div>
      </div>

      <div class="content-scroll">
        <div>
          <div class="video-title" id="vidTitle">Loading...</div>
          <div class="video-meta">
            <span id="vidTime">0:00 / 0:00</span>
            <button class="icon-btn" id="btnRefresh" style="padding:0">${ICONS.refresh}</button>
          </div>
        </div>

        <div>
          <div class="section-title">Bookmarks</div>
          <div class="colors" id="colorPicker">
            ${this.colors.map((c, i) => `<div class="color ${i===0?'active':''}" data-color="${c}" style="background-color: ${c}"></div>`).join('')}
          </div>
          <div class="bookmark-form">
            <input type="text" id="bmInput" class="bookmark-input" placeholder="What happens here?" maxlength="40" autocomplete="new-password" spellcheck="false" data-1p-ignore="true" data-lpignore="true">
            <button class="primary-btn" id="btnAddBm">Save</button>
          </div>
          <div class="bookmarks-list" id="bmList">
            <!-- Bookmarks go here -->
          </div>
        </div>

        <div class="editor-container">
          <div class="editor-toolbar">
            <button data-cmd="bold" title="Bold">${ICONS.bold}</button>
            <button data-cmd="italic" title="Italic">${ICONS.italic}</button>
            <button data-cmd="underline" title="Underline">${ICONS.underline}</button>
            <button data-cmd="strikeThrough" title="Strikethrough">${ICONS.strike}</button>
            <div style="width:1px; background:var(--border); margin:4px"></div>
            <button data-cmd="formatBlock" data-val="H1" title="Heading 1">${ICONS.h1}</button>
            <button data-cmd="formatBlock" data-val="H2" title="Heading 2">${ICONS.h2}</button>
            <div style="width:1px; background:var(--border); margin:4px"></div>
            <button data-cmd="formatBlock" data-val="ul-item" title="Bullet List">${ICONS.ul}</button>
            <button data-cmd="formatBlock" data-val="ol-item" title="Numbered List">${ICONS.ol}</button>
            <button data-cmd="formatBlock" data-val="BLOCKQUOTE" title="Quote">${ICONS.quote}</button>
            <button data-cmd="formatBlock" data-val="PRE" title="Code Block">${ICONS.code}</button>
            <button data-cmd="createLink" title="Link">${ICONS.link}</button>
            <div style="width:1px; background:var(--border); margin:4px"></div>
            <button data-cmd="insertTimestamp" title="Insert Timestamp (Alt+T)">${ICONS.timestamp}</button>
            <button data-cmd="insertScreenshot" title="Screenshot Video Frame">${ICONS.camera}</button>
          </div>
          <div class="editor-content" id="editor" placeholder="Take your immersive notes here..."></div>
        </div>
      </div>

      <div class="actions">
        <button class="action-btn" id="btnExport">${ICONS.export} Export .md</button>
        <button class="action-btn" id="btnSync">${ICONS.sync} Sync Notion</button>
      </div>

      <!-- Settings Modal -->
      <div class="modal-overlay" id="settingsModal">
        <div class="modal">
          <h3>DeepNote Settings</h3>
          <div>
            <label>Theme Accent Color</label>
            <input type="color" id="inpAccentColor" value="#ff0000" style="padding:0; height:36px; cursor:pointer; width:100%; margin-top:4px; border:none;">
          </div>
          <div style="margin-top: 12px;">
            <label>Notion API Token</label>
            <input type="text" id="inpNotionToken" placeholder="secret_..." autocomplete="new-password" data-1p-ignore="true" data-lpignore="true" style="-webkit-text-security: disc;">
          </div>
          <div style="margin-top: 12px;">
            <label>Database ID</label>
            <input type="text" id="inpDbId" placeholder="Database ID" autocomplete="off" data-1p-ignore="true" data-lpignore="true">
          </div>
          <button class="primary-btn" id="btnSaveSettings" style="width:100%; margin-top:8px;">Save Settings</button>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border); text-align: center;">
            <h4 style="margin:0 0 4px 0; color: var(--accent); font-weight: 500;">About YT DeepNote</h4>
            <p style="margin:0; font-size:12px; color:var(--text-dim); line-height: 1.4;">Your ultimate companion for deep learning on YouTube. Seamlessly capture timestamped Markdown notes, precision bookmarks, and sync them directly to your Notion workspace. v1.1.0-beta</p>
          </div>

          <button class="icon-btn" id="btnCloseSettings" style="position:absolute; top:16px; right:16px">${ICONS.close}</button>
        </div>
      </div>
    `;

    this.shadow.appendChild(this.wrapper);
    this.shadow.appendChild(this.launcher);

    // Prevent keydown/keyup/keypress from bleeding into YouTube
    ['keydown', 'keyup', 'keypress'].forEach(evt => {
      this.wrapper.addEventListener(evt, (e) => {
        e.stopPropagation();
      });
    });

    this.bindEvents();
    this.makeDraggable();
  }

  getSafeSelection() {
    return this.shadow.getSelection ? this.shadow.getSelection() : window.getSelection();
  }

  bindEvents() {
    const $ = (id) => this.shadow.getElementById(id);
    
    // Toggles
    $('btnClose').addEventListener('click', () => {
      this.wrapper.classList.add('hidden');
      this.launcher.classList.remove('hidden');
    });

    $('btnHome').addEventListener('click', () => {
        window.open(chrome.runtime.getURL('home.html'), '_blank');
    });
    
    this.launcher.addEventListener('click', () => {
      this.wrapper.classList.remove('hidden');
      this.launcher.classList.add('hidden');
    });

    $('btnMaximize').addEventListener('click', () => this.toggleFullscreen());
    $('btnDock').addEventListener('click', () => this.toggleDock());
    $('btnRefresh').addEventListener('click', () => this.updateVideoMeta(true));

    // Bookmarks
    $('btnAddBm').addEventListener('click', () => this.addBookmark($('bmInput').value));
    $('bmInput').addEventListener('keypress', (e) => { if(e.key === 'Enter') this.addBookmark($('bmInput').value); });
    
    $('colorPicker').addEventListener('click', (e) => {
      if(e.target.classList.contains('color')) {
        this.shadow.querySelectorAll('.color').forEach(el => el.classList.remove('active'));
        e.target.classList.add('active');
        this.selectedColor = e.target.dataset.color;
      }
    });

    this.shadow.querySelectorAll('.editor-toolbar button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = btn.dataset.cmd;
        const val = btn.dataset.val || null;
        if (cmd === 'createLink') {
          const url = prompt('Enter link URL (e.g., https://google.com):');
          if(url) {
            const selection = this.getSafeSelection();
            if (selection.isCollapsed) {
              document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${url}</a>`);
            } else {
              document.execCommand(cmd, false, url);
            }
            // Retarget link targets
            setTimeout(() => {
              this.shadow.querySelectorAll('#editor a').forEach(a => a.target = "_blank");
            }, 100);
          }
        } else if (cmd === 'insertTimestamp') {
          this.insertTimestamp();
        } else if (cmd === 'insertScreenshot') {
          this.insertScreenshot();
        } else if (cmd === 'formatBlock') {
          if (['H1', 'H2', 'BLOCKQUOTE', 'PRE'].includes(val)) {
            let node = this.getSafeSelection().anchorNode;
            if (node && node.nodeType === 3) node = node.parentNode;
            const block = node?.closest('.block');
            
            if (block && block.contentEditable === 'true') {
               const targetTag = block.tagName === val ? 'P' : val;
               const newBlock = document.createElement(targetTag);
               newBlock.className = 'block';
               newBlock.contentEditable = 'true';
               newBlock.innerHTML = block.innerHTML;
               block.parentNode.replaceChild(newBlock, block);
               this.moveCursorToEnd(newBlock);
            }
          } else if (val === 'ul-item' || val === 'ol-item') {
            let node = this.getSafeSelection().anchorNode;
            if (node && node.nodeType === 3) node = node.parentNode;
            const block = node?.closest('.block');
            
            if (block) {
              block.classList.toggle(val);
              if (val === 'ul-item') block.classList.remove('ol-item');
              if (val === 'ol-item') block.classList.remove('ul-item');
            }
          }
        } else {
          document.execCommand(cmd, false, val);
        }
        this.saveData();
      });
    });

    const editor = $('editor');
    
    // Fix: Allow clicking on empty editor space to focus the last block, and intercept delete button
    editor.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.img-delete-btn');
      if (deleteBtn) {
        const block = deleteBtn.closest('.block');
        if (block) {
          block.remove();
          this.saveData();
        }
        return;
      }
      
      if (e.target === editor) {
        const lastBlock = editor.lastElementChild;
        if (lastBlock && lastBlock.classList.contains('block')) {
          this.moveCursorToEnd(lastBlock);
        }
      }
      
      const tsChip = e.target.closest('.ts-chip');
      if (tsChip) {
        const time = parseFloat(tsChip.dataset.time);
        const video = this.getVideoElement();
        if (video && !isNaN(time)) {
          video.currentTime = time;
        }
      }
    });
    
    editor.addEventListener('input', (e) => {
      let node = this.getSafeSelection().anchorNode;
      if (!node) return;
      if (node.nodeType === 3) node = node.parentNode;
      const block = node.closest('.block');
      
      if (block) this.handleAutoFormat(block);
      this.saveData();
    });

    editor.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 't' && e.altKey) {
        e.preventDefault();
        this.insertTimestamp();
        return;
      }
      
      let node = this.getSafeSelection().anchorNode;
      if (!node) return;
      if (node.nodeType === 3) node = node.parentNode;
      const block = node.closest('.block');
      
      if (!block) return;

      if (e.key === 'Enter') {
        if (e.shiftKey) return; 
        e.preventDefault();

        const selection = this.getSafeSelection();
        let textAfterCursor = '';
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const postRange = range.cloneRange();
          postRange.selectNodeContents(block);
          postRange.setStart(range.endContainer, range.endOffset);
          
          const fragment = postRange.extractContents();
          const tempDiv = document.createElement('div');
          tempDiv.appendChild(fragment);
          textAfterCursor = tempDiv.innerHTML;
        }

        if (!block.textContent.trim() && !block.querySelector('img')) {
          block.innerHTML = '<br>'; 
        }

        const newBlock = document.createElement('p');
        newBlock.className = 'block';
        newBlock.contentEditable = 'true';
        if (block.classList.contains('ul-item')) newBlock.classList.add('ul-item');
        if (block.classList.contains('ol-item')) newBlock.classList.add('ol-item');
        newBlock.innerHTML = textAfterCursor || '<br>';

        block.parentNode.insertBefore(newBlock, block.nextSibling);
        
        const newRange = document.createRange();
        newRange.setStart(newBlock, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        this.saveData();
      } else if (e.key === 'Backspace') {
        const selection = this.getSafeSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);

        try {
          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(block);
          preCaretRange.setEnd(range.startContainer, range.startOffset);
          const isAtStart = preCaretRange.toString().length === 0;

          if (isAtStart && selection.isCollapsed) {
            e.preventDefault();

          if (block.classList.contains('ul-item') || block.classList.contains('ol-item')) {
            block.classList.remove('ul-item', 'ol-item');
            this.saveData();
            return;
          }

          if (block.tagName !== 'P') {
            const newBlock = document.createElement('p');
            newBlock.className = 'block';
            newBlock.contentEditable = 'true';
            newBlock.innerHTML = block.innerHTML;
            block.parentNode.replaceChild(newBlock, block);
            
            const newRange = document.createRange();
            newRange.setStart(newBlock, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
            this.saveData();
            return;
          }

          // Merge with previous block or delete previous image block
          const prevBlock = block.previousElementSibling;
          if (prevBlock && prevBlock.classList.contains('block')) {
            // Delete image block via Backspace
            if (prevBlock.contentEditable === 'false' || prevBlock.querySelector('img')) {
              prevBlock.remove();
              this.saveData();
              return;
            }

            if (prevBlock.contentEditable === 'true') {
              const contentToMove = block.innerHTML === '<br>' ? '' : block.innerHTML;
            
            prevBlock.focus();
            const prevRange = document.createRange();
            prevRange.selectNodeContents(prevBlock);
            prevRange.collapse(false); 
            
            if (prevBlock.lastChild && prevBlock.lastChild.nodeName === 'BR' && contentToMove) {
              prevBlock.removeChild(prevBlock.lastChild);
            }
            
            prevBlock.insertAdjacentHTML('beforeend', contentToMove);
            block.remove();
            
            selection.removeAllRanges();
            selection.addRange(prevRange);
            this.saveData();
          }
        }
        }
        } catch (err) {
          console.warn("Backspace calculation failed:", err);
        }
      }
    });

    $('btnSettings').addEventListener('click', () => $('settingsModal').classList.add('active'));
    $('btnCloseSettings').addEventListener('click', () => $('settingsModal').classList.remove('active'));
    $('btnSaveSettings').addEventListener('click', () => {
      chrome.storage.local.set({
        accentColor: $('inpAccentColor').value,
        notionToken: $('inpNotionToken').value,
        notionDbId: $('inpDbId').value
      }, () => {
        $('settingsModal').classList.remove('active');
        this.container.style.setProperty('--user-accent', $('inpAccentColor').value);
      });
    });

    chrome.storage.local.get(['notionToken', 'notionDbId', 'accentColor'], (res) => {
      if (res.notionToken) $('inpNotionToken').value = res.notionToken;
      if (res.notionDbId) $('inpDbId').value = res.notionDbId;
      if(res.accentColor) {
        $('inpAccentColor').value = res.accentColor;
        this.container.style.setProperty('--user-accent', res.accentColor);
      }
    });

    $('btnExport').addEventListener('click', () => this.exportMarkdown());
    $('btnSync').addEventListener('click', () => this.syncNotion());
  }

  toggleDock() {
    if (this.isFullscreen) this.toggleFullscreen(); // exit fullscreen first
    this.isDocked = !this.isDocked;
    const btn = this.shadow.getElementById('btnDock');
    
    if (this.isDocked) {
      this.wrapper.className = `yt-deepnote-app docked`;
      this.wrapper.style.left = 'auto';
      this.wrapper.style.top = '0';
      btn.innerHTML = ICONS.float;
      btn.title = "Float";
      
      const secondary = document.querySelector('#secondary-inner') || document.querySelector('#secondary');
      if (secondary) {
        secondary.insertBefore(this.container, secondary.firstChild);
      }
    } else {
      this.wrapper.classList.remove('docked');
      this.wrapper.classList.add('floating');
      btn.innerHTML = ICONS.dock;
      btn.title = "Dock to Sidebar";
      
      document.body.appendChild(this.container);
      this.wrapper.style.top = '20px';
      this.wrapper.style.right = '20px';
      this.wrapper.style.left = 'auto';
    }
  }

  toggleFullscreen() {
    if (this.isDocked) this.toggleDock(); // exit dock first
    this.isFullscreen = !this.isFullscreen;
    const btn = this.shadow.getElementById('btnMaximize');
    
    if (this.isFullscreen) {
      this.wrapper.classList.add('fullscreen');
      btn.innerHTML = ICONS.minimize;
      btn.title = "Exit Fullscreen";
      document.body.style.overflow = 'hidden'; // prevent scrolling underneath
    } else {
      this.wrapper.classList.remove('fullscreen');
      btn.innerHTML = ICONS.maximize;
      btn.title = "Fullscreen";
      document.body.style.overflow = '';
    }
  }

  insertTimestamp() {
    const video = this.getVideoElement();
    if (!video) return;
    
    const time = video.currentTime;
    const formatted = this.formatTime(time);
    
    const chip = `<span class="ts-chip" contenteditable="false" data-time="${time}">▶ ${formatted}</span>&nbsp;`;
    
    const selection = this.getSafeSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const editor = this.shadow.getElementById('editor');
      
      if (editor.contains(range.commonAncestorContainer)) {
        document.execCommand('insertHTML', false, chip);
        this.saveData();
        return;
      }
    }
    
    const editor = this.shadow.getElementById('editor');
    if (!editor.innerHTML.trim() || editor.innerHTML === '<br>') {
      editor.innerHTML = `<p class="block" contenteditable="true">${chip}</p>`;
    } else {
      editor.lastElementChild.insertAdjacentHTML('beforeend', chip);
    }
    this.moveCursorToEnd(editor.lastElementChild);
    this.saveData();
  }

  insertScreenshot() {
    const video = this.getVideoElement();
    if (!video) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      const editor = this.shadow.getElementById('editor');
      
      const block = document.createElement('div');
      block.className = 'block';
      block.contentEditable = 'false';
      block.innerHTML = `
        <div class="img-wrapper">
          <div class="img-delete-btn" title="Delete Screenshot">${ICONS.trash}</div>
          <div style="resize: both; overflow: hidden; display: inline-block; max-width: 100%; border: 1px solid var(--border); padding: 2px; border-radius: 4px; margin: 8px 0; min-width: 100px; min-height: 50px;">
            <img src="${dataUrl}" />
          </div>
        </div>
      `;
      
      let node = this.getSafeSelection().anchorNode;
      if (node && node.nodeType === 3) node = node.parentNode;
      let currentBlock = node?.closest('.block');

      if (currentBlock) {
        currentBlock.parentNode.insertBefore(block, currentBlock.nextSibling);
      } else {
        editor.appendChild(block);
      }
      
      const emptyP = document.createElement('p');
      emptyP.className = 'block';
      emptyP.contentEditable = 'true';
      emptyP.innerHTML = '<br>';
      block.parentNode.insertBefore(emptyP, block.nextSibling);
      
      this.moveCursorToEnd(emptyP);
      this.saveData();
    } catch (e) {
      console.error("Screenshot failed:", e);
      alert("Could not capture screenshot.");
    }
  }

  handleAutoFormat(block) {
    const text = block.textContent;
    let newTag = null;
    let textToRemove = 0;

    if (text.match(/^#\s/)) { newTag = 'H1'; textToRemove = 2; }
    else if (text.match(/^##\s/)) { newTag = 'H2'; textToRemove = 3; }
    else if (text.match(/^###\s/)) { newTag = 'H3'; textToRemove = 4; }
    else if (text.match(/^>\s/)) { newTag = 'BLOCKQUOTE'; textToRemove = 2; }
    else if (text.match(/^```/)) { newTag = 'PRE'; textToRemove = 3; }
    else if (text.match(/^-\s|^\*\s/)) { 
      block.classList.add('ul-item'); 
      block.textContent = text.substring(2) || '\u200B'; 
      this.moveCursorToEnd(block);
      return; 
    }
    else if (text.match(/^1\.\s/)) { 
      block.classList.add('ol-item'); 
      block.textContent = text.substring(3) || '\u200B'; 
      this.moveCursorToEnd(block);
      return; 
    }

    if (newTag && block.tagName !== newTag) {
      const newContent = text.substring(textToRemove) || '<br>';
      const newBlock = document.createElement(newTag);
      newBlock.className = 'block';
      newBlock.contentEditable = 'true';
      newBlock.innerHTML = newContent;
      block.parentNode.replaceChild(newBlock, block);
      this.moveCursorToEnd(newBlock);
    }
  }

  moveCursorToEnd(el) {
    el.focus();
    const selection = this.getSafeSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  makeDraggable() {
    const handle = this.shadow.getElementById('dragHandle');
    let isDragging = false, startX, startY, initialX, initialY;

    handle.addEventListener('mousedown', (e) => {
      if (this.isDocked) return;
      if (e.target.closest('.header-controls')) return;
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = this.wrapper.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      this.wrapper.style.left = `${initialX + dx}px`;
      this.wrapper.style.top = `${initialY + dy}px`;
      this.wrapper.style.right = 'auto';
    });

    window.addEventListener('mouseup', () => { isDragging = false; });
  }

  getVideoElement() {
    return document.querySelector('video');
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  updateVideoMeta(forceLoad = false) {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');
    if (!videoId) return;

    const video = this.getVideoElement();
    const titleEl = document.querySelector('h1.ytd-watch-metadata yt-formatted-string') || document.querySelector('h1.title yt-formatted-string');
    
    const isNewVideo = !this.videoData || this.videoData.videoId !== videoId;

    this.videoData = {
      videoId: videoId,
      title: titleEl ? titleEl.innerText : document.title.replace(' - YouTube', ''),
      url: window.location.href,
      currentTime: video ? video.currentTime : 0,
      duration: video ? video.duration : 0
    };

    const $ = (id) => this.shadow.getElementById(id);
    if ($('vidTitle')) {
      $('vidTitle').innerText = this.videoData.title;
      $('vidTime').innerText = `${this.formatTime(this.videoData.currentTime)} / ${this.formatTime(this.videoData.duration)}`;
    }

    if (isNewVideo || forceLoad) {
      this.loadData();
    }
    
    this.injectBookmarkButton();
  }

  loadData() {
    if (!this.videoData) return;
    const key = `yt_data_${this.videoData.videoId}`;
    const editor = this.shadow.getElementById('editor');
    
    chrome.storage.local.get([key], (res) => {
      this.storedData = res[key] || { bookmarks: [], htmlNotes: '' };
      
      if (this.storedData.htmlNotes) {
        editor.innerHTML = this.storedData.htmlNotes;
        
        let hasBlocks = false;
        Array.from(editor.children).forEach(child => {
           if (child.classList && child.classList.contains('block')) {
             hasBlocks = true;
           } else {
             child.classList.add('block');
             if (child.tagName !== 'IMG' && child.tagName !== 'DIV') {
                 child.contentEditable = 'true';
             }
           }
        });
        
        if (!hasBlocks && !editor.textContent.trim() && !editor.querySelector('img')) {
           editor.innerHTML = '<p class="block" contenteditable="true"><br></p>';
        }
      } else {
        editor.innerHTML = '<p class="block" contenteditable="true"><br></p>';
      }
      this.renderBookmarks();
    });
  }

  saveData() {
    if (!this.videoData) return;
    const key = `yt_data_${this.videoData.videoId}`;
    this.storedData.bookmarks.sort((a,b) => a.time - b.time);
    this.storedData.htmlNotes = this.shadow.getElementById('editor').innerHTML;
    chrome.storage.local.set({ [key]: this.storedData });
  }

  addBookmark(name, time = null) {
    if (!this.videoData) return;
    
    this.storedData.bookmarks.push({
      id: Date.now().toString(),
      time: time !== null ? time : this.videoData.currentTime,
      name: name.trim() || "Bookmark",
      color: this.selectedColor
    });
    
    this.shadow.getElementById('bmInput').value = '';
    this.saveData();
    this.renderBookmarks();
  }

  renderBookmarks() {
    const list = this.shadow.getElementById('bmList');
    list.innerHTML = '';

    if (!this.storedData.bookmarks.length) {
      list.innerHTML = `<div class="empty">No bookmarks yet.</div>`;
      return;
    }

    this.storedData.bookmarks.forEach(bm => {
      const el = document.createElement('div');
      el.className = 'bm-item';
      el.style.borderLeftColor = bm.color;
      el.innerHTML = `
        <span class="bm-time">${this.formatTime(bm.time)}</span>
        <span class="bm-name">${this.escapeHtml(bm.name)}</span>
        <button class="icon-btn bm-delete" title="Delete">${ICONS.trash}</button>
      `;

      el.addEventListener('click', (e) => {
        if(e.target.closest('.bm-delete')) return;
        const video = this.getVideoElement();
        if(video) video.currentTime = bm.time;
      });

      el.querySelector('.bm-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        this.storedData.bookmarks = this.storedData.bookmarks.filter(b => b.id !== bm.id);
        this.saveData();
        this.renderBookmarks();
      });

      list.appendChild(el);
    });
    
    this.renderYouTubeDots();
  }

  escapeHtml(unsafe) {
    return (unsafe||"").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  htmlToMarkdown(html, forNotion = false) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    let md = '';
    Array.from(temp.children).forEach(child => {
      if (!child.classList.contains('block')) return;
      
      if (child.querySelector('img')) {
         const img = child.querySelector('img');
         if (img && img.src) {
           if (forNotion) {
             md += `\n*[Screenshot Captured - Export to Markdown to view]*\n\n`;
           } else {
             md += `\n![](${img.src})\n\n`;
           }
         }
         return;
      }
      
      // Convert formatting tags to Markdown syntax before stripping HTML
      let htmlProcessed = child.innerHTML.replace(/<br\s*\/?>/gi, '\n');
      htmlProcessed = htmlProcessed
        .replace(/<span class="ts-chip"[^>]*data-time="([^"]+)"[^>]*>▶ ([^<]+)<\/span>/gi, '[▶ $2](ytdn://seek/$1)')
        .replace(/<(b|strong)[^>]*>/gi, '**')
        .replace(/<\/(b|strong)>/gi, '**')
        .replace(/<(i|em)[^>]*>/gi, '*')
        .replace(/<\/(i|em)>/gi, '*')
        .replace(/<(s|strike)[^>]*>/gi, '~~')
        .replace(/<\/(s|strike)>/gi, '~~')
        .replace(/<u[^>]*>/gi, '__U_START__')
        .replace(/<\/u>/gi, '__U_END__');
      
      // Create a temporary element to let the browser decode HTML entities and strip remaining tags
      const decoder = document.createElement('div');
      decoder.innerHTML = htmlProcessed;
      let text = (decoder.textContent || "").trimEnd();
      
      // Clean up empty asterisks generated by stray/empty formatting tags
      text = text.replace(/\*\*(\s*)\*\*/g, '$1')
                 .replace(/\*(\s*)\*/g, '$1')
                 .replace(/~~(\s*)~~/g, '$1');
      
      // Restore underline HTML (since pure Markdown doesn't have a native underline syntax)
      text = text.replace(/__U_START__/g, '<u>').replace(/__U_END__/g, '</u>');
      
      if (child.tagName === 'H1') md += `# ${text}\n\n`;
      else if (child.tagName === 'H2') md += `## ${text}\n\n`;
      else if (child.tagName === 'H3') md += `### ${text}\n\n`;
      else if (child.tagName === 'BLOCKQUOTE') md += `> ${text}\n\n`;
      else if (child.tagName === 'PRE') md += `\`\`\`\n${text}\n\`\`\`\n\n`;
      else if (child.classList.contains('ul-item')) md += `- ${text}\n`;
      else if (child.classList.contains('ol-item')) md += `1. ${text}\n`;
      else md += `${text}\n\n`;
    });
    
    return md.trim();
  }

  exportMarkdown() {
    if (!this.videoData) return;
    let md = `# ${this.videoData.title}\n\nURL: ${this.videoData.url}\n\n`;
    
    if (this.storedData.bookmarks.length) {
      md += `## Bookmarks\n`;
      this.storedData.bookmarks.forEach(bm => md += `- [${this.formatTime(bm.time)}] ${bm.name}\n`);
      md += `\n`;
    }
    
    md += `## Notes\n\n${this.htmlToMarkdown(this.storedData.htmlNotes)}`;
    
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.videoData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  syncNotion() {
    const btn = this.shadow.getElementById('btnSync');
    const originalText = btn.innerHTML;
    btn.innerHTML = "Syncing...";
    btn.disabled = true;

    chrome.storage.local.get(['notionToken', 'notionDbId'], (res) => {
      if (!res.notionToken || !res.notionDbId) {
        alert("Please configure Notion Settings first!");
        this.shadow.getElementById('settingsModal').classList.add('active');
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
      }

      chrome.runtime.sendMessage({
        type: 'NOTION_SYNC',
        data: {
          token: res.notionToken,
          databaseId: res.notionDbId,
          videoData: this.videoData,
          notes: this.htmlToMarkdown(this.storedData.htmlNotes, true),
          bookmarks: this.storedData.bookmarks
        }
      }, (response) => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        if (response && response.success) {
          alert("Successfully synced to Notion!");
        } else {
          alert("Failed to sync: " + (response?.error || "Unknown error"));
        }
      });
    });
  }

  injectBookmarkButton() {
    const controls = document.querySelector('.ytp-right-controls');
    if (!controls) return;
    if (document.getElementById('yt-deepnote-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'yt-deepnote-btn';
    btn.className = 'ytp-button';
    btn.title = 'DeepNote: Add Bookmark';
    btn.style.verticalAlign = 'top';
    btn.innerHTML = `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><path d="M12,10 v16 l6,-4 l6,4 v-16 z" fill="var(--user-accent, #ff0000)"></path></svg>`;
    
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.addBookmark("Bookmark");
      this.wrapper.classList.remove('hidden');
      this.launcher.classList.add('hidden');
    });

    controls.insertBefore(btn, controls.firstChild);
  }

  renderYouTubeDots() {
    const container = document.querySelector('.ytp-progress-bar-container');
    if (!container) return;

    let dotsContainer = document.getElementById('yt-deepnote-dots');
    if (!dotsContainer) {
      dotsContainer = document.createElement('div');
      dotsContainer.id = 'yt-deepnote-dots';
      dotsContainer.style.position = 'absolute';
      dotsContainer.style.top = '0';
      dotsContainer.style.left = '0';
      dotsContainer.style.width = '100%';
      dotsContainer.style.height = '100%';
      dotsContainer.style.pointerEvents = 'none';
      dotsContainer.style.zIndex = '35';
      container.appendChild(dotsContainer);
    }

    dotsContainer.innerHTML = '';
    
    if (!this.videoData || !this.videoData.duration) return;

    this.storedData.bookmarks.forEach(bm => {
      const dot = document.createElement('div');
      const percent = (bm.time / this.videoData.duration) * 100;
      dot.style.position = 'absolute';
      dot.style.left = `${percent}%`;
      dot.style.bottom = '100%';
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = bm.color || this.selectedColor;
      dot.style.transform = 'translate(-50%, 50%)';
      dot.style.pointerEvents = 'auto';
      dot.style.cursor = 'pointer';
      dot.style.boxShadow = '0 0 4px rgba(0,0,0,0.5)';
      dot.title = `${bm.name} (${this.formatTime(bm.time)})`;
      
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const video = this.getVideoElement();
        if(video) video.currentTime = bm.time;
      });

      dotsContainer.appendChild(dot);
    });
  }
}

// Initialize on page load
let deepnoteInstance = null;

function bootstrap() {
  if (window.location.hostname.includes('youtube.com') && !deepnoteInstance) {
    deepnoteInstance = new YTDeepNote();
  }
}

// YouTube is an SPA, so we need to handle navigation
document.addEventListener('yt-navigate-finish', () => {
  if (!deepnoteInstance) bootstrap();
  else deepnoteInstance.updateVideoMeta(true); // Force reload data for new video
});

// Fallback for initial load
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "TOGGLE_UI" && deepnoteInstance) {
    if (deepnoteInstance.wrapper.classList.contains('hidden')) {
      deepnoteInstance.wrapper.classList.remove('hidden');
      deepnoteInstance.launcher.classList.add('hidden');
    } else {
      deepnoteInstance.wrapper.classList.add('hidden');
      deepnoteInstance.launcher.classList.remove('hidden');
    }
    sendResponse({success:true});
  } else if (msg.type === "QUICK_BOOKMARK" && deepnoteInstance && deepnoteInstance.videoData) {
    deepnoteInstance.addBookmark("Quick Bookmark", deepnoteInstance.videoData.currentTime);
    // Visual toast
    const toast = document.createElement('div');
    toast.innerText = "Bookmark Added!";
    toast.style.cssText = `position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:var(--user-accent, #ff0000); color:white; padding:12px 24px; border-radius:30px; font-weight:bold; z-index:9999999; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.5);`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(()=>toast.remove(),300); }, 2000);
    sendResponse({success:true});
  }
  return true;
});
