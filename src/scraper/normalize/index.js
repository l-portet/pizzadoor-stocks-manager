const uniformInventories = require('./uniform-inventories');
const mergeInventories = require('./merge-inventories');
const setPizzaTypes = require('./set-pizza-types');

function normalize(atms, config) {
  let total;

  atms = uniformInventories(atms);
  // total = mergeInventories(atms);
  // atms.push(total);
  atms = setPizzaTypes(atms, config.pizzaTypes);

  return atms;
}

module.exports = normalize;
