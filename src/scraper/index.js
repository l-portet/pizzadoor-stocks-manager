const fs = require('fs');
const deepmerge = require('deepmerge');
const axios = require('axios');
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
    this.http = null;

    this.setConfig(config);
    this.setCredentials(credentials);

    this.initHttpClient();

    return this;
  }

  initHttpClient() {
    this.http = axios.create({
      timeout: 60000
    });
  }

  async run() {
    let dashboardConfig = await actions.login(
      this.http,
      this.credentials.username,
      this.credentials.password
    );
    let proms = [];

    this.atms = await actions.getAtmsInfos(this.http, dashboardConfig);

    for (let [index, { name, link }] of this.atms.entries()) {
      proms.push(this.fetchAtm(name, link, dashboardConfig, index));
    }

    await Promise.all(proms);

    // Normalize data
    this.atms = normalize(this.atms, this.config);

    return this;
  }

  async fetchAtm(name, link, dashboardConfig, index) {
    return new Promise(async (resolve, reject) => {
      let { url, baseUrl } = await actions.getAtmDirectUrl(
        this.http,
        link,
        dashboardConfig.cookies
      );
      let {
        cookies: atmCookies,
        baseUrl: altBaseUrl
      } = await actions.getAtmCookie(this.http, url, dashboardConfig.cookies);

      if (altBaseUrl) {
        baseUrl = altBaseUrl;
      }
      if (!url || !atmCookies) {
        this.atms[index] = { name, inventory: [] };
        return resolve();
      }

      let inventory = await actions.extractCurrentInventory(
        this.http,
        baseUrl,
        atmCookies,
        this.config.limitTimeHours
      );

      this.atms[index] = { name, inventory };
      resolve();
    });
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
