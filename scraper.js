// scraper.js
// This script is designed to be injected into a vehicle detail page on a dealership website.
// It scrapes the vehicle's title, price, image URL, and description.

try {
    // --- Data Scraping Logic ---
    // NOTE: These selectors are GENERIC and may need to be adjusted for the specific website.
    // They are based on common HTML structures found on car dealership websites.

    // Scrape the vehicle title. Look for an h1 or h2 tag that likely contains the year, make, and model.
    const titleElement = document.querySelector('h1') || document.querySelector('h2');
    const title = titleElement ? titleElement.innerText : 'Title not found';

    // Scrape the price. Look for elements with class names related to 'price'.
    const priceElement = document.querySelector('.price') || document.querySelector('[class*="price"]');
    const price = priceElement ? priceElement.innerText : 'Price not found';

    // Scrape the main vehicle image. Look for an image within a container that might be a gallery.
    const imageElement = document.querySelector('.gallery img') || document.querySelector('img');
    const imageUrl = imageElement ? imageElement.src : 'Image not found';

    // Scrape the description. Look for a div with an ID or class related to 'description'.
    const descriptionElement = document.querySelector('#description') || document.querySelector('.description');
    const description = descriptionElement ? descriptionElement.innerText : 'Description not found';


    // --- Send Data to Background Script ---
    // Package the scraped data into an object.
    const vehicleData = {
        title,
        price,
        imageUrl,
        description
    };

    // Send the data to the background script.
    chrome.runtime.sendMessage({
        action: "scrapedData",
        data: vehicleData
    });

} catch (error) {
    // If any error occurs, send an error message to the background script.
    chrome.runtime.sendMessage({
        action: "scrapingError",
        error: error.message
    });
}
