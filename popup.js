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

  // Start the scraping process when the "Vehicles in Queue" button is clicked
  const vehiclesInQueueButton = document.getElementById('vehicles-in-queue');
  vehiclesInQueueButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (!tabs[0]) {
        alert('Error: No active tab found.');
        return;
      }

      // Send a message to the content script to get all vehicle links
      chrome.tabs.sendMessage(tabs[0].id, { action: 'scrapeVehicleLinks' }, function(response) {
        if (chrome.runtime.lastError) {
          alert('Could not connect to the page.\n\nPlease ensure you are on a vehicle inventory page on eddyseverything.com and refresh the page before trying again.');
          return;
        }

        if (response && response.vehicleLinks && response.vehicleLinks.length > 0) {
          // Send the links and AI instructions to the background script to start the processing queue
          const aiInstructions = document.getElementById('ai-instructions').value;
          chrome.runtime.sendMessage({
            action: 'startQueue',
            vehicleLinks: response.vehicleLinks,
            aiInstructions: aiInstructions
          });
          alert(`Found ${response.vehicleLinks.length} vehicles. The process will now start in the background. New tabs will be opened to process each vehicle and post to Facebook.`);
        } else {
          alert('No vehicle links could be found on this page. Please navigate to the main inventory or search results page on eddyseverything.com.');
        }
      });
    });
  });

  const verifyButton = document.getElementById('verify');
  verifyButton.addEventListener('click', function() {
    alert('Verification functionality will be implemented later.');
  });
});
