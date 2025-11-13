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
});
