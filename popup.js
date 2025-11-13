document.addEventListener('DOMContentLoaded', function() {
    const themeSelect = document.getElementById('theme-select');

    // Load saved theme from storage and apply it
    chrome.storage.sync.get('theme', function(data) {
        if (data.theme === 'dark') {
            document.body.classList.add('dark');
            themeSelect.value = 'dark';
        }
    });

    themeSelect.addEventListener('change', function() {
        if (themeSelect.value === 'dark') {
            document.body.classList.add('dark');
            // Save the theme preference to storage
            chrome.storage.sync.set({theme: 'dark'});
        } else {
            document.body.classList.remove('dark');
            // Save the theme preference to storage
            chrome.storage.sync.set({theme: 'white'});
        }
    });

    // Placeholder for language selection functionality
    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', function() {
        // Language change logic will be implemented here
        console.log('Language changed to:', languageSelect.value);
    });

    // Placeholder for AI Chatbot button functionality
    const aiChatbotBtn = document.getElementById('ai-chatbot-btn');
    aiChatbotBtn.addEventListener('click', function() {
        // AI Chatbot logic will be implemented here
        console.log('AI Chatbot button clicked');
    });

    // Placeholder for other button functionalities
    const helpBtn = document.getElementById('help-btn');
    helpBtn.addEventListener('click', function() {
        console.log('Help button clicked');
    });

    const queueBtn = document.getElementById('queue-btn');
    queueBtn.addEventListener('click', function() {
        const aiInstructions = document.getElementById('ai-instructions').value;
        const useAiDescription = document.getElementById('ai-description').checked;

        // Send a message to the background script to start the scraping process.
        chrome.runtime.sendMessage({
            action: "startScraping",
            aiInstructions: aiInstructions,
            useAiDescription: useAiDescription
        });
    });

    const verifyBtn = document.getElementById('verify-btn');
    verifyBtn.addEventListener('click', function() {
        console.log('Verify button clicked');
    });
});
