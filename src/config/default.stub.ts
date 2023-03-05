import type { Config } from '../types';

const defaults : Config = {
  scraper: {
    headless: true,
  },
  pizzaTypes: {},
  atms: {},
  exports: {
    mailSender:'',
    mailReceiver: ''
  },
  limitTimeHours: 7,
};
export default defaults;
