require('dotenv').config();
const fs = require('fs');
const pup = require('puppeteer');
const CronJob = require('cron').CronJob;

const pizzaTypes = require('../pizza-types.json');

const setup = require('./setup');
const steps = require('./steps');

async function run() {
  const { browser, page } = await setup();
  let infos = [];
  let inventories = [];
  let total = {};
  let fileBuffer;

  global.browser = browser;
  global.page = page;

  await page.goto('https://www.mypizzadoor.com/');
  await steps.login(process.env.ADIAL_USERNAME, process.env.ADIAL_PASSWORD);
  infos = await steps.getAtmInfos();

  for (let info of infos) {
    let url = await steps.getDirectUrl(info.link);
    let inventory = await steps.extractCurrentInventory(url);

    inventories.push({ name: info.name, data: inventory });
    console.log(inventory);
  }
  inventories = steps.uniformInventories(inventories);

  total = steps.mergeInventories(inventories);
  inventories.push(total);
  inventories = steps.setPizzaTypes(inventories, pizzaTypes);
  fileBuffer = await steps.createExcelFile(inventories);

  await steps.sendMail(fileBuffer.toString('base64'));
  fs.writeFileSync('./inventories.json', JSON.stringify(inventories));
}

new CronJob(
  '0 7 * * *',
  async function() {
    console.log(`Cron restarted ${new Date()}`);
    await run();
  },
  null,
  true,
  'Europe/Paris'
);
