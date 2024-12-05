const puppeteer = require('puppeteer');

async function fetchPageContent(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const content = await page.evaluate(() => {
    return document.body.innerText; // Get the text content from the page
  });
  await browser.close();
  return content;   
}

module.exports = fetchPageContent;
