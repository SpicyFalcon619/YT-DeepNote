// background.js

// Allow users to toggle the injected UI by clicking on the action toolbar icon
chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("youtube.com/watch")) {
    chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_UI" }).catch(err => console.log("Content script not ready:", err));
  }
});

// Listen to commands (e.g. keyboard shortcuts)
chrome.commands.onCommand.addListener((command) => {
  if (command === 'add-quick-bookmark') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url.includes("youtube.com/watch")) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "QUICK_BOOKMARK" });
      }
    });
  }
});

// Handle messages from the sidepanel or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'NOTION_SYNC') {
    handleNotionSync(request.data)
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
  }
  
  if (request.type === 'OPEN_SIDE_PANEL') {
    chrome.sidePanel.open({ windowId: sender.tab.windowId }).catch(e => console.error(e));
    return;
  }
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidepanel') {
    port.onDisconnect.addListener(() => {
      // The side panel was closed! Send a message to the active tab to show the launcher
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        if (tabs[0] && tabs[0].url && tabs[0].url.includes("youtube.com/watch")) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "SIDEPANEL_CLOSED" }).catch(() => {});
        }
      });
    });
  }
});


async function handleNotionSync(data) {
  const { token, databaseId, videoData, notes, bookmarks } = data;
  
  if (!token || !databaseId) {
    throw new Error("Missing Notion Token or Database ID");
  }

  // Construct the Notion API payload
  // This is a basic structure for a new page in a database
  const payload = {
    parent: { database_id: databaseId },
    properties: {
      "Name": {
        title: [
          {
            text: {
              content: videoData.title || "YouTube Video"
            }
          }
        ]
      }
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: "Video URL: "
              }
            },
            {
              type: 'text',
              text: {
                content: videoData.url,
                link: { url: videoData.url }
              }
            }
          ]
        }
      }
    ]
  };

  // Add notes as blocks
  if (notes) {
    payload.children.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: notes.substring(0, 2000) // Notion block limits
            }
          }
        ]
      }
    });
  }

  // Add bookmarks as blocks
  if (bookmarks && bookmarks.length > 0) {
    payload.children.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: "Bookmarks" } }]
      }
    });
    
    bookmarks.forEach(bm => {
      payload.children.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `[${formatTime(bm.time)}] ${bm.name} (${bm.color})`
              }
            }
          ]
        }
      });
    });
  }

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to sync to Notion");
  }

  return await response.json();
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}
