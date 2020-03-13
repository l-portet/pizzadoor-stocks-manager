function uniformInventories(inventories) {
  let props = [];

  for (let inventory of inventories)
    for (let prop in inventory.data) props.push(prop);

  props = [...new Set(props)];

  for (let inventory of inventories) {
    for (let prop of props) {
      if (typeof inventory.data[prop] === 'undefined') {
        inventory.data[prop] = 0;
      }
    }
  }

  return inventories;
}

module.exports = uniformInventories;
