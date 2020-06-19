const uniformInventories = require('./uniform-inventories');
const setPizzaTypes = require('./set-pizza-types');

function normalize(atms, config) {
  let total;

  atms = uniformInventories(atms);
  atms = setPizzaTypes(atms, config.pizzaTypes);

  return atms;
}

module.exports = normalize;
