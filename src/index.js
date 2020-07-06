require('./config');

const deepmerge = require('deepmerge');
const Scraper = require('./scraper');
const manageInventories = require('./inventory');
const exportAs = require('./export');

class PizzadoorStocksManager {
  constructor(config, credentials) {
    if (config) {
      this.setConfig(config);
    }

    if (credentials) {
      this.setCredentials(credentials);
    }

    this.scraper = new Scraper(this.credentials.adial, this.config);
    this.atms = [];
  }

  async fetchAndManage() {
    await this.fetchAtmsData();
    this.manageInventories();

    return this.getAtmsData();
  }

  getAtmsData() {
    return this.atms;
  }

  async fetchAtmsNames() {
    const { atms: atmsInfos } = await this.scraper.fetchAtmsInfos();

    return atmsInfos.map(({ name }) => name);
  }

  async fetchAtmsData() {
    await this.scraper.run();
    this.atms = this.scraper.getAtms();

    return this.getAtmsData();
  }

  manageInventories() {
    return manageInventories(this.atms, this.config);
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
      this.config,
      mailSender,
      mailReceiver,
      attachmentContent
    );
  }

  setConfig(config) {
    if (config) {
      this.config = deepmerge(this.config, config);
    }
  }

  setCredentials(credentials) {
    if (!credentials) {
      this.credentials = {
        adial: null,
        sendgrid: null
      };
      return;
    }

    this.credentials = deepmerge(this.credentials, credentials);
  }
}

module.exports = PizzadoorStocksManager;
