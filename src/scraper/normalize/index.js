const uniformInventories = require('./uniform-inventories');
const mergeInventories = require('./merge-inventories');
const setPizzaTypes = require('./set-pizza-types');

function normalize(atms) {
  let total;

  atms = uniformInventories(atms);
  // total = mergeInventories(atms);
  // atms.push(total);
  atms = setPizzaTypes(atms, _shared.config.pizzaTypes);

  return atms;
}

module.exports = normalize;
