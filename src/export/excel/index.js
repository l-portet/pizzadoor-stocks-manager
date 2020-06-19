const Excel = require('exceljs');
const deepmerge = require('deepmerge');
const { CLASSES } = require('./styles');
const addTotalAtms = require('./add-total-atms');
const groupPizzasByType = require('./group-pizzas-by-type');

async function createExcel(atms) {
  atms = addTotalAtms(atms);

  let { workbook, worksheet } = setupWorkbook(atms);
  let rows = formatDataAsRows(atms);

  addRowsInWorksheet(atms, worksheet, rows);

  applyClassStyle(worksheet.getRow(1), 'title');

  addBordersToColumns(worksheet);
  addBordersToRows(worksheet);
  setHeightToRows(worksheet);

  // Return file buffer
  return await workbook.xlsx.writeBuffer();
}

function setupWorkbook(atms) {
  let workbook = new Excel.Workbook();

  workbook.creator = 'Pizzadoor Stocks Manager';
  workbook.created = new Date();
  workbook.modified = new Date();

  let worksheet = workbook.addWorksheet('Index');
  let columns = [];
  let sampleRow = {};

  for (let atm of atms) {
    columns.push({
      header: atm.name,
      key: atm.name + '-pizzaName',
      width: 25
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
  applyClassStyleProperties(row, CLASSES[className]);
}

function applyClassStyleProperties(row, classStyle) {
  for (let prop in classStyle) {
    row[prop] = deepmerge(row[prop], classStyle[prop]);
  }
}

function addBordersToRows(worksheet) {
  const firstRow = worksheet.getRow(1);
  const lastRow = worksheet.getRow(16);

  firstRow.eachCell(
    cell =>
      (cell.border = deepmerge(cell.style.border, {
        top: { style: 'medium' }
      }))
  );

  // TEMP lastRow.eachCell doesn't seem to work for the moment
  lastRow._cells.forEach(
    cell =>
      (cell.border = deepmerge(cell.style.border, {
        bottom: { style: 'medium' }
      }))
  );
}

function addBordersToColumns(worksheet) {
  for (const [index, column] of worksheet.columns.entries()) {
    let borderStyle;

    if (index % 2 === 0) {
      borderStyle = { left: { style: 'medium' } };
    } else {
      borderStyle = { right: { style: 'medium' } };
    }
    column.eachCell(
      cell => (cell.style.border = deepmerge(cell.style.border, borderStyle))
    );
  }
}

function setHeightToRows(worksheet) {
  let firstRow = worksheet.getRow(0);

  firstRow.hidden = false;
  firstRow.height = 37;
}

module.exports = createExcel;
