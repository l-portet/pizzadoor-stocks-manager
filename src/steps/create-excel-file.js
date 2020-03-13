const Excel = require('exceljs');

async function createExcelFile(inventories) {
  let { workbook, worksheet } = setupWorkbook(inventories);
  let rows = formatDataAsRows(inventories);

  addRowsInWorksheet(inventories, worksheet, rows);

  applyClassStyle(worksheet.getRow(1), 'title');

  await workbook.xlsx.writeFile('export.xlsx');
  // Return file buffer
  return await workbook.xlsx.writeBuffer();
}

function setupWorkbook(inventories) {
  let workbook = new Excel.Workbook();

  workbook.creator = 'Adial Scraper';
  workbook.created = new Date();
  workbook.modified = new Date();

  let worksheet = workbook.addWorksheet('Index');
  let columns = [];
  let sampleRow = {};

  for (let inventory of inventories) {
    columns.push({
      header: inventory.name,
      key: inventory.name + '-pizzaName',
      width: 40
    });
    columns.push({
      header: '',
      key: inventory.name + '-qty',
      width: 10
    });
  }

  worksheet.columns = columns;

  return { workbook, worksheet };
}

function formatDataAsRows(inventories) {
  let rows = {};
  let index = 0;
  let isOnFirstColumn = true;
  let totalRow = {};
  let total = 0;

  for (let inventory of inventories) {
    let totalInventory = 0;
    for (let prop in inventory.data) {
      let category = inventory.data[prop];
      let totalCategory = 0;

      for (let item of category) {
        if (typeof rows[index] === 'undefined') rows[index] = {};
        rows[index].class = 'item';
        rows[index][inventory.name + '-pizzaName'] = item.name;
        rows[index][inventory.name + '-qty'] = item.qty;

        index++;
      }
      if (typeof rows[index] === 'undefined') rows[index] = {};
      rows[index].class = 'divider';

      if (isOnFirstColumn)
        rows[index][inventory.name + '-pizzaName'] = `Total ${prop}:`;
      totalCategory = getTotalQtyFromCategory(category);
      rows[index][inventory.name + '-qty'] = totalCategory;
      totalInventory += totalCategory;
      index++;
    }
    if (typeof rows[index] === 'undefined') rows[index] = {};
    if (isOnFirstColumn)
      rows[index][inventory.name + '-pizzaName'] = 'Total général:';
    rows[index][inventory.name + '-qty'] = totalInventory;
    rows[index].class= 'total-row'
    index = 0;
    isOnFirstColumn = false;
  }

  return Object.values(rows);
}

function getTotalQtyFromCategory(category) {
  return category.reduce((acc, item) => acc + item.qty, 0);
}

function addRowsInWorksheet(inventories, worksheet, rows) {
  for (let row of rows) {
    let worksheetRow = worksheet.addRow(row);

    applyClassStyle(worksheetRow, row.class);
  }
}

function applyClassStyle(row, className) {
  const classes = {
    default: {
      font: {
        bold: true
      }
    },
    title: {
      font: {
        size: 30,
        bold: true
      }
    },
    divider: {
      font: {
        size: 26,
        bold: true,
        color: {
          argb: 'FF0000FF'
        }
      }
    },
    item: {
      font: {
        size: 26,
        bold: true
      }
    },
    'total-row': {
      font: {
        size: 26,
        bold: true,
        color: {
          argb: 'FFFF0000'
        }
      }
    }
  };
  if (typeof classes[className] === 'undefined')
    applyClassStyleProperties(row, classes['default']);
  else applyClassStyleProperties(row, classes[className]);
}

function applyClassStyleProperties(row, classStyle) {
  for (let prop in classStyle) {
    row[prop] = classStyle[prop];
  }
}

module.exports = createExcelFile;
