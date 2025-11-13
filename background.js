// Mock AI function to rewrite descriptions
function rewriteDescription(originalText, instructions) {
  let rewrittenText = `(AI Rewritten) ${originalText}`;
  if (instructions) {
    rewrittenText += `\n\n--- Instructions Applied ---\n${instructions}`;
  }
  return rewrittenText;
}

// Mock chatbot logic
function getChatReply(message) {
  const lowerCaseMessage = message.toLowerCase();
  if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
    return 'Hello! How can I help you today?';
  }
  if (lowerCaseMessage.includes('help')) {
    return 'I can help you with vehicle listings. What do you need assistance with?';
  }
  if (lowerCaseMessage.includes('price')) {
    return 'I can help you find the price of a vehicle. Please provide the make and model.';
  }
  return "Sorry, I don't understand. Can you please rephrase?";
}

// Listen for messages from popup.js and chatbot.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'rewrite') {
    const rewritten = rewriteDescription(request.text, request.instructions);
    sendResponse({ rewrittenText: rewritten });
  } else if (request.action === 'chat') {
    const reply = getChatReply(request.text);
    sendResponse({ reply: reply });
  }
});
