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
            // After the tab is created, inject the scraper script.
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['scraper.js']
            });
        });
    }

    // Listen for messages from the scraper script.
    if (request.action === "scrapedData") {
        vehicleDataStore = request.data;

        // If AI description is requested, process it.
        if (useAiDescription) {
            // --- AI Rewriting Placeholder ---
            // In a real scenario, you would call an AI API here.
            // For now, we'll just prepend the user's instructions to the description.
            vehicleDataStore.description = `(AI Instructions: ${aiInstructions}) \n\n${vehicleDataStore.description}`;
        }

        // Open Facebook Marketplace in a new tab to post the listing.
        chrome.tabs.create({ url: "https://www.facebook.com/marketplace/create/vehicle" }, (tab) => {
            // After the tab is created, inject the poster script.
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['facebook_poster.js']
            }, () => {
                // After injecting, send the data to the poster script.
                chrome.tabs.sendMessage(tab.id, {
                    action: "fillForm",
                    data: vehicleDataStore
                });
            });
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
