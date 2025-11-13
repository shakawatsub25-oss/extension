// This script will run on Facebook Marketplace to auto-fill the listing form.

// Listen for a message from the background script containing the vehicle data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillFacebookForm') {
    console.log('Received data to fill Facebook form:', request.data);

    // This is a simplified example. The actual selectors on Facebook Marketplace
    // are complex and may change. They would need to be carefully identified.
    const selectors = {
      title: 'input[aria-label="Title"]',
      price: 'input[aria-label="Price"]',
      description: 'textarea[aria-label="Description"]',
      // ... other selectors for category, photos, etc.
    };

    try {
      // Helper function to set value and dispatch events to simulate user input
      const fillInput = (selector, value) => {
        const element = document.querySelector(selector);
        if (element && value) {
          element.value = value;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          console.warn(`Could not find element for selector: ${selector}`);
        }
      };

      fillInput(selectors.title, request.data.title);
      fillInput(selectors.price, request.data.price);
      fillInput(selectors.description, request.data.rewrittenDescription);

      // Photo upload is more complex and would require handling the file input element.
      // This part is left as a placeholder.
      console.log('Form filling complete (simulated).');

      sendResponse({ success: true });

    } catch (error) {
      console.error('Error auto-filling Facebook form:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  return true;
});
