const fs = require('fs');
const deepmerge = require('deepmerge');
const exec = require('child_process').exec;

const setup = require('./setup');
const normalize = require('./normalize');
// browserActions contains all the scraping logic that manipulates the browser
const browserActions = require('./browser-actions');

class Scraper {
  constructor(credentials, config) {
    this.baseURL = 'https://www.mypizzadoor.com/';
    this.atms = [];
    this.context = null;
    this.page = null;
    this.config = {};
    this.credentials = {};

    this.setConfig(config);
    this.setCredentials(credentials);

    return this;
  }

  async init() {
    // First instance created, launch browser
    if (Scraper.prototype.browser === null) {
      Scraper.prototype.browser = { isInitializing: true };
      Scraper.prototype.browser = await setup.browser(this.config);

      this.context = await setup.context(Scraper.prototype.browser);

      // Browser is launching wait for it...
    } else if (Scraper.prototype.browser.isInitializing) {
      return new Promise((resolve, reject) => {
        let waitInterval = setInterval(async () => {
          if (!Scraper.prototype.browser.isInitializing) {
            clearInterval(waitInterval);
            this.context = await setup.context(Scraper.prototype.browser);
            resolve(this);
          }
        }, 20);
      });
      // Browser is already launched jusst setup context
    } else {
      this.context = await setup.context(Scraper.prototype.browser);
    }

    return this;
  }

  async run() {
    this.page = await setup.page(this.context);

    await this.page.goto(this.baseURL);
    await browserActions.login(
      this.page,
      this.credentials.username,
      this.credentials.password
    );

    this.atms = await browserActions.getAtmsInfos(this.page);

    for (let [index, { name, link }] of this.atms.entries()) {
      // Cannot stack Promises in async logic since we only use one page
      let url = await browserActions.getDirectUrl(this.page, link);

      if (!url) continue;
      let inventory = await browserActions.extractCurrentInventory(
        this.page,
        url,
        this.config.limitTimeHours
      );

      this.atms[index] = { name, inventory };
    }

    // Normalize data
    this.atms = normalize(this.atms, this.config);

    return this;
  }

  getAtms() {
    return this.atms;
  }

  setCredentials(credentials) {
    if (!credentials) return;

    this.credentials = deepmerge(this.credentials, credentials);
  }

  setConfig(config) {
    if (!config) return;

    this.config = deepmerge(this.config, config);
  }

  async close() {
    await this.context.close();
    this.context = null;
  }

  static async closeBrowser() {
    if (Scraper.prototype.browser) {
      await Scraper.prototype.browser.close();
      Scraper.prototype.browser = null;
    }
  }
}

Scraper.prototype.browser = null;

module.exports = Scraper;
