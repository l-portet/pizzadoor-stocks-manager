const fs = require('fs');

const setup = require('./setup');
const normalize = require('./normalize');
// browserActions contains all the scraping logic that manipulates the browser
const browserActions = require('./browser-actions');

class Scraper {
  constructor() {
    this.atms = [];
    this.baseURL = 'https://www.mypizzadoor.com/';

    if (typeof global._shared === 'undefined') {
      global._shared = {};
    }

    return this;
  }

  async init() {
    const { browser, page } = await setup();

    global._shared.browser = browser;
    global._shared.page = page;

    return this;
  }

  async run() {
    await _shared.page.goto(this.baseURL);
    await browserActions.login(
      process.env.ADIAL_USERNAME,
      process.env.ADIAL_PASSWORD
    );

    this.atms = await browserActions.getAtmsInfos();

    for (let [index, { name, link }] of this.atms.entries()) {
      // Cannot stack Promises in async logic since we only use one page
      let url = await browserActions.getDirectUrl(link);
      let inventory = await browserActions.extractCurrentInventory(url);

      this.atms[index] = { name, inventory };
    }

    // Normalize data
    this.atms = normalize(this.atms);

    return this;
  }

  getAtms() {
    return this.atms;
  }

  async close() {
    await _shared.browser.close();
    return this;
  }
}

module.exports = Scraper;
