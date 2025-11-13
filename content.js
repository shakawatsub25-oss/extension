// Listen for messages from popup.js or other scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Scrape a single vehicle's details
  if (request.action === 'scrapeSingleVehicle') {
    const title = document.querySelector('h1')?.innerText;
    const description = document.querySelector('.vehicle-description')?.innerText;
    const price = document.querySelector('.final-price')?.innerText;
    // This selector might need adjustment based on the actual image element
    const imageUrls = Array.from(document.querySelectorAll('.vehicle-gallery img')).map(img => img.src);

    sendResponse({
      title: title,
      description: description,
      price: price,
      imageUrls: imageUrls
    });
  }

  // Scrape all vehicle links from a listing page
  if (request.action === 'scrapeVehicleLinks') {
    // This selector needs to be very specific to the links pointing to vehicle detail pages
    const linkElements = document.querySelectorAll('.vehicle-card a.vehicle-title');
    const links = Array.from(linkElements).map(a => a.href);

    // Send the unique links back
    sendResponse({ vehicleLinks: [...new Set(links)] }); // Use Set to remove duplicates
  }

  return true; // Keep message channel open for async response
});
