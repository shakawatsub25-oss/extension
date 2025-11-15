// Listen for messages from popup.js or other scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Scrape a single vehicle's details
  if (request.action === 'scrapeSingleVehicle') {
    // These selectors are guesses and might need to be refined
    const title = document.querySelector('h1.vehicle-title, .vehicle-name h1')?.innerText;
    const description = document.querySelector('.vehicle-description, #vehicle-details')?.innerText;
    const price = document.querySelector('.final-price, .price-value, .sale-price')?.innerText;
    const imageUrls = Array.from(document.querySelectorAll('.vehicle-gallery img, .carousel-inner img')).map(img => img.src);

    console.log('Scraped Data:', { title, description, price, imageUrls });

    sendResponse({
      title: title || 'Title not found',
      description: description || 'Description not found',
      price: price || 'Price not found',
      imageUrls: imageUrls
    });
  }

  // Scrape all vehicle links from a listing page
  if (request.action === 'scrapeVehicleLinks') {
    console.log('Attempting to scrape vehicle links...');

    // A more robust approach: find all links and filter them by a pattern
    const allLinks = Array.from(document.querySelectorAll('a'));
    const vehicleKeywords = ['/vehicle/', '/inventory/detail/', '/used/', '/new/'];

    const vehicleLinks = allLinks
      .map(a => a.href)
      .filter(href => vehicleKeywords.some(keyword => href.includes(keyword)));

    if (vehicleLinks.length > 0) {
      console.log(`Found ${vehicleLinks.length} potential vehicle links.`);
      // Return unique links
      sendResponse({ vehicleLinks: [...new Set(vehicleLinks)] });
    } else {
      console.warn('No links matching vehicle patterns were found.');
      sendResponse({ vehicleLinks: [] });
    }
  }

  return true; // Keep message channel open for async response
});
