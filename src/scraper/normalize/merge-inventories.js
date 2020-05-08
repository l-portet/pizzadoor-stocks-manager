/* TODO TEMP Maybe unuseful */
function mergeInventories(atms) {
  let mergedInventory = {};

  for (let atm of atms) {
    for (let prop in atm.inventory) {
      if (typeof mergedInventory[prop] === 'undefined') {
        mergedInventory[prop] = {
          filled: 0,
          empty: 0,
          total: 0
        };
      }
      mergedInventory[prop].filled += atm.inventory[prop].filled;
      mergedInventory[prop].empty += atm.inventory[prop].empty;
      mergedInventory[prop].total += atm.inventory[prop].total;
    }
  }

  return { name: 'total', inventory: mergedInventory };
}
/* TODO TEMP Maybe unuseful */

module.exports = mergeInventories;
