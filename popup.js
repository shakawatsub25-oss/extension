document.addEventListener('DOMContentLoaded', function() {
  const themeSelector = document.getElementById('theme');
  const body = document.body;

  // Load saved theme from storage and apply it
  chrome.storage.sync.get('theme', function(data) {
    if (data.theme) {
      body.classList.remove('theme-white', 'theme-dark');
      body.classList.add(`theme-${data.theme}`);
      themeSelector.value = data.theme;
    }
  });

  // Event listener for theme change
  themeSelector.addEventListener('change', function() {
    const selectedTheme = themeSelector.value;
    body.classList.remove('theme-white', 'theme-dark');
    body.classList.add(`theme-${selectedTheme}`);

    // Save the selected theme to storage
    chrome.storage.sync.set({theme: selectedTheme});
  });

  // Open AI Chatbot page in a new tab
  const aiChatbotButton = document.getElementById('ai-chatbot');
  aiChatbotButton.addEventListener('click', function() {
    chrome.tabs.create({ url: 'chatbot.html' });
  });

  // Open Vehicles in Queue page in a new tab
  const vehiclesInQueueButton = document.getElementById('vehicles-in-queue');
  vehiclesInQueueButton.addEventListener('click', function() {
    chrome.tabs.create({ url: 'queue.html' });
  });

  const verifyButton = document.getElementById('verify');
  verifyButton.addEventListener('click', function() {
    alert('Verification functionality will be implemented later.');
  });

  // AI Rewrite functionality
  const rewriteButton = document.getElementById('rewrite-button');
  const originalDescription = document.getElementById('original-description');
  const aiInstructions = document.getElementById('ai-instructions');
  const aiWrittenDescription = document.getElementById('ai-written-description');

  rewriteButton.addEventListener('click', function() {
    const text = originalDescription.value;
    const instructions = aiInstructions.value;

    chrome.runtime.sendMessage(
      { action: 'rewrite', text: text, instructions: instructions },
      function(response) {
        if (chrome.runtime.lastError) {
          aiWrittenDescription.value = 'Error: Could not connect to the background script.';
          return;
        }
        if (response && response.rewrittenText) {
          aiWrittenDescription.value = response.rewrittenText;
        }
      }
    );
  });

  // Scrape data functionality
  const scrapeButton = document.getElementById('scrape-button');
  scrapeButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      // Ensure there is an active tab
      if (!tabs[0]) {
        originalDescription.value = 'Error: No active tab found.';
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, { action: 'scrape' }, function(response) {
        // Check for connection errors
        if (chrome.runtime.lastError) {
          originalDescription.value = 'Could not scrape data. Please ensure you are on a vehicle page on eddyseverything.com and refresh the page.';
          return;
        }

        // Check if the response is valid
        if (response && response.description) {
          originalDescription.value = response.description;
        } else {
          originalDescription.value = 'Failed to scrape data. The content script might not have found the required elements.';
        }
      });
    });
  });

});
