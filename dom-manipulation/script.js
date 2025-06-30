// Initialize quotes array and current filter
let quotes = [];
let currentFilter = 'all'; // Track current category filter
let filteredQuotes = []; // Store currently filtered quotes

// Default quotes to start with
const defaultQuotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
  { text: "Life is what happens to you while you're busy making other plans.", category: "Life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "Life" },
  { text: "Leadership is not about being in charge. It is about taking care of those in your charge.", category: "Leadership" },
  { text: "Your limitation—it's only your imagination.", category: "Motivation" }
];

// ===== STORAGE FUNCTIONS =====

// Load quotes from local storage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  
  if (savedQuotes) {
    try {
      quotes = JSON.parse(savedQuotes);
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

// Load last selected filter from local storage
function loadLastFilter() {
  const savedFilter = localStorage.getItem('lastCategoryFilter');
  if (savedFilter) {
    currentFilter = savedFilter;
    console.log('Loaded last filter:', currentFilter);
  }
}

// Save current filter to local storage
function saveCurrentFilter() {
  try {
    localStorage.setItem('lastCategoryFilter', currentFilter);
    console.log('Saved current filter:', currentFilter);
  } catch (error) {
    console.error('Error saving filter:', error);
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
  
  // Restore last selected filter
  categoryFilter.value = currentFilter;
  
  console.log('Categories populated:', categories);
  
  // Update stats
  updateFilterStats();
}

// ALX REQUIRED: filterQuotes function
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter) return;
  
  // Get selected category
  currentFilter = categoryFilter.value;
  
  // Save the filter choice
  saveCurrentFilter();
  
  // Filter quotes based on selected category
  if (currentFilter === 'all') {
    filteredQuotes = [...quotes];
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === currentFilter);
  }
  
  console.log(`Filtered to ${currentFilter}:`, filteredQuotes.length, 'quotes');
  
  // Update the display
  updateFilterStats();
  
  // If showing all quotes, update that display too
  const allQuotesContainer = document.getElementById('allQuotesContainer');
  if (allQuotesContainer.style.display !== 'none') {
    showAllQuotes();
  }
}

// Update filter statistics display
function updateFilterStats() {
  const statsElement = document.getElementById('filterStats');
  if (!statsElement) return;
  
  const totalQuotes = quotes.length;
  const visibleQuotes = filteredQuotes.length;
  
  if (currentFilter === 'all') {
    statsElement.textContent = `Showing all ${totalQuotes} quotes`;
  } else {
    statsElement.textContent = `Showing ${visibleQuotes} quotes in "${currentFilter}" category (${totalQuotes} total)`;
  }
}

// ===== QUOTE DISPLAY FUNCTIONS =====

// Show a random quote from filtered quotes
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Use filtered quotes for random selection
  const quotesToUse = filteredQuotes.length > 0 ? filteredQuotes : quotes;
  
  if (quotesToUse.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes available for this category. Add some quotes first!</p>';
    return;
  }
  
  // Get random quote from filtered set
  const randomIndex = Math.floor(Math.random() * quotesToUse.length);
  const selectedQuote = quotesToUse[randomIndex];
  
  // Display the quote
  quoteDisplay.innerHTML = `
    <div class="quote-text">"${selectedQuote.text}"</div>
    <div class="quote-category">— ${selectedQuote.category}</div>
  `;
  
  // Save to session storage
  saveLastViewedQuote(selectedQuote);
  
  console.log('Displayed quote:', selectedQuote);
}

