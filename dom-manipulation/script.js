// Step 1: The quotes array
let quotes = [
    { text: "Believe in yourself and all that you are.", category: "Motivation" },
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Success is not final, failure is not fatal.", category: "Success" }
  ];
  
  // Step 2: Function to display a random quote
  function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
  
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available.";
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${quote.text}"<br><em>(${quote.category})</em></p>`;
  }
  
  // Step 3: Function to add a new quote from the form
  function addQuote() {
    const newText = document.getElementById("newQuoteText").value.trim();
    const newCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (newText === "" || newCategory === "") {
      alert("Please enter both a quote and category.");
      return;
    }
  
    quotes.push({ text: newText, category: newCategory });
  
    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  
    // Optionally show the new quote immediately
    showRandomQuote();
  }
  
  // Step 4: Event listener for “Show New Quote” button
  document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("newQuote");
    button.addEventListener("click", showRandomQuote);
  });
  