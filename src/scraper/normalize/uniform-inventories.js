function uniformInventories(atms) {
  let uniqueProps = [];

  for (let atm of atms) {
    for (let prop in atm.inventory) {
      uniqueProps.push(prop);
    }
  }

  uniqueProps = [...new Set(uniqueProps)];

  for (let atm of atms) {
    for (let uniqueProp of uniqueProps) {
      if (typeof atm.inventory === 'undefined') {
        atm.inventory = {};
      }
      if (typeof atm.inventory[uniqueProp] === 'undefined') {
        atm.inventory[uniqueProp] = null;
      }
    }
  }

  return atms;
}

module.exports = uniformInventories;
