// Listen for a message from popup.js to start scraping
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrape') {
    // Find the vehicle title from the h1 tag
    const title = document.querySelector('h1')?.innerText;

    // Find the vehicle description
    const description = document.querySelector('.vehicle-description')?.innerText;

    // Send the scraped data back to the popup
    sendResponse({
      title: title || 'Title not found',
      description: description || 'Description not found'
    });
  }
  // Keep the message channel open for the asynchronous response
  return true;
});
