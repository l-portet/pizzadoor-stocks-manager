// @ts-nocheck
import axios from 'axios';
import moment from 'moment';

const CancelToken = axios.CancelToken;

export default async function extractAtmInventory(
  baseUrl,
  atmCookies,
  limitTimeHours
) {
  const source = CancelToken.source();
  let inventory = [];
  let res;
  let date = moment().format('ddd, DD MMM YYYY kk:mm:ss');
  const url = baseUrl + '/admin/';
  const config = {
    cancelToken: source.token,
    timeout: 15000,
    headers: {
      Cookie: atmCookies,
      connection: 'keep-alive',
    },
    params: {
      page: 'magasin',
      controller: 'ajx',
      do: 'get',
      type: 'magasin_status',
      date,
    },
  };

  try {
    setTimeout(source.cancel, 15000);
    res = await axios.get(url, config);
  } catch (e) {
    res = { data: {} };
  }

  if (!Array.isArray(res.data.magasin_status)) {
    return [];
  }

  inventory = res.data.magasin_status.map(pizzaSlot => ({
    name: pizzaSlot.nom_pizza,
    expirationDate: pizzaSlot.date_peremption,
    filled: !!pizzaSlot.date_peremption,
  }));
  inventory = removeShortLifetimeItems(inventory, limitTimeHours);

  return getStocks(inventory);
}

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
        total: 0,
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