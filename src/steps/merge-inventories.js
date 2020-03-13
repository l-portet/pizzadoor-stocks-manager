function mergeInventories(inventories) {
  let results = {};

  for (let inventory of inventories) {
    for (let prop in inventory.data) {
      if (typeof results[prop] === 'undefined') results[prop] = 0;
      results[prop] += inventory.data[prop];
    }
  }

  return { name: 'total', data: results };
}

module.exports = mergeInventories;
