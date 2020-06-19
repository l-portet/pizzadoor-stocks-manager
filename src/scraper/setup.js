const pup = require('puppeteer');

async function setupBrowser(config) {
  const browser = await pup.launch({
    headless: config.scraper.headless,
    args: ['--no-sandbox', '--incognito']
  });

  return browser;
}

async function setupContext(browser) {
  return await browser.createIncognitoBrowserContext();
}

async function setupPage(context) {
  const page = await context.newPage();

  page.on('console', consoleObj => console.log(consoleObj.text()));
  await page.setViewport({ width: 800, height: 650 });
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
  );
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,la;q=0.6'
  });

  return page;
}

module.exports = {
  browser: setupBrowser,
  context: setupContext,
  page: setupPage
};
