document.addEventListener('DOMContentLoaded', function() {
  const chatHistory = document.getElementById('chat-history');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');

  sendButton.addEventListener('click', sendMessage);
  userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });

  function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user-message');
    userInput.value = '';

    // Send message to the background script for a reply
    chrome.runtime.sendMessage({ action: 'chat', text: message }, function(response) {
      if (response && response.reply) {
        appendMessage(response.reply, 'bot-message');
      }
    });
  }

  function appendMessage(text, className) {
    const messageElement = document.createElement('div');
    messageElement.textContent = text;
    messageElement.className = className;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll to the bottom
  }
});
