function manageInventories(atms) {
  atms = atms.map(getPizzasToCraft);
  return atms;
}

function getPizzasToCraft(atm) {
  let { fillPercentage } = _shared.config.atms[atm.name] || 100;

  atm.inventory = atm.inventory.map(pizza => {
    return {
      ...pizza,
      ...getPizzasToCraftInStocks(pizza.stocks, fillPercentage)
    };
  });

  return atm;
}

function getPizzasToCraftInStocks(stocks, fillPercentage) {
  stocks.toCraft = 0;
  fillPercentage /= 100;

  let neededStocks = Math.ceil(stocks.total * fillPercentage);

  for (let i = neededStocks; i > stocks.filled; i--) stocks.toCraft++;

  return { stocks };
}

module.exports = manageInventories;
