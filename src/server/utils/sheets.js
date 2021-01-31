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

function addHeadings(people, headings) {
  return people.map(personAsArray => {
    const personAsObj = {};

    headings.forEach((heading, i) => {
      personAsObj[heading] = personAsArray[i];
    });

    return personAsObj;
  });
}

export function sheetValuesToObject(sheetValues, headers) {
  const headings = headers || sheetValues[0].map(normalizeString);
  let people = null;
  if (sheetValues) people = headers ? sheetValues : sheetValues.slice(1);
  const peopleWithHeadings = addHeadings(people, headings);

  return peopleWithHeadings;
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
