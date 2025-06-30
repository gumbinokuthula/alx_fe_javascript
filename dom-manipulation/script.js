// Step 1: The quotes array (starts empty, will load from storage)
let quotes = [];

// Step 2: LOAD quotes from Local Storage when page loads
function loadQuotes() {
  // Think: Check if we have quotes saved in our "memory box"
  const savedQuotes = localStorage.getItem('quotes');
  
  if (savedQuotes) {
    // If we found saved quotes, use them
    quotes = JSON.parse(savedQuotes);
    console.log("Loaded quotes from storage:", quotes);
  } else {
    // If no saved quotes, use our default starter quotes
    quotes = [
      { text: "Believe in yourself and all that you are.", category: "Motivation" },
      { text: "The only way to do great work is to love what you do.", category: "Work" },
      { text: "Success is not final, failure is not fatal.", category: "Success" }
    ];
    // Save these starter quotes immediately
    saveQuotes();
  }
}

// Step 3: SAVE quotes to Local Storage (our "memory box")
function saveQuotes() {
  // Think: Put our current quotes into the "permanent memory box"
  localStorage.setItem('quotes', JSON.stringify(quotes));
  console.log("Quotes saved to storage!");
}

// Step 4: Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}"<br><em>(${quote.category})</em></p>`;
  
  // BONUS: Save the last viewed quote in session storage (temporary memory)
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Step 5: ALX REQUIRED - createAddQuoteForm function
function createAddQuoteForm() {
  // This function creates the form structure that ALX expects
  // Since we already have the form in HTML, we'll just ensure it's properly connected
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  
  // If form doesn't exist, add it to the body
  if (!document.getElementById('newQuoteText')) {
    document.body.appendChild(formContainer);
  }
}

// Step 6: Function to add a new quote from the form
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both a quote and category.");
    return;
  }

  // Add the new quote to our collection (ADD TO ARRAY)
  quotes.push({ text: newText, category: newCategory });
  
  // IMPORTANT: Save to storage immediately so we don't lose it!
  saveQuotes();

  // UPDATE THE DOM - Show the new quote immediately
  showRandomQuote();
  
  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  
  alert("Quote added and saved!");
}

// Step 7: EXPORT function - Download quotes as a file
function exportToJsonFile() {
  // Think: Take all our quotes and put them in a "backpack" (file)
  const dataStr = JSON.stringify(quotes, null, 2); // Pretty format with spaces
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  // Create a download link
  const url = URL.createObjectURL(dataBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'my-quotes.json'; // Name of the file
  
  // Automatically click the download link
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  // Clean up
  URL.revokeObjectURL(url);
  
  alert("Quotes exported successfully!");
}

// Step 8: IMPORT function - Upload quotes from a file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  
  if (!file) {
    alert("No file selected!");
    return;
  }
  
  const fileReader = new FileReader();
  
  fileReader.onload = function(event) {
    try {
      // Read the file and convert from JSON
      const importedQuotes = JSON.parse(event.target.result);
      
      // Add imported quotes to our existing collection
      quotes.push(...importedQuotes);
      
      // Save everything to storage
      saveQuotes();
      
      alert(`Successfully imported ${importedQuotes.length} quotes!`);
      
      // Show a random quote from our updated collection
      showRandomQuote();
      
    } catch (error) {
      alert("Error reading file. Please make sure it's a valid JSON file.");
      console.error("Import error:", error);
    }
  };
  
  // Start reading the file
  fileReader.readAsText(file);
}

// Step 9: Initialize everything when page loads
document.addEventListener("DOMContentLoaded", function () {
  // First, load any saved quotes
  loadQuotes();
  
  // Create the add quote form (ALX requirement)
  createAddQuoteForm();
  
  // Show a random quote immediately
  showRandomQuote();
  
  // EVENT LISTENER: Connect the "Show New Quote" button (ALX requirement)
  const newQuoteButton = document.getElementById("newQuote");
  if (newQuoteButton) {
    newQuoteButton.addEventListener("click", showRandomQuote);
  }
  
  console.log("Quote Generator initialized with", quotes.length, "quotes");
});