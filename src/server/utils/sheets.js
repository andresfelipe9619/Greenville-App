const GENERAL_DB =
  'https://docs.google.com/spreadsheets/d/10dTrDpc9xgfqlvbpZIOXB2fDJ4ZZTHlv5t9bvUuP6_M/edit#gid=0';

const getSheets = () => SpreadsheetApp.getActive().getSheets();

const getActiveSheetName = () => SpreadsheetApp.getActive().getSheetName();

function normalizeString(value) {
  return String(value || '')
    .trim()
    .replace(/ +/g, '')
    .toLowerCase();
}

function wordToCamelCase(string) {
  return String(string)
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');
}

export function getSheetFromSpreadSheet(sheet) {
  const Spreedsheet = SpreadsheetApp.openByUrl(GENERAL_DB);
  if (sheet) return Spreedsheet.getSheetByName(sheet);
  return null;
}

export function getRawDataFromSheet(sheet) {
  const mSheet = getSheetFromSpreadSheet(sheet);
  if (mSheet) {
    return mSheet.getSheetValues(
      1,
      1,
      mSheet.getLastRow(),
      mSheet.getLastColumn()
    );
  }
  return null;
}

export const getSheetsData = () => {
  const activeSheetName = getActiveSheetName();
  return getSheets().map((sheet, index) => {
    const name = sheet.getName();
    return {
      name,
      index,
      isActive: name === activeSheetName,
    };
  });
};

export const addSheet = sheetTitle => {
  SpreadsheetApp.getActive().insertSheet(sheetTitle);
  return getSheetsData();
};

export const deleteSheet = sheetIndex => {
  const sheets = getSheets();
  SpreadsheetApp.getActive().deleteSheet(sheets[sheetIndex]);
  return getSheetsData();
};

export const setActiveSheet = sheetName => {
  SpreadsheetApp.getActive()
    .getSheetByName(sheetName)
    .activate();
  return getSheetsData();
};

export function findText({ sheet, text }) {
  let index;
  const textFinder = sheet.createTextFinder(text);
  const textFound = textFinder.findNext();
  if (textFound) index = textFound.getRow();
  const data = textFound || null;
  return { index, data };
}

function addHeadings(sheetValues, headings) {
  return sheetValues.map(row => {
    const sheetValuesAsObject = {};

    headings.forEach((heading, column) => {
      sheetValuesAsObject[heading] = row[column];
    });

    return sheetValuesAsObject;
  });
}

export function sheetValuesToObject(values, headers) {
  const headings = headers || values[0].map(wordToCamelCase);
  let sheetValues = null;
  if (values) sheetValues = headers ? values : values.slice(1);
  const objectWithHeadings = addHeadings(sheetValues, headings);

  return objectWithHeadings;
}

export function getHeadersFromSheet(sheet) {
  let headers = [];
  if (!sheet) return headers;
  [headers] = sheet.getSheetValues(1, 1, 1, sheet.getLastColumn());
  return headers;
}

export function jsonToSheetValues(json, headers) {
  const arrayValues = new Array(headers.length);
  const lowerHeaders = headers.map(normalizeString);
  Object.keys(json).forEach(key => {
    const keyValue = normalizeString(key);
    lowerHeaders.forEach((header, index) => {
      if (keyValue === header) {
        arrayValues[index] = String(json[key]);
      }
    });
  });
  return arrayValues;
}
