document.addEventListener('DOMContentLoaded', function() {
  const scrapeAllButton = document.getElementById('scrape-all-button');

  scrapeAllButton.addEventListener('click', function() {
    alert('Scraping all posts functionality will be implemented in a future version.');
    // In the future, this will send a message to the content script to scrape all vehicle links
    // and then process each one.
  });
});
