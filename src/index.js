require('./config');

const deepmerge = require('deepmerge');
const Scraper = require('./scraper');
const manageInventories = require('./inventory');
const exportAs = require('./export');

class PizzadoorStocksManager {
  constructor(config, credentials) {

    if (config) {
      this.setConfig(config)
    }

    if (credentials) {
      this.setCredentials(credentials);
    }

    this.scraper = new Scraper(this.credentials.adial);
    this.atms = [];

    this.config = _shared.config;
  }

  async fetchAndManage() {
    await this.fetchAtmsData();
    this.manageInventories();

    return this.getAtmsData();
  }

  getAtmsData() {
    return this.atms;
  }

  async fetchAtmsData() {
    await this.scraper.init();
    await this.scraper.run();
    this.atms = this.scraper.getAtms();
    await this.scraper.close();

    return this.getAtmsData();
  }

  manageInventories() {
    return manageInventories(this.atms);
  }

  async exportAsExcel() {
    return exportAs.excel(this.atms);
  }

  async exportAsMail(
    attachmentContent,
    mailSender = this.config.exports.mailSender,
    mailReceiver = this.config.exports.mailReceiver
  ) {
    await exportAs.mail(
      this.credentials.sendgrid,
      mailSender,
      mailReceiver,
      attachmentContent
    );
  }

  setConfig(config) {
    if (config) {
      _shared.config = deepmerge(_shared.config, config);
    }
  }

  setCredentials(credentials) {
    if (!credentials) {
      this.credentials = {
        adial: null,
        sendgrid: null
      };
      return;
    };

    this.credentials = deepmerge(this.credentials, credentials);
  }
}

module.exports = PizzadoorStocksManager;
