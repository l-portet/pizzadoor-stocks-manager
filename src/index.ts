import merge from './utils/merge';
import defaultConfig from './config';
import type { Config, Credentials, Atm } from './types';
import Scraper from './scraper'; 
import { manageInventories } from './inventory';
import * as exportAs from './export';

export type { Config, Credentials, Atm };

export default class PizzadoorStocksManager {
  protected config: Config;
  protected credentials: Credentials;
  protected atms: Atm[];
  protected scraper: Scraper;

  constructor(config: Partial<Config>, credentials: Partial<Credentials>) {
    this.config = defaultConfig;
    this.credentials = { adial: null, sendgrid: null };

    if (config) {
      this.setConfig(config);
    }

    if (credentials) {
      this.setCredentials(credentials);
    }

    this.scraper = new Scraper(this.credentials.adial, this.config);
    this.atms = [];
  }

  async ping(): Promise<boolean> {
    try {
      await this.scraper.fetchAtmInfos();
    } catch(error) {
      return false;
    }
    return true;
  }

  async fetchPizzaNames(): Promise<string[]> {
    const atmsData = await this.fetchAtmsData();

    const pizzaNames = atmsData.reduce<string[]>((acc: string[], atm) => {
      const names = atm.inventory.map(pizza => pizza.name);
      return [...acc, ...names];
    }, []);

    return [...new Set(pizzaNames)];
  }

  async fetchAndManage(): Promise<Atm[]> {
    await this.fetchAtmsData();
    this.manageInventories();

    return this.getAtmsData();
  }

  getAtmsData(): Atm[] {
    return this.atms;
  }

  async fetchAtmNames(): Promise<string[]> {
    const { atms: atmsInfos } = await this.scraper.fetchAtmInfos();

    return atmsInfos.map(({ name }: {name: string}) => name)
  }

  async fetchAtmsData(): Promise<Atm[]> {
    await this.scraper.run();
    this.atms = this.scraper.getAtms();

    return this.getAtmsData();
  }

  manageInventories(): Atm[] {
    return manageInventories(this.atms, this.config);
  }

  async exportAsExcel(): Promise<Buffer> {
    return await (exportAs.excel(this.atms) as Promise<Buffer>);
  }

  async exportAsMail(
    attachmentContent: string,
    mailSender = this.config.exports.mailSender,
    mailReceiver = this.config.exports.mailReceiver
  ): Promise<void> {
    await exportAs.mail(
      this.credentials.sendgrid,
      this.config,
      mailSender,
      mailReceiver,
      attachmentContent
    );
  }

  setConfig(config: Partial<Config>): void {
    if (config) {
      this.config = merge(this.config, config) as Config;
    }

    if (this.scraper) {
      this.scraper.setConfig(this.config);
    }
  }

  setCredentials(credentials: Partial<Credentials>): void {
    if (!credentials) {
      this.credentials = {
        adial: null,
        sendgrid: null,
      };
      return;
    }

    this.credentials = merge(this.credentials, credentials) as Credentials;
  }
}
