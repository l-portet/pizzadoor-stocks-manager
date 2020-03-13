function setPizzaTypes(inventories, pizzaTypes) {
  for (let inventory of inventories) {
    let data = [];
    for (let prop in inventory.data) {
      data.push(findPizzaType(pizzaTypes, prop, inventory.data[prop]));
    }
    inventory.data = sortByPizzaName(data);
    inventory.data = groupByPizzaType(inventory.data)
  }
  return inventories;
}

function findPizzaType(pizzaTypes, name, value) {
  let normalizedName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  normalizedName = normalizedName.toLowerCase();

  for (let prop in pizzaTypes) {
    if (pizzaTypes[prop].includes(normalizedName))
      return { name, qty: value, type: prop };
  }
  return { name, qty: value, type: 'other' };
}

function sortByPizzaName(inventory) {
  return inventory.sort((a, b) => {
    let res = 0;

    res = checkType(a, b);

    if (res) return res;

    res = checkName(a, b);

    return res;
  });
}

function checkType(a, b) {
  if (a.type === 'other' && b.type !== 'other') {
    return 1;
  }
  if (a.type !== 'other' && b.type === 'other') {
    return -1;
  }
  if (a.type < b.type) {
    return -1;
  }
  if (a.type > b.type) {
    return 1;
  }
}

function checkName(a, b) {
  let aNormalizedName = a.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  let bNormalizedName = b.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (aNormalizedName < bNormalizedName) {
    return -1;
  }
  if (aNormalizedName > bNormalizedName) {
    return 1;
  }
  return 0;
}

function groupByPizzaType(inventory) {
  let result = {};

  for (let item of inventory) {
    if (typeof result[item.type] === 'undefined')
      result[item.type] = [];
    result[item.type].push(item);
  }

  return result;
}

module.exports = setPizzaTypes;
