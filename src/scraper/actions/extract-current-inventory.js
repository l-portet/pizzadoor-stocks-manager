const moment = require('moment');

async function extractCurrentInventory(
  http,
  baseUrl,
  atmCookie,
  limitTimeHours
) {
  let inventory = [];
  let res;
  let date = moment().format('ddd, DD MMM YYYY kk:mm:ss');
  const url = baseUrl + '/admin/';
  const config = {
    headers: {
      Cookie: atmCookie
    },
    params: {
      page: 'magasin',
      controller: 'ajx',
      do: 'get',
      type: 'magasin_status',
      date
    }
  };

  try {
    res = await http.get(url, config);
  } catch (e) {
    res = { data: {} };
  }

  if (!Array.isArray(res.data.magasin_status)) {
    return [];
  }

  inventory = res.data.magasin_status.map(pizzaSlot => ({
    name: pizzaSlot.nom_pizza,
    expirationDate: pizzaSlot.date_peremption,
    filled: !!pizzaSlot.date_peremption
  }));
  inventory = removeShortLifetimeItems(inventory, limitTimeHours);

  return getStocks(inventory);
}
/*
async function extractCurrentInventory($, url, limitTimeHours) {
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

  items = removeShortLifetimeItems(items, limitTimeHours);

  return getStocks(items);
}

function getInventoryUrl(url) {
  url = url.split('?');
  return url[0] + '?page=magasin';
}
*/

function removeShortLifetimeItems(items, limitTimeHours) {
  return items.map(item => {
    let filled = true;

    if (expiresBeforeLimitTime(item.expirationDate, limitTimeHours))
      filled = false;
    return { ...item, filled };
  });
}

function expiresBeforeLimitTime(expirationDate, limitTimeHours) {
  let date = moment(expirationDate, 'DD/MM/YYYY HH:mm:ss');
  let nowPlusLimitTime = moment();

  nowPlusLimitTime.add(limitTimeHours, 'h');

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
