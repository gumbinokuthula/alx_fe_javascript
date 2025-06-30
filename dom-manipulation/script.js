// Step 1: Define the quotes array
const quotes = [
    { text: "Stay hungry, stay foolish.", category: "inspiration" },
    { text: "Talk is cheap. Show me the code.", category: "tech" },
    { text: "Be yourself; everyone else is already taken.", category: "life" }
  ];
  
  // Step 2: Show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerText = `"${quote.text}" - ${quote.category}`;
  }
  
  // Step 3: Add a new quote to the array and update DOM
  function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();
  
    if (text && category) {
      quotes.push({ text, category });
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      showRandomQuote(); // Optional: Show new quote immediately
    }
  }
  
  // Step 4: Event listener for “Show New Quote” button
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  });
  