const convertExcel = require('excel-as-json').processFile;

const EXCEL_INPUT = 'assets/slovnik.xlsx';
const DESTINATION = 'assets/output.js';
const OPTIONS = { omitEmptyFields: true };

convertExcel(
  EXCEL_INPUT,
  DESTINATION,
  OPTIONS,
  done => {
    console.log(done);
  },
);
