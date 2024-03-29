// @ts-nocheck
export default function setPizzaTypes(atms, pizzaTypes) {
  atms = atms.map(atm => {
    let inventory = [];

    for (let prop in atm.inventory) {
      inventory.push(findPizzaType(pizzaTypes, prop, atm.inventory[prop]));
    }
    atm.inventory = sortByPizzaName(inventory);
    // atm.inventory = groupByPizzaType(atm.inventory)
    return atm;
  });
  return atms;
}

function findPizzaType(pizzaTypes, name, value) {
  // Remove special accents
  let normalizedName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  normalizedName = normalizedName.toLowerCase();

  for (let prop in pizzaTypes) {
    if (pizzaTypes[prop].includes(normalizedName))
      return { name, stocks: value, type: prop };
  }
  return { name, stocks: value, type: 'other' };
}

function sortByPizzaName(atm) {
  return atm.sort((a, b) => {
    let res = 0;

    res = checkType(a, b);

    if (res) return res;

    res = checkName(a, b);

    return res;
  });
}

function checkType(a, b) {
  const otherTypes = ['other', 'autre'];
  const aType = a.type.toLowerCase();
  const bType = b.type.toLowerCase();

  if (otherTypes.includes(aType) && !otherTypes.includes(bType)) {
    return 1;
  }

  if (!otherTypes.includes(aType) && otherTypes.includes(bType)) {
    return -1;
  }

  if (a.type < b.type) {
    return 1;
  }

  if (a.type > b.type) {
    return -1;
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
