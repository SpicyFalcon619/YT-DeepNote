// sidepanel.js

let currentVideoData = null;
let pollInterval = null;
let currentTabId = null;

// UI Elements
const videoTitleEl = document.getElementById('videoTitle');
const videoTimeEl = document.getElementById('videoTime');
const refreshBtn = document.getElementById('refreshBtn');

const playlistContainer = document.getElementById('playlistContainer');
const playlistProgressText = document.getElementById('playlistProgressText');
const playlistRemainingTime = document.getElementById('playlistRemainingTime');
const playlistProgressBar = document.getElementById('playlistProgressBar');

const bookmarkNameInput = document.getElementById('bookmarkName');
const bookmarkColorPicker = document.getElementById('bookmarkColorPicker');
const addBookmarkBtn = document.getElementById('addBookmarkBtn');
const bookmarksListEl = document.getElementById('bookmarksList');

const notesEditor = document.getElementById('notesEditor');
const notesPreview = document.getElementById('notesPreview');
const tabEdit = document.getElementById('tabEdit');
const tabPreview = document.getElementById('tabPreview');

const exportLocalBtn = document.getElementById('exportLocalBtn');
const syncNotionBtn = document.getElementById('syncNotionBtn');
const settingsToggleBtn = document.getElementById('settingsToggleBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const notionTokenInput = document.getElementById('notionToken');
const notionDbIdInput = document.getElementById('notionDbId');
const settingsStatus = document.getElementById('settingsStatus');

// State
let selectedColor = '#e74c3c';
let storedData = { bookmarks: [], notes: '' };

// Initialize
async function init() {
  // Load settings
  chrome.storage.local.get(['notionToken', 'notionDbId'], (result) => {
    if (result.notionToken) notionTokenInput.value = result.notionToken;
    if (result.notionDbId) notionDbIdInput.value = result.notionDbId;
  });

  await connectToActiveTab();
  
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(updateVideoTime, 1000);
}

async function connectToActiveTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length === 0 || !tabs[0].url.includes('youtube.com/watch')) {
      videoTitleEl.innerText = "Please open a YouTube video";
      return;
    }
    
    currentTabId = tabs[0].id;
    await fetchVideoData();
  } catch (e) {
    console.error(e);
  }
}

async function fetchVideoData() {
  if (!currentTabId) return;
  try {
    const response = await chrome.tabs.sendMessage(currentTabId, { type: "GET_VIDEO_DATA" });
    if (response && response.videoId) {
      const isNewVideo = !currentVideoData || currentVideoData.videoId !== response.videoId;
      currentVideoData = response;
      updateHeaderUI();
      
      if (isNewVideo) {
        await loadVideoStorageData(currentVideoData.videoId);
      }
    }
  } catch (e) {
    console.log("Could not connect to content script. Please refresh the YouTube page.");
  }
}

async function updateVideoTime() {
  if (!currentTabId) return;
  try {
    const response = await chrome.tabs.sendMessage(currentTabId, { type: "GET_VIDEO_DATA" });
    if (response) {
      currentVideoData = response;
      updateHeaderUI();
    }
  } catch (e) {
    // Content script might not be ready
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateHeaderUI() {
  if (!currentVideoData) return;
  
  videoTitleEl.innerText = currentVideoData.title;
  videoTimeEl.innerText = `${formatTime(currentVideoData.currentTime)} / ${formatTime(currentVideoData.duration)}`;
  
  if (currentVideoData.playlistData) {
    playlistContainer.classList.remove('hidden');
    const pd = currentVideoData.playlistData;
    playlistProgressText.innerText = `Video ${pd.currentIndex} of ${pd.totalVideos}`;
    playlistRemainingTime.innerText = `Remaining: ${formatTime(pd.remainingSeconds)}`;
    
    let progress = 0;
    if (pd.totalVideos > 0) {
      // Calculate progress roughly by index
      progress = (pd.currentIndex / pd.totalVideos) * 100;
    }
    playlistProgressBar.style.width = `${progress}%`;
  } else {
    playlistContainer.classList.add('hidden');
  }
}

// Storage Operations
async function loadVideoStorageData(videoId) {
  const key = `yt_data_${videoId}`;
  const result = await chrome.storage.local.get([key]);
  storedData = result[key] || { bookmarks: [], notes: '' };
  
  notesEditor.value = storedData.notes;
  renderBookmarks();
}

async function saveVideoStorageData() {
  if (!currentVideoData) return;
  const key = `yt_data_${currentVideoData.videoId}`;
  
  // Keep bookmarks sorted by time
  storedData.bookmarks.sort((a, b) => a.time - b.time);
  
  await chrome.storage.local.set({ [key]: storedData });
}

// Listen for quick bookmarks from background/content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ADD_QUICK_BOOKMARK" && message.videoData.videoId === currentVideoData?.videoId) {
    storedData.bookmarks.push({
      id: Date.now().toString(),
      time: message.time,
      name: "Quick Bookmark",
      color: "#e74c3c"
    });
    saveVideoStorageData();
    renderBookmarks();
    sendResponse({success: true});
  }
});


