document.addEventListener('DOMContentLoaded', () => {
  loadNotes();

  document.getElementById('btnRefresh').addEventListener('click', loadNotes);
});

function loadNotes() {
  const grid = document.getElementById('notesGrid');
  grid.innerHTML = '<div class="loading-state">Loading notes...</div>';

  chrome.storage.local.get(null, (items) => {
    const notes = [];
    for (const key in items) {
      if (key.startsWith('YT_NOTE_') && items[key].videoData) {
        notes.push({
          key: key,
          data: items[key]
        });
      }
    }

    if (notes.length === 0) {
      grid.innerHTML = '<div class="empty-state">No notes found. Open a YouTube video to start taking notes!</div>';
      return;
    }

    // Sort by most recently edited (if we have a timestamp, else by title)
    // We don't have a specific lastEdited timestamp in the old data structure, so we'll just sort by video title
    notes.sort((a, b) => {
      const t1 = a.data.videoData?.title || '';
      const t2 = b.data.videoData?.title || '';
      return t1.localeCompare(t2);
    });

    grid.innerHTML = '';
    notes.forEach(note => {
      const card = createNoteCard(note);
      grid.appendChild(card);
    });
  });
}

function createNoteCard(note) {
  const { videoData, htmlNotes, bookmarks } = note.data;
  
  const card = document.createElement('div');
  card.className = 'note-card';

  const videoUrl = `https://www.youtube.com/watch?v=${videoData.id}`;
  const thumbnail = `https://img.youtube.com/vi/${videoData.id}/hqdefault.jpg`;
  const numBookmarks = bookmarks ? bookmarks.length : 0;
  
  // A rough estimate of note length
  const noteLength = htmlNotes ? htmlNotes.replace(/<[^>]*>?/gm, '').trim().length : 0;
  
  card.innerHTML = `
    <a href="${videoUrl}" target="_blank" class="card-thumbnail">
      <img src="${thumbnail}" alt="Thumbnail" onerror="this.src='https://via.placeholder.com/640x360.png?text=No+Thumbnail'">
      <div class="play-overlay">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l11-7z"/></svg>
      </div>
    </a>
    <div class="card-content">
      <a href="${videoUrl}" target="_blank" class="card-title" title="${videoData.title}">
        ${videoData.title}
      </a>
      <div class="card-meta">
        <span>${numBookmarks} Bookmarks</span>
        <span>${noteLength > 0 ? 'Has Notes' : 'Empty'}</span>
      </div>
      <div class="card-actions">
        <button class="btn secondary btn-export" data-key="${note.key}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
        <button class="btn secondary danger btn-delete" data-key="${note.key}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          Delete
        </button>
      </div>
    </div>
  `;

  const btnDelete = card.querySelector('.btn-delete');
  btnDelete.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete these notes? This cannot be undone.')) {
      chrome.storage.local.remove(note.key, () => {
        card.style.transform = 'scale(0.9)';
        card.style.opacity = '0';
        setTimeout(() => {
          card.remove();
          if (document.querySelectorAll('.note-card').length === 0) {
            loadNotes();
          }
        }, 300);
      });
    }
  });

  const btnExport = card.querySelector('.btn-export');
  btnExport.addEventListener('click', () => {
    exportToMarkdown(note.data);
  });

  return card;
}

function exportToMarkdown(data) {
  const { videoData, htmlNotes, bookmarks } = data;
  
  let md = `# ${videoData.title}\n\n`;
  md += `URL: https://www.youtube.com/watch?v=${videoData.id}\n\n`;
  
  if (bookmarks && bookmarks.length > 0) {
    md += `## Bookmarks\n\n`;
    bookmarks.forEach(bm => {
      const mins = Math.floor(bm.time / 60);
      const secs = Math.floor(bm.time % 60).toString().padStart(2, '0');
      md += `- [${mins}:${secs}] ${bm.name}\n`;
    });
    md += `\n`;
  }

  md += `## Notes\n\n`;
  
  if (htmlNotes) {
    let html = htmlNotes;
    // Replace custom formatting
    html = html.replace(/<b>(.*?)<\/b>/g, '**$1**');
    html = html.replace(/<i>(.*?)<\/i>/g, '*$1*');
    html = html.replace(/<strike>(.*?)<\/strike>/g, '~~$1~~');
    
    // Create a temporary element to extract text while preserving line breaks
    const el = document.createElement('div');
    el.innerHTML = html;
    
    // Simple block element handling for newlines
    const blocks = el.querySelectorAll('div, p, h1, h2, ul, ol, li');
    blocks.forEach(block => {
      block.appendChild(document.createTextNode('\n'));
    });
    
    md += el.innerText;
  } else {
    md += `*No notes taken.*`;
  }

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `YT_Notes_${videoData.id}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
