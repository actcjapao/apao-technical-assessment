const puppeteer = require('puppeteer');

// async function fetchPageContent(url) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(url);
//   const content = await page.evaluate(() => {
//     return document.body.innerText; // Get the text content from the page
//   });
//   await browser.close();
//   return content;   
// }

async function fetchPageContent(url) {
  let browser;
  try {
    // launch the browser
    browser = await puppeteer.launch();

    // create a new page
    const page = await browser.newPage();

    // go to the URL
    const response = await page.goto(url);

    // check if the page was loaded successfully
    if (!response || !response.ok()) {
      throw new Error(`Failed to load page: ${response ? response.status() : 'No response'}`);
    }

    // ff successful, extract the page content
    const content = await page.evaluate(() => {
      return document.body.innerText; // get the text content from the page
    });

    return {
      status: 'success',
      content,
    };
    
  } catch (error) {
    // if an error occurred, return a failure status
    return {
      status: 'error',
      message: error.message,
    };
  } finally {
    if (browser) {
      // close the browser instance regardless of success or failure
      await browser.close();
    }
  }
}

module.exports = fetchPageContent;
