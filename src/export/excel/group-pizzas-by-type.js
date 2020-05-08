function groupPizzasByType(inventory) {
  let groupedInventory = {};

  for (let pizza of inventory) {
    if (typeof groupedInventory[pizza.type] === 'undefined')
      groupedInventory[pizza.type] = [];
    groupedInventory[pizza.type].push(pizza);
  }

  return groupedInventory;
}

module.exports = groupPizzasByType;
