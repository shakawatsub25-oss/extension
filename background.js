// Mock chatbot logic for eddyseverything.com
function getChatReply(message) {
  const lowerCaseMessage = message.toLowerCase();

  if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
    return "Hello! Welcome to Eddy's Everything. How can I assist you today?";
  }
  if (lowerCaseMessage.includes('about')) {
    return "Eddy's Everything is a premier dealership for high-quality used vehicles. We pride ourselves on customer satisfaction.";
  }
  if (lowerCaseMessage.includes('contact') || lowerCaseMessage.includes('phone') || lowerCaseMessage.includes('address')) {
    return "You can contact us at (123) 456-7890 or visit us at 123 Main St, Anytown, USA.";
  }
  if (lowerCaseMessage.includes('hours')) {
    return "Our business hours are Monday to Friday, 9 AM to 6 PM, and Saturday, 10 AM to 4 PM.";
  }
  if (lowerCaseMessage.includes('inventory') || lowerCaseMessage.includes('cars')) {
    return "We have a wide range of vehicles. You can browse our full inventory on our website.";
  }

  return "I'm sorry, I can't answer that. For more information, please visit our website or contact us directly.";
}

// Listen for messages from chatbot.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'chat') {
    const reply = getChatReply(request.text);
    sendResponse({ reply: reply });
  }
  return true; // Keep the message channel open for async response
});
