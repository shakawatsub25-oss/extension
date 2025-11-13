// background.js
// This script acts as the central coordinator for the extension.

let vehicleDataStore = null;
let aiInstructions = null;
let useAiDescription = false;

// Listen for messages from the popup script.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startScraping") {
        aiInstructions = request.aiInstructions;
        useAiDescription = request.useAiDescription;

        // Open a new tab with the target website.
        chrome.tabs.create({ url: "https://www.eddyseverything.com/" }, (tab) => {
            // Wait for the tab to be completely loaded before injecting the script.
            const listener = (tabId, changeInfo, updatedTab) => {
                if (tabId === tab.id && changeInfo.status === 'complete') {
                    // Inject the scraper script.
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['scraper.js']
                    });
                    // Important: Remove the listener to avoid memory leaks.
                    chrome.tabs.onUpdated.removeListener(listener);
                }
            };
            chrome.tabs.onUpdated.addListener(listener);
        });
    }

    // Listen for messages from the scraper script.
    if (request.action === "scrapedData") {
        vehicleDataStore = request.data;

        // If AI description is requested, process it.
        if (useAiDescription) {
            // --- AI Rewriting Placeholder ---
            vehicleDataStore.description = `(AI Instructions: ${aiInstructions}) \n\n${vehicleDataStore.description}`;
        }

        // Open Facebook Marketplace in a new tab.
        chrome.tabs.create({ url: "https://www.facebook.com/marketplace/create/vehicle" }, (tab) => {
            // Wait for the tab to be completely loaded.
            const listener = (tabId, changeInfo, updatedTab) => {
                if (tabId === tab.id && changeInfo.status === 'complete') {
                    // Inject the poster script.
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['facebook_poster.js']
                    }, () => {
                        // After injecting, send the data to the content script.
                        // A small delay helps ensure the content script's listener is ready.
                        setTimeout(() => {
                            chrome.tabs.sendMessage(tab.id, {
                                action: "fillForm",
                                data: vehicleDataStore
                            });
                        }, 500);
                    });
                    // Important: Remove the listener.
                    chrome.tabs.onUpdated.removeListener(listener);
                }
            };
            chrome.tabs.onUpdated.addListener(listener);
        });
    }

    // Handle errors from the scraper.
    if (request.action === "scrapingError") {
        console.error("Scraping Error:", request.error);
    }

    // Handle errors from the poster.
    if (request.action === "formFillError") {
        console.error("Form Fill Error:", request.error);
    }

    // Confirmation that the form has been filled.
    if (request.action === "formFilled") {
        console.log("Facebook Marketplace form has been filled.");
    }
});
