// @ts-nocheck
export default function addTotalAtms(atms) {
  let total = {
    name: 'total',
    inventory: [],
  };
  for (let { inventory } of atms) {
    for (let pizza of inventory) {
      let pizzaIndexInTotal = getPizzaIndexInTotal(total, pizza.name);

      if (pizzaIndexInTotal === -1) {
        let newPizza = {
          name: pizza.name,
          stocks: {
            ...pizza.stocks,
          },
          type: pizza.type,
        };
        total.inventory.push(newPizza);
      } else {
        let pizzaInTotal = total.inventory[pizzaIndexInTotal];

        for (let prop in pizzaInTotal.stocks) {
          pizzaInTotal.stocks[prop] += pizza.stocks[prop] || 0;
        }
        // pizzaInTotal.stocks.toCraft += pizza.stocks.toCraft;
      }
    }
  }
  atms.push(total);
  return atms;
}

function getPizzaIndexInTotal(total, pizzaName) {
  return total.inventory.findIndex(pizza => pizza.name === pizzaName);
}
