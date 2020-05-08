require('dotenv').config();
require('./config');

const deepmerge = require('deepmerge');
const Scraper = require('./scraper');
const manageInventories = require('./inventory');
const exportAs = require('./export');

class PizzadoorStocksManager {
  constructor(config) {
    this.scraper = new Scraper();
    this.atms = [];

    if (config) {
      _shared.config = deepmerge(_shared.config, config);
    }

    this.config = _shared.config;
  }

  getAtmsData() {
    return this.atms;
  }

  async fetchAtmsData() {
    await this.scraper.init();
    await this.scraper.run();
    this.atms = this.scraper.getAtms();
    await this.scraper.close();

    return this;
  }

  manageInventories() {
    return manageInventories(this.atms);
  }

  async exportAsExcel() {
    return exportAs.excel(this.atms);
  }

  async exportAsMail(
    attachmentContent,
    mailReceiver = this.config.exports.mailReceiver
  ) {
    await exportAs.mail(
      process.env.SENDGRID_APIKEY,
      this.config.exports.mailReceiver,
      attachmentContent
    );
  }
}

module.exports = PizzadoorStocksManager;
