const Excel = require('exceljs');
const { CLASSES } = require('./styles');
const addTotalAtms = require('./add-total-atms');
const groupPizzasByType = require('./group-pizzas-by-type');

async function createExcel(atms) {
  atms = addTotalAtms(atms);

  let { workbook, worksheet } = setupWorkbook(atms);
  let rows = formatDataAsRows(atms);

  addRowsInWorksheet(atms, worksheet, rows);

  applyClassStyle(worksheet.getRow(1), 'title');

  // await workbook.xlsx.writeFile('export.xlsx');
  // Return file buffer
  return await workbook.xlsx.writeBuffer();
}

function setupWorkbook(atms) {
  let workbook = new Excel.Workbook();

  workbook.creator = 'Adial Scraper';
  workbook.created = new Date();
  workbook.modified = new Date();

  let worksheet = workbook.addWorksheet('Index');
  let columns = [];
  let sampleRow = {};

  for (let atm of atms) {
    columns.push({
      header: atm.name,
      key: atm.name + '-pizzaName',
      width: 50
    });
    columns.push({
      header: '',
      key: atm.name + '-qty',
      width: 10
    });
  }

  worksheet.columns = columns;

  return { workbook, worksheet };
}

function formatDataAsRows(atms) {
  let rows = {};
  let index = 0;
  let isOnFirstColumn = true;
  let totalRow = {};
  let total = 0;

  for (let atm of atms) {
    let totalInventory = 0;
    let groupedInventory = groupPizzasByType(atm.inventory);

    for (let prop in groupedInventory) {
      let category = groupedInventory[prop];
      let totalCategory = 0;

      for (let item of category) {
        if (typeof rows[index] === 'undefined') rows[index] = {};

        rows[index].class = 'item';
        rows[index][atm.name + '-pizzaName'] = item.name;
        rows[index][atm.name + '-qty'] = item.stocks.toCraft;

        index++;
      }
      if (typeof rows[index] === 'undefined') rows[index] = {};
      rows[index].class = 'divider';

      if (isOnFirstColumn)
        rows[index][atm.name + '-pizzaName'] = `Total ${prop}:`;
      totalCategory = getTotalQtyFromCategory(category);
      rows[index][atm.name + '-qty'] = totalCategory;
      totalInventory += totalCategory;
      index++;
    }
    if (typeof rows[index] === 'undefined') rows[index] = {};
    if (isOnFirstColumn)
      rows[index][atm.name + '-pizzaName'] = 'Total général:';
    rows[index][atm.name + '-qty'] = totalInventory;
    rows[index].class = 'total-row';
    index = 0;
    isOnFirstColumn = false;
  }

  return Object.values(rows);
}

function getTotalQtyFromCategory(category) {
  return category.reduce((acc, item) => acc + item.stocks.toCraft, 0);
}

function addRowsInWorksheet(atms, worksheet, rows) {
  for (let row of rows) {
    let worksheetRow = worksheet.addRow(row);

    applyClassStyle(worksheetRow, row.class);
  }
}

function applyClassStyle(row, className) {
  if (typeof CLASSES[className] === 'undefined')
    applyClassStyleProperties(row, CLASSES['default']);
  else applyClassStyleProperties(row, CLASSES[className]);
}

function applyClassStyleProperties(row, classStyle) {
  for (let prop in classStyle) {
    row[prop] = classStyle[prop];
  }
}

module.exports = createExcel;
