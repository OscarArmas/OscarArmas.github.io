// Notes App - Save and load notes from localStorage
const STORAGE_KEY = 'weblab-notes';

const notesArea = document.getElementById('notesArea');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const status = document.getElementById('status');

// Load saved notes on page load
function loadNotes() {
  const savedNotes = localStorage.getItem(STORAGE_KEY);
  if (savedNotes) {
    notesArea.value = savedNotes;
    status.textContent = 'Notes loaded from storage';
  }
}

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, notesArea.value);
  status.textContent = 'Notes saved!';
  
  // Reset status after 2 seconds
  setTimeout(() => {
    status.textContent = 'Ready';
  }, 2000);
}

// Clear notes
function clearNotes() {
  if (confirm('Are you sure you want to clear all notes?')) {
    notesArea.value = '';
    localStorage.removeItem(STORAGE_KEY);
    status.textContent = 'Notes cleared';
    
    setTimeout(() => {
      status.textContent = 'Ready';
    }, 2000);
  }
}

// Event listeners
saveBtn.addEventListener('click', saveNotes);
clearBtn.addEventListener('click', clearNotes);

// Auto-save on Ctrl+S
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    saveNotes();
  }
});

// Load notes on page load
loadNotes();
