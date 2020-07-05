const deepmerge = require('deepmerge');
const cheerio = require('cheerio');

const setup = require('./setup');
const normalize = require('./normalize');
// actions contains all the scraping logic that manipulates the scraper
const actions = require('./actions');

class Scraper {
  constructor(credentials, config) {
    this.atms = [];
    this.config = {};
    this.credentials = {};

    this.setConfig(config);
    this.setCredentials(credentials);

    return this;
  }

  async run() {
    const proms = [];
    const { atms, cookies: dashboardCookies } = await actions.login(
      this.credentials.username,
      this.credentials.password
    );

    this.atms = atms;

    for (let [index, { name, link }] of this.atms.entries()) {
      proms.push(this.fetchAtm(name, link, dashboardCookies, index));
    }

    await Promise.all(proms);

    // Normalize data
    this.atms = normalize(this.atms, this.config);

    return this;
  }

  async fetchAtm(name, link, dashboardCookies, index) {
    let { baseURL, cookies: atmCookies } = await actions.extractAtmInfos(
      link,
      dashboardCookies
    );
    let inventory = await actions.extractAtmInventory(
      baseURL,
      atmCookies,
      this.config.limitTimeHours
    );

    this.atms[index] = { name, inventory };
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
}

module.exports = Scraper;
