const moment = require('moment');

async function extractCurrentInventory(url) {
  const { page } = _shared;

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
      result.filled = !!result.expirationDate;

      return result;
    });
  });

  items = removeShortLifetimeItems(items);

  return getStocks(items);
}

function getInventoryUrl(url) {
  url = url.split('?');
  return url[0] + '?page=magasin';
}

function removeShortLifetimeItems(items) {
  return items.map(item => {
    let filled = true;

    if (expiresBeforeLimitTime(item.expirationDate)) filled = false;
    return { ...item, filled };
  });
}

function expiresBeforeLimitTime(expirationDate) {
  let date = moment(expirationDate, 'DD/MM/YYYY HH:mm:ss');
  let nowPlusLimitTime = moment();

  nowPlusLimitTime.add(7, 'h');

  if (date.isBefore(nowPlusLimitTime) || !expirationDate.length) return true;
  return false;
}

function getStocks(items) {
  let stocks = {};

  for (let item of items) {
    if (typeof stocks[item.name] === 'undefined') {
      stocks[item.name] = {
        filled: 0,
        total: 0
      };
    }
    let stock = stocks[item.name];

    stock.filled += item.filled ? 1 : 0;
    stock.total++;
  }
  stocks = setEmptyStocks(stocks);

  return stocks;
}

function setEmptyStocks(stocks) {
  for (let prop in stocks) {
    let stock = stocks[prop];

    stock.empty = stock.total - stock.filled;
  }
  return stocks;
}

module.exports = extractCurrentInventory;