// Bookmarks UI
function renderBookmarks() {
  bookmarksListEl.innerHTML = '';
  
  if (!storedData.bookmarks || storedData.bookmarks.length === 0) {
    bookmarksListEl.innerHTML = '<div class="empty-state">No bookmarks for this video yet. Press Ctrl+Shift+B to quick add.</div>';
    return;
  }
  
  storedData.bookmarks.forEach(bm => {
    const div = document.createElement('div');
    div.className = 'bookmark-item';
    div.style.borderLeftColor = bm.color;
    
    div.innerHTML = `
      <span class="bookmark-time">${formatTime(bm.time)}</span>
      <span class="bookmark-name">${escapeHtml(bm.name)}</span>
      <button class="delete-btn" title="Delete">🗑️</button>
    `;
    
    // Seek on click
    div.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) return;
      chrome.tabs.sendMessage(currentTabId, { type: "SEEK_TO", time: bm.time });
    });
    
    // Delete on click
    div.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      storedData.bookmarks = storedData.bookmarks.filter(b => b.id !== bm.id);
      saveVideoStorageData();
      renderBookmarks();
    });
    
    bookmarksListEl.appendChild(div);
  });
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

addBookmarkBtn.addEventListener('click', () => {
  if (!currentVideoData) return;
  
  const name = bookmarkNameInput.value.trim() || "Bookmark";
  
  storedData.bookmarks.push({
    id: Date.now().toString(),
    time: currentVideoData.currentTime,
    name: name,
    color: selectedColor
  });
  
  bookmarkNameInput.value = '';
  saveVideoStorageData();
  renderBookmarks();
});

bookmarkColorPicker.addEventListener('click', (e) => {
  if (e.target.classList.contains('color-swatch')) {
    document.querySelectorAll('.color-swatch').forEach(el => el.classList.remove('active'));
    e.target.classList.add('active');
    selectedColor = e.target.dataset.color;
  }
});

// Notes UI
notesEditor.addEventListener('input', (e) => {
  storedData.notes = e.target.value;
  saveVideoStorageData();
});

tabEdit.addEventListener('click', () => {
  tabEdit.classList.add('active');
  tabPreview.classList.remove('active');
  notesEditor.classList.remove('hidden');
  notesPreview.classList.add('hidden');
});

tabPreview.addEventListener('click', () => {
  tabPreview.classList.add('active');
  tabEdit.classList.remove('active');
  notesPreview.classList.remove('hidden');
  notesEditor.classList.add('hidden');
  
  // Simple markdown parser
  notesPreview.innerHTML = parseMarkdown(storedData.notes);
});

function parseMarkdown(text) {
  if (!text) return "<em>No notes yet.</em>";
  
  let html = escapeHtml(text);
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold & Italic
  html = html.replace(/\*\*(.*)\*\*/gim, '<b>$1</b>');
  html = html.replace(/\*(.*)\*/gim, '<i>$1</i>');
  
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');
  html = html.replace(/`(.*?)`/gim, '<code>$1</code>');
  
  // Lists
  html = html.replace(/^\s*\n\*/gm, '<ul>\n*');
  html = html.replace(/^(\*.*)/gim, '<li>$1</li>');
  html = html.replace(/<li>\*/gim, '<li>');
  
  // Newlines
  html = html.replace(/\n$/gim, '<br />');
  
  return html;
}

// Exports
exportLocalBtn.addEventListener('click', () => {
  if (!currentVideoData) return;
  
  let mdContent = `# ${currentVideoData.title}\n\n`;
  mdContent += `URL: ${currentVideoData.url}\n\n`;
  
  if (storedData.bookmarks.length > 0) {
    mdContent += `## Bookmarks\n\n`;
    storedData.bookmarks.forEach(bm => {
      mdContent += `- [${formatTime(bm.time)}] ${bm.name}\n`;
    });
    mdContent += `\n`;
  }
  
  if (storedData.notes) {
    mdContent += `## Notes\n\n${storedData.notes}\n`;
  }
  
  const blob = new Blob([mdContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentVideoData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.md`;
  a.click();
  
  URL.revokeObjectURL(url);
});

// Notion Sync
syncNotionBtn.addEventListener('click', () => {
  if (!currentVideoData) return;
  
  const token = notionTokenInput.value.trim();
  const dbId = notionDbIdInput.value.trim();
  
  if (!token || !dbId) {
    alert("Please set your Notion Token and Database ID in Settings.");
    settingsPanel.classList.remove('hidden');
    return;
  }
  
  const originalText = syncNotionBtn.innerText;
  syncNotionBtn.innerText = "Syncing...";
  syncNotionBtn.disabled = true;
  
  chrome.runtime.sendMessage({
    type: 'NOTION_SYNC',
    data: {
      token: token,
      databaseId: dbId,
      videoData: currentVideoData,
      notes: storedData.notes,
      bookmarks: storedData.bookmarks
    }
  }, (response) => {
    syncNotionBtn.innerText = originalText;
    syncNotionBtn.disabled = false;
    
    if (response && response.success) {
      alert("Successfully synced to Notion!");
    } else {
      alert("Failed to sync: " + (response?.error || "Unknown error"));
    }
  });
});

// Settings
settingsToggleBtn.addEventListener('click', () => {
  settingsPanel.classList.remove('hidden');
});

closeSettingsBtn.addEventListener('click', () => {
  settingsPanel.classList.add('hidden');
  settingsStatus.innerText = '';
});

saveSettingsBtn.addEventListener('click', () => {
  const token = notionTokenInput.value.trim();
  const dbId = notionDbIdInput.value.trim();
  
  chrome.storage.local.set({
    notionToken: token,
    notionDbId: dbId
  }, () => {
    settingsStatus.className = 'status-message success';
    settingsStatus.innerText = 'Settings saved successfully!';
    setTimeout(() => { settingsStatus.innerText = ''; }, 3000);
  });
});

refreshBtn.addEventListener('click', () => {
  init();
});

// Run Init
init();
