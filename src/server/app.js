const getCurrentUser = () => Session.getActiveUser().getEmail();
export function isAdmin() {
  const guessEmail = getCurrentUser();
  const admins = [
    'suarez.andres@correounivalle.edu.co',
    'samuel.ramirez@correounivalle.edu.co',
  ];
  Logger.log('guessEmail');
  Logger.log(guessEmail);
  const isGuessAdmin = admins.indexOf(String(guessEmail)) >= 0;
  Logger.log(isGuessAdmin);

  return isGuessAdmin;
}

function createHtmlTemplate(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .setTitle('HR Drywall')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

export function doGet() {
  return createHtmlTemplate('index.html');
}

export function doPost(request) {
  Logger.log('request');
  Logger.log(request);

  if (typeof request !== 'undefined') {
    Logger.log(request);
    const params = request.parameter;
    Logger.log('params');
    Logger.log(params);
    return ContentService.createTextOutput(JSON.stringify(request.parameter));
  }
  return null;
}

export function getHouses() {
  const rawHouses = global.getRawDataFromSheet('HOUSES');
  const houses = global.sheetValuesToObject(rawHouses);
  return houses;
}

function getHousesSheet() {
  const sheet = global.getSheetFromSpreadSheet('HOUSES');
  const headers = global.getHeadersFromSheet(sheet);
  return { sheet, headers };
}

export function getComments() {
  const rawComments = global.getRawDataFromSheet('COMMENTS');
  const comments = global.sheetValuesToObject(rawComments);
  return comments;
}

export function getCommentsSheet() {
  const sheet = global.getSheetFromSpreadSheet('COMMENTS');
  const headers = global.getHeadersFromSheet(sheet);
  return { sheet, headers };
}

function registerHouse(data) {
  Logger.log('=============Registering HOUSE===========');
  const response = { ok: false, data: null };
  const { sheet, headers } = getHousesSheet();
  const currentLastRow = sheet.getLastRow();
  let lastRowId = 0;
  if (currentLastRow > 1) {
    [lastRowId] = sheet.getSheetValues(currentLastRow, 1, 1, 1);
  }
  Logger.log('lastRowId');
  Logger.log(lastRowId);
  const houseJson = { ...data, idHouse: +lastRowId + 1 };
  const houseValues = global.jsonToSheetValues(houseJson, headers);
  Logger.log('HOUSE VALUES');
  Logger.log(houseValues);

  sheet.appendRow(houseValues);

  const rowsAfter = sheet.getLastRow();
  const recordInserted = rowsAfter > currentLastRow;

  if (recordInserted) {
    response.ok = true;
    response.data = houseJson;
  }

  Logger.log('=============END Registering HOUSE===========');
  return response;
}

export function registerComment(data) {
  Logger.log('=============Registering COMMENT===========');
  const response = { ok: false, data: null };
  const { sheet, headers } = getCommentsSheet();
  const currentLastRow = sheet.getLastRow();
  let lastRowId = 0;
  if (currentLastRow > 1) {
    [lastRowId] = sheet.getSheetValues(currentLastRow, 1, 1, 1);
  }
  Logger.log('lastRowId');
  Logger.log(lastRowId);
  const houseJson = {
    ...data,
    user: getCurrentUser(),
    idComment: +lastRowId + 1,
    date: new Date().toString(),
  };
  const commentValues = global.jsonToSheetValues(houseJson, headers);
  Logger.log('COMMENT VALUES');
  Logger.log(commentValues);

  sheet.appendRow(commentValues);

  const rowsAfter = sheet.getLastRow();
  const recordInserted = rowsAfter > currentLastRow;

  if (recordInserted) {
    response.ok = true;
    response.data = houseJson;
  }

  Logger.log('=============END Registering COMMENT===========');
  return response;
}

export function searchHouse(idHouse) {
  Logger.log('=============Searching House===========');
  const { sheet, headers } = getHousesSheet();
  const result = {
    index: -1,
    data: null,
  };
  const { index: homeIndex } = global.findText({ sheet, text: idHouse });
  Logger.log(`HomeIndex ${homeIndex}`);
  if (homeIndex <= -1) return result;

  const homeRange = sheet.getSheetValues(
    +homeIndex,
    1,
    1,
    sheet.getLastColumn()
  );
  Logger.log(`homeRange: ${homeRange.length}`);
  Logger.log(homeRange);
  const [homeData] = global.sheetValuesToObject(homeRange, headers);
  Logger.log(`HomeData:`);
  Logger.log(homeData);
  const isSameDocument = String(homeData.idHouse) === String(idHouse);
  if (!isSameDocument) return result;

  result.index = homeIndex;
  result.data = homeData;
  Logger.log(result);
  Logger.log('=============END Searching House===========');
  return result;
}

export function updateHouse(serializedData) {
  try {
    const response = { ok: false, data: null };
    const form = JSON.parse(serializedData);
    Logger.log(form);
    const { data, index } = searchHouse(form.idHouse);
    Logger.log('data');
    Logger.log(data);
    if (!index) throw new Error('House does not exists');
    const { sheet, headers } = getHousesSheet();
    const homeRange = sheet.getRange(+index, 1, 1, sheet.getLastColumn());
    const houseData = global.jsonToSheetValues({ ...data, ...form }, headers);
    Logger.log('houseData');
    Logger.log(houseData);

    homeRange.setValues([houseData]);

    response.ok = true;
    response.data = houseData;
    return response;
  } catch (error) {
    Logger.log(error);
    throw new Error('Error updating house');
  }
}

// function avoidCollisionsInConcurrentAccessess() {
//   const lock = LockService.getPublicLock();
//   lock.waitLock(15000);
// }

export function createComment(formString) {
  const form = JSON.parse(formString);
  if (!form || !Object.keys(form).length) throw new Error('No data sent');
  try {
    // avoidCollisionsInConcurrentAccessess();
    Logger.log('Data for registering');
    Logger.log(form);
    const response = registerComment(form);
    Logger.log('Response');
    Logger.log(response);
    return response;
  } catch (error) {
    Logger.log('Error Registering Student');
    Logger.log(error);
    return error.toString();
  }
}

export function createHouse(formString) {
  const form = JSON.parse(formString);
  if (!form || !Object.keys(form).length) throw new Error('No data sent');
  try {
    // avoidCollisionsInConcurrentAccessess();
    Logger.log('Data for registering');
    Logger.log(form);
    const response = registerHouse(form);
    Logger.log('Response');
    Logger.log(response);
    return response;
  } catch (error) {
    Logger.log('Error Registering Student');
    Logger.log(error);
    return error.toString();
  }
}
