let vehicleQueue = [];
let isProcessing = false;
let globalAIInstructions = '';

// Listen for the startQueue message from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startQueue') {
    if (isProcessing) {
      console.log('Already processing a queue.');
      return;
    }
    vehicleQueue = request.vehicleLinks;
    globalAIInstructions = request.aiInstructions;
    isProcessing = true;
    processQueue();
  } else if (request.action === 'chat') {
    // Keep the chatbot functionality
    const reply = getChatReply(request.text);
    sendResponse({ reply: reply });
  }
  return true;
});

async function processQueue() {
  if (vehicleQueue.length === 0) {
    console.log('Queue finished.');
    isProcessing = false;
    return;
  }

  const url = vehicleQueue.shift();
  console.log(`Processing: ${url}`);

  // Create a new tab to scrape data
  chrome.tabs.create({ url: url, active: false }, (scrapeTab) => {
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === scrapeTab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);

        chrome.tabs.sendMessage(scrapeTab.id, { action: 'scrapeSingleVehicle' }, (response) => {
          chrome.tabs.remove(scrapeTab.id); // Close the scraping tab

          if (chrome.runtime.lastError || !response) {
            console.error(`Error scraping ${url}: ${chrome.runtime.lastError?.message || 'No response'}`);
            processQueue();
            return;
          }

          const rewrittenDescription = rewriteDescription(response.description, globalAIInstructions);
          const vehicleData = { ...response, rewrittenDescription };

          console.log('Scraped and Rewritten Data:', vehicleData);
          postToFacebook(vehicleData);
        });
      }
    });
  });
}

function postToFacebook(vehicleData) {
  const facebookUrl = 'https://www.facebook.com/marketplace/create/vehicle';

  chrome.tabs.create({ url: facebookUrl, active: true }, (fbTab) => {
    chrome.tabs.onUpdated.addListener(function fbListener(tabId, info) {
      if (tabId === fbTab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(fbListener);

        // Send data to the facebook_poster content script
        chrome.tabs.sendMessage(fbTab.id, { action: 'fillFacebookForm', data: vehicleData }, (response) => {
          if (chrome.runtime.lastError || !response?.success) {
            console.error(`Failed to fill Facebook form: ${chrome.runtime.lastError?.message || 'Response indicated failure'}`);
            // Don't close the tab so the user can see the issue
          } else {
            console.log('Facebook form filled successfully. The user needs to manually submit.');
            // We don't close the tab automatically. The user should verify and submit.
          }

          // Continue with the next item in the queue after a significant delay
          // to give the user time to handle the Facebook post.
          setTimeout(processQueue, 15000); // 15-second delay
        });
      }
    });
  });
}

// Mock AI function to rewrite descriptions
function rewriteDescription(originalText, instructions) {
    let rewrittenText = `(AI REWRITTEN)\n\n${originalText || ''}`;
    if (instructions) {
        rewrittenText += `\n\n--- Special Considerations ---\n`;
        if (instructions.toLowerCase().includes('luxurious')) {
            rewrittenText += `Experience true luxury with this exceptional vehicle. `;
        }
        // ... other instructions
    }
    return rewrittenText;
}

// Mock chatbot logic
function getChatReply(message) {
  const lowerCaseMessage = message.toLowerCase();
  if (lowerCaseMessage.includes('hello')) {
    return 'Hello! How can I help you today?';
  }
  return "Sorry, I don't understand.";
}
