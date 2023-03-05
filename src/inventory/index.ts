// @ts-nocheck
export function manageInventories(atms, config) {
  atms = atms.map(atm => getPizzasToCraft(atm, config));
  return atms;
}

function getPizzasToCraft(atm, config) {
  let atmConfig = config.atms[atm.name] || { fillPercentage: undefined };
  let { fillPercentage } = atmConfig;

  if (typeof fillPercentage === 'undefined') {
    fillPercentage = 100;
  }

  atm.inventory = atm.inventory.map((pizza: any) => {
    return {
      ...pizza,
      ...getPizzasToCraftInStocks(pizza.stocks, fillPercentage),
    };
  });

  return atm;
}

function getPizzasToCraftInStocks(stocks, fillPercentage) {
  if (!stocks) stocks = {};
  stocks.toCraft = 0;
  fillPercentage /= 100;

  let neededStocks = Math.ceil(stocks.total * fillPercentage);

  for (let i = neededStocks; i > stocks.filled; i--) stocks.toCraft++;

  return { stocks };
}