// Show all quotes (filtered by current category)
function showAllQuotes() {
  const container = document.getElementById('allQuotesContainer');
  const display = document.getElementById('allQuotesDisplay');
  const title = document.getElementById('allQuotesTitle');
  
  if (!container || !display || !title) return;
  
  // Use filtered quotes
  const quotesToShow = filteredQuotes.length > 0 ? filteredQuotes : quotes;
  
  if (quotesToShow.length === 0) {
    display.innerHTML = '<p>No quotes available for this category.</p>';
    container.style.display = 'block';
    return;
  }
  
  // Update title based on filter
  if (currentFilter === 'all') {
    title.textContent = `📚 All Quotes (${quotesToShow.length})`;
  } else {
    title.textContent = `📚 ${currentFilter} Quotes (${quotesToShow.length})`;
  }
  
  // Generate HTML for all quotes
  const quotesHTML = quotesToShow.map((quote, index) => `
    <div style="background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2196f3;">
      <div class="quote-text">"${quote.text}"</div>
      <div class="quote-category">— ${quote.category}</div>
    </div>
  `).join('');
  
  display.innerHTML = quotesHTML;
  container.style.display = 'block';
  
  // Scroll to the container
  container.scrollIntoView({ behavior: 'smooth' });
}

// ===== ADD QUOTE FUNCTION (ENHANCED) =====

// Enhanced addQuote function that updates categories
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  
  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();
  
  // Validation
  if (newText === '' || newCategory === '') {
    alert('Please enter both a quote and category!');
    return;
  }
  
  // Create new quote object
  const newQuote = {
    text: newText,
    category: newCategory
  };
  
  // Add to quotes array
  quotes.push(newQuote);
  
  // Save to local storage immediately
  saveQuotes();
  
  // Update categories dropdown (ALX requirement)
  populateCategories();
  
  // Re-apply current filter to include new quote if applicable
  filterQuotes();
  
  // Clear input fields
  textInput.value = '';
  categoryInput.value = '';
  
  // Show the new quote if it matches current filter
  if (currentFilter === 'all' || currentFilter === newCategory) {
    showRandomQuote();
  }
  
  alert('Quote added successfully!');
  console.log('New quote added:', newQuote);
}

// ===== JSON EXPORT/IMPORT FUNCTIONS =====

function exportToJsonFile() {
  if (quotes.length === 0) {
    alert('No quotes to export!');
    return;
  }
  
  try {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `quotes-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    URL.revokeObjectURL(url);
    
    alert(`Successfully exported ${quotes.length} quotes!`);
    console.log('Quotes exported successfully');
    
  } catch (error) {
    console.error('Export error:', error);
    alert('Error exporting quotes');
  }
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  
  if (!file) {
    alert('No file selected!');
    return;
  }
  
  if (!file.name.endsWith('.json')) {
    alert('Please select a JSON file!');
    return;
  }
  
  const fileReader = new FileReader();
  
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      
      if (!Array.isArray(importedQuotes)) {
        throw new Error('Invalid file format: expected an array of quotes');
      }
      
      for (let quote of importedQuotes) {
        if (!quote.text || !quote.category) {
          throw new Error('Invalid quote format: each quote must have text and category');
        }
      }
      
      // Add imported quotes
      quotes.push(...importedQuotes);
      
      // Save to local storage
      saveQuotes();
      
      // Update categories and filter
      populateCategories();
      filterQuotes();
      
      alert(`Quotes imported successfully! Added ${importedQuotes.length} new quotes.`);
      showRandomQuote();
      
      console.log('Import successful:', importedQuotes.length, 'quotes added');
      
    } catch (error) {
      console.error('Import error:', error);
      alert('Error importing file: ' + error.message);
    }
  };
  
  fileReader.onerror = function() {
    alert('Error reading file');
  };
  
  fileReader.readAsText(file);
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Quote Generator with Filtering...');
  
  // Load existing quotes and filter preferences
  loadQuotes();
  loadLastFilter();
  
  // Populate categories dropdown
  populateCategories();
  
  // Apply current filter
  filterQuotes();
  
  // Set up event listener for "Show New Quote" button
  const newQuoteButton = document.getElementById('newQuote');
  if (newQuoteButton) {
    newQuoteButton.addEventListener('click', showRandomQuote);
  }
  
  // Show initial quote
  showRandomQuote();
  
  console.log('Application initialized successfully');
  console.log('Total quotes available:', quotes.length);
  console.log('Current filter:', currentFilter);
});