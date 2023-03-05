// @ts-nocheck

import merge from '../utils/merge';
import cheerio from 'cheerio';
import normalize from './normalize';
import * as actions from './actions';

export default class Scraper {
  constructor(credentials, config) {
    this.atms = [];
    this.config = {};
    this.credentials = {};

    this.setConfig(config);
    this.setCredentials(credentials);

    return this;
  }

  async run() {
    const TIMEOUT_MS = 10 * 1000;
    const proms = [];
    const { atms, cookies: dashboardCookies } = await this.fetchAtmInfos();

    this.atms = atms;

    for (let [index, { name, link }] of this.atms.entries()) {
      proms.push(
        new Promise(resolve => {
          const onTimeout = () => {
            console.error(`Error: Request timed out for ${name} (${link})`);
            // Silently skip, results will be empty
            resolve();
          };
          const timeout = setTimeout(onTimeout, TIMEOUT_MS);

          this.fetchAtm(name, link, dashboardCookies, index).then(() => {
            clearTimeout(timeout);
            resolve();
          });
        })
      );
    }

    await Promise.all(proms);

    // Normalize data
    this.atms = normalize(this.atms, this.config);

    return this;
  }

  async fetchAtmInfos() {
    return await actions.login(
      this.credentials.username,
      this.credentials.password
    );
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

    this.credentials = merge(this.credentials, credentials);
  }

  setConfig(config) {
    if (!config) return;

    this.config = merge(this.config, config);
  }
}
