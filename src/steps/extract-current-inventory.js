const moment = require('moment');

async function extractCurrentInventory(url) {
  url = getInventoryUrl(url);
  await page.goto(url);
  let items = await page.$$eval('#magasin tr', rows => {
    // Remove header rows
    rows.splice(36, 1);
    rows.splice(0, 1);

    return rows.map(row => {
      let result = {};

      result.name = row.cells[1].innerText;
      result.expirationDate = row.cells[2].innerText;

      return result;
    });
  });

  items = removeLongLifetimeItems(items);

  return formatItems(items);
}

function getInventoryUrl(url) {
  url = url.split('?');
  return url[0] + '?page=magasin';
}

function removeLongLifetimeItems(items) {
  return items.filter(item => {
    if (item.expirationDate === '') return true;
    if (expiresBeforeLimitTime(item.expirationDate)) return true;
    return false;
  });
}

function expiresBeforeLimitTime(expirationDate) {
  let date = moment(expirationDate, 'DD/MM/YYYY HH:mm:ss');
  let nowPlusLimitTime = moment();

  nowPlusLimitTime.add(7, 'h');

  if (date.isBefore(nowPlusLimitTime)) return true;
  return false;
}

function formatItems(items) {
  let results = {};

  for (let item of items) {
    if (!results[item.name]) results[item.name] = 0;
    results[item.name]++;
  }
  console.log(results)
  return results;
}

module.exports = extractCurrentInventory;
