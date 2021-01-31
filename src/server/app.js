export function isAdmin() {
  const guessEmail = Session.getActiveUser().getEmail();
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

function registerHouse(data) {
  Logger.log('=============Registering HOUSE===========');
  const response = { ok: false, data: null };
  const housesSheet = global.getSheetFromSpreadSheet('HOUSES');
  const headers = global.getHeadersFromSheet(housesSheet);
  const rowsBefore = housesSheet.getLastRow();
  const lastRowId = housesSheet.getRange(rowsBefore, 1, 1, 1);
  const houseJson = { ...data, idhouse: lastRowId + 1 };
  const houseValues = global.jsonToSheetValues(houseJson, headers);
  Logger.log('HOUSE VALUES');
  Logger.log(houseValues);

  housesSheet.appendRow(houseValues);

  const rowsAfter = housesSheet.getLastRow();

  if (rowsAfter > rowsBefore) {
    response.ok = true;
    response.data = houseJson;
  }

  Logger.log('=============END Registering HOUSE===========');
  return response;
}

export function searchHouse(houseId) {
  Logger.log('=============Searching House===========');
  const sheet = global.getSheetFromSpreadSheet('HOUSES');
  const result = {
    index: -1,
    data: null,
  };
  const { index: homeIndex } = global.findText({ sheet, text: houseId });
  if (homeIndex <= -1) return result;

  const homeRange = sheet.getSheetValues(
    +homeIndex,
    1,
    1,
    sheet.getLastColumn()
  );
  const headers = global.getHeadersFromSheet(sheet);
  const [homeData] = global.sheetValuesToObject(homeRange, headers);
  const isSameDocument = String(homeData.num_doc) === String(houseId);
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
    const { data, index } = searchHouse(form.houseId);
    if (!index) throw new Error('House does not exists');
    const sheet = global.getSheetFromSpreadSheet('HOUSES');
    const headers = global.getHeadersFromSheet(sheet);
    const homeRange = sheet.getSheetValues(+index, 1, 1, sheet.getLastColumn());
    const houseData = global.jsonToSheetValues(data, headers);

    homeRange.setValues([houseData]);

    response.ok = true;
    response.data = houseData;
    return response;
  } catch (error) {
    Logger.log(error);
    throw new Error('Error updating house');
  }
}

// function buscarPersona(cedula) {
//   let folder;
//   let house = searchHouse(cedula);
//   if (house.state !== 'no esta') {
//     house.files = [];
//     folder = getPersonFolder(cedula);
//     const files = folder.getFiles();
//     Logger.log(`files: ${files}`);
//     while (files.hasNext()) {
//       const file = files.next();
//       house.files.push({ name: file.getName(), url: file.getUrl() });
//     }
//   } else {
//     house = null;
//   }
//   Logger.log('THIS IS WHAT U ARE LOOKING FOR');
//   Logger.log(house);
//   return JSON.stringify(house);
// }

function avoidCollisionsInConcurrentAccessess() {
  const lock = LockService.getPublicLock();
  lock.waitLock(15000);
}

export function createHouse(formString) {
  const form = JSON.parse(formString);
  if (!form || !Object.keys(form).length) throw new Error('No data sent');
  try {
    avoidCollisionsInConcurrentAccessess();
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
