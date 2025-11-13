// facebook_poster.js
// This script is injected into the Facebook Marketplace 'create new listing' page.
// It programmatically fills in the form fields with the vehicle data.

// This function will be called by the background script to start the posting process.
function fillMarketplaceForm(vehicleData) {
    try {
        // --- Form Filling Logic ---
        // NOTE: These selectors are GENERIC and may need to be adjusted if Facebook changes its Marketplace UI.

        // Title
        const titleInput = document.querySelector('input[aria-label="Title"]');
        if (titleInput) titleInput.value = vehicleData.title;

        // Price
        const priceInput = document.querySelector('input[aria-label="Price"]');
        if (priceInput) priceInput.value = vehicleData.price;

        // Description
        const descriptionInput = document.querySelector('textarea[aria-label="Description"]');
        if (descriptionInput) descriptionInput.value = vehicleData.description;

        // For the image, we can't programmatically set the value of a file input.
        // This part will require the user to manually select the image.
        // We can, however, alert the user to do so.
        alert('Please manually upload the vehicle image.');


        // --- Confirmation ---
        // Let the background script know that the form has been filled.
        chrome.runtime.sendMessage({ action: "formFilled" });

    } catch (error) {
        // Report any errors to the background script.
        chrome.runtime.sendMessage({ action: "formFillError", error: error.message });
    }
}

// Listen for a message from the background script to start filling the form.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillForm") {
        fillMarketplaceForm(request.data);
    }
});
