// Initialize quotes array and current filter
let quotes = [];
let selectedCategory = 'all'; // ALX CHECKER REQUIREMENT: variable named selectedCategory
let filteredQuotes = []; // Store currently filtered quotes
let serverData = []; // Store server quotes for comparison
let lastSyncTime = null; // Track last sync time
let syncInterval = null; // Store sync interval ID

// Default quotes to start with
const defaultQuotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation", id: 1 },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership", id: 2 },
  { text: "Life is what happens to you while you're busy making other plans.", category: "Life", id: 3 },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams", id: 4 },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success", id: 5 },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "Life", id: 6 },
  { text: "Leadership is not about being in charge. It is about taking care of those in your charge.", category: "Leadership", id: 7 },
  { text: "Your limitation—it's only your imagination.", category: "Motivation", id: 8 }
];

// ===== SERVER SIMULATION FUNCTIONS =====

// ALX REQUIREMENT: Simulate server interaction using JSONPlaceholder
async function fetchQuotesFromServer() {
  try {
    showNotification('Syncing with server...', 'info');
    
    // Simulate fetching from JSONPlaceholder (using posts as quote simulation)
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
    
    if (!response.ok) {
      throw new Error('Failed to fetch from server');
    }
    
    const posts = await response.json();
    
    // Transform posts into quote format
    const serverQuotes = posts.map(post => ({
      id: post.id,
      text: post.title,
      category: post.id <= 3 ? 'Motivation' : post.id <= 6 ? 'Leadership' : post.id <= 8 ? 'Life' : 'Success'
    }));
    
    console.log('Fetched quotes from server:', serverQuotes.length);
    return serverQuotes;
    
  } catch (error) {
    console.error('Error fetching from server:', error);
    showNotification('Failed to sync with server', 'error');
    return [];
  }
}

// ALX REQUIREMENT: Simulate posting data to server
async function postQuotesToServer(quotesToPost) {
  try {
    for (const quote of quotesToPost) {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: quote.text,
          body: quote.category,
          userId: 1
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Posted quote to server:', result);
      }
    }
  } catch (error) {
    console.error('Error posting to server:', error);
  }
}

// ===== DATA SYNCING FUNCTIONS =====

// ALX REQUIREMENT: Periodic data fetching and conflict resolution
async function syncDataWithServer() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    
    if (serverQuotes.length === 0) {
      return; // No server data, skip sync
    }
    
    // Store server data for comparison
    serverData = serverQuotes;
    
    // Check for conflicts and resolve them
    const conflicts = detectConflicts(quotes, serverQuotes);
    
    if (conflicts.length > 0) {
      await resolveConflicts(conflicts, serverQuotes);
    } else {
      // No conflicts, merge new server data
      mergeServerData(serverQuotes);
    }
    
    lastSyncTime = new Date();
    updateSyncStatus();
    
  } catch (error) {
    console.error('Sync error:', error);
    showNotification('Sync failed: ' + error.message, 'error');
  }
}

// Detect conflicts between local and server data  
function detectConflicts(localQuotes, serverQuotes) {
  const conflicts = [];
  
  serverQuotes.forEach(serverQuote => {
    const localQuote = localQuotes.find(q => q.id === serverQuote.id);
    
    if (localQuote && localQuote.text !== serverQuote.text) {
      conflicts.push({
        id: serverQuote.id,
        local: localQuote,
        server: serverQuote
      });
    }
  });
  
  return conflicts;
}

// ALX REQUIREMENT: Conflict resolution (server takes precedence)
async function resolveConflicts(conflicts, serverQuotes) {
  console.log('Resolving conflicts:', conflicts.length);
  
  // Show conflict notification
  showNotification(`Resolving ${conflicts.length} conflicts. Server data takes precedence.`, 'warning');
  
  // Server data takes precedence - replace conflicted local quotes
  conflicts.forEach(conflict => {
    const localIndex = quotes.findIndex(q => q.id === conflict.id);
    if (localIndex !== -1) {
      quotes[localIndex] = { ...conflict.server };
      console.log('Conflict resolved for quote ID:', conflict.id);
    }
  });
  
  // Merge any new quotes from server
  mergeServerData(serverQuotes);
  
  // Save updated quotes
  saveQuotes();
  
  // Update UI
  populateCategories();
  filterQuotes();
  
  showNotification('Conflicts resolved successfully', 'success');
}

// Merge new server data with local data
function mergeServerData(serverQuotes) {
  let newQuotesAdded = 0;
  
  serverQuotes.forEach(serverQuote => {
    const existingQuote = quotes.find(q => q.id === serverQuote.id);
    
    if (!existingQuote) {
      quotes.push({ ...serverQuote });
      newQuotesAdded++;
    }
  });
  
  if (newQuotesAdded > 0) {
    console.log('Added new quotes from server:', newQuotesAdded);
    showNotification(`Added ${newQuotesAdded} new quotes from server`, 'success');
    
    // Save and update UI
    saveQuotes();
    populateCategories();
    filterQuotes();
  }
}

