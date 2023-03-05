// @ts-nocheck
import uniformInventories from './uniform-inventories';
import setPizzaTypes from './set-pizza-types';

export default function normalize(atms, config) {
  let total;

  atms = uniformInventories(atms);
  atms = setPizzaTypes(atms, config.pizzaTypes);

  return atms;
}