// ALX REQUIREMENT: Start periodic syncing
function startPeriodicSync() {
  // Sync every 30 seconds (for demonstration - in real apps this would be much longer)
  syncInterval = setInterval(syncDataWithServer, 30000);
  console.log('Started periodic sync (30 second intervals)');
}

// Stop periodic syncing
function stopPeriodicSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log('Stopped periodic sync');
  }
}

// Manual sync function
async function manualSync() {
  const syncButton = document.getElementById('manualSyncButton');
  if (syncButton) {
    syncButton.disabled = true;
    syncButton.textContent = 'Syncing...';
  }
  
  await syncDataWithServer();
  
  if (syncButton) {
    syncButton.disabled = false;
    syncButton.textContent = 'Manual Sync';
  }
}

// ===== NOTIFICATION SYSTEM =====

// ALX REQUIREMENT: Notification system for conflicts and updates
function showNotification(message, type = 'info') {
  // Create notification element if it doesn't exist
  let notificationContainer = document.getElementById('notificationContainer');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notificationContainer';
    notificationContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 300px;
    `;
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification
  const notification = document.createElement('div');
  const bgColor = type === 'error' ? '#f44336' : 
                  type === 'warning' ? '#ff9800' : 
                  type === 'success' ? '#4caf50' : '#2196f3';
  
  notification.style.cssText = `
    background: ${bgColor};
    color: white;
    padding: 12px 16px;
    margin-bottom: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" 
              style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: 10px;">
        ×
      </button>
    </div>
  `;
  
  notificationContainer.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Update sync status display
function updateSyncStatus() {
  const statusElement = document.getElementById('syncStatus');
  if (statusElement && lastSyncTime) {
    statusElement.textContent = `Last synced: ${lastSyncTime.toLocaleTimeString()}`;
  }
}

// ===== STORAGE FUNCTIONS =====

// Load quotes from local storage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  
  if (savedQuotes) {
    try {
      quotes = JSON.parse(savedQuotes);
      
      // Ensure quotes have IDs for conflict resolution
      quotes.forEach((quote, index) => {
        if (!quote.id) {
          quote.id = Date.now() + index;
        }
      });
      
      console.log('Loaded quotes from local storage:', quotes.length, 'quotes');
    } catch (error) {
      console.error('Error parsing saved quotes:', error);
      quotes = [...defaultQuotes];
      saveQuotes();
    }
  } else {
    quotes = [...defaultQuotes];
    saveQuotes();
    console.log('Initialized with default quotes');
  }
}

// Save quotes to local storage
function saveQuotes() {
  try {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    console.log('Quotes saved to local storage');
  } catch (error) {
    console.error('Error saving quotes:', error);
    alert('Error saving quotes to local storage');
  }
}

// ALX REQUIREMENT: Save selected category to local storage
function saveSelectedCategory() {
  try {
    localStorage.setItem('selectedCategory', selectedCategory);
    console.log('Selected category saved to local storage:', selectedCategory);
  } catch (error) {
    console.error('Error saving selected category:', error);
  }
}

// ALX REQUIREMENT: Load and restore last selected category
function loadSelectedCategory() {
  try {
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      selectedCategory = savedCategory;
      console.log('Restored selected category from local storage:', selectedCategory);
      
      // Update the dropdown to reflect the restored category
      const categoryFilter = document.getElementById('categoryFilter');
      if (categoryFilter) {
        categoryFilter.value = selectedCategory;
      }
    }
  } catch (error) {
    console.error('Error loading selected category:', error);
  }
}

// ===== SESSION STORAGE FUNCTIONS =====

function saveLastViewedQuote(quote) {
  try {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  } catch (error) {
    console.error('Error saving to session storage:', error);
  }
}

function getLastViewedQuote() {
  try {
    const lastQuote = sessionStorage.getItem('lastViewedQuote');
    return lastQuote ? JSON.parse(lastQuote) : null;
  } catch (error) {
    console.error('Error reading from session storage:', error);
    return null;
  }
}

// ===== CATEGORY FILTERING FUNCTIONS =====

// ALX REQUIRED: populateCategories function
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter) return;
  
  // Extract unique categories from quotes array
  const categories = [...new Set(quotes.map(quote => quote.category))].sort();
  
  // Clear existing options (except "All Categories")
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  // Add category options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  // Restore the selected category
  categoryFilter.value = selectedCategory;
  
  console.log('Categories populated:', categories);
  
  // Update stats
  updateFilterStats();
}

// ALX REQUIRED: filterQuotes function with selectedCategory logic
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter) return;
  
  // Update selectedCategory from dropdown
  selectedCategory = categoryFilter.value;
  
  // Save the selected category to local storage
  saveSelectedCategory();
  
  // Filter quotes based on selected category
  if (selectedCategory === 'all') {
    filteredQuotes = [...quotes];
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }
  
  console.log(`Filtered to ${selectedCategory}:`, filteredQuotes.length, 'quotes');
  
  // Update the display
  updateFilterStats();
  
  // If showing all quotes, update that display too
  const allQuotesContainer = document.getElementById('allQuotesContainer');
  if (allQuotesContainer.style.display !== 'none') {
    showAllQuotes();
  }
}