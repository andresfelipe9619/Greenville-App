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
  const housesSheet = global.getSheetFromSpreadSheet('HOUSES');
  const headers = global.getHeadersFromSheet(housesSheet);
  const houseValues = global.jsonToSheetValues(data, headers);
  Logger.log('HOUSE VALUES');
  Logger.log(houseValues);

  let response = 'Error!';

  const rowsBefore = housesSheet.getLastRow();
  housesSheet.appendRow(houseValues);
  const rowsAfter = housesSheet.getLastRow();

  if (rowsAfter > rowsBefore) {
    response = 'exito';
  }

  Logger.log('=============END Registering HOUSE===========');
  return response;
}

// function editStudent(serializedData) {
//   const form = JSON.parse(serializedData);
//   const house = validateHouse(form.num_doc);
//   console.log('form', form);
//   const newData = getDataForRegistering(form, house);

//   editEstudentGeneral(newData, house.index);
//   // editStudentActualPeriod( newData );
// }

// function editEstudentGeneral(student, studentIndex) {
//   try {
//     const housesSheet = getSheetFromSpreadSheet('HOUSES');
//     const headers = getHeadersFromSheet(housesSheet);
//     Logger.log('GENERAL PERIOD');
//     Logger.log(student);
//     const studentRange = housesSheet.getRange(
//       Number(studentIndex),
//       1,
//       1,
//       housesSheet.getLastColumn()
//     );
//     const studentData = jsonToSheetValues(student, headers);
//     studentRange.setValues([studentData]);
//     return 'exito';
//   } catch (error) {
//     Logger.log(error);
//     throw 'Error editing student on General DB';
//   }
// }

export function validateHouse(cedula) {
  Logger.log('=============Validating Person===========');
  const sheet = global.getSheetFromSpreadSheet('HOUSES');
  const result = {
    state: 'no esta',
    index: -1,
    data: null,
  };
  const currentPeriod = global.getCurrentPeriod().periodo;
  const textFinder = sheet.createTextFinder(cedula);
  const studentFound = textFinder.findNext();
  const studentIndex = studentFound ? studentFound.getRow() : -1;
  if (studentIndex <= -1) return result;

  const studentRange = sheet.getSheetValues(
    Number(studentIndex),
    1,
    1,
    sheet.getLastColumn()
  );
  const headers = global.getHeadersFromSheet(sheet);
  const [studentData] = global.sheetValuesToObject(studentRange, headers);
  const isSameDocument = String(studentData.num_doc) === String(cedula);
  if (!isSameDocument) return result;

  const isFromCurrentPeriod = String(studentData[currentPeriod]) !== '-';
  result.index = studentIndex;
  result.state = isFromCurrentPeriod ? 'actual' : 'antiguo';
  result.data = studentData;
  Logger.log(result);
  Logger.log('=============END Validating Person===========');
  return result;
}

// function buscarPersona(cedula) {
//   let folder;
//   let house = validateHouse(cedula);
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
    // const filesResult = global.uploadHouseFiles(form.num_doc, form.files);
    // Logger.log('Files Result');
    // Logger.log(filesResult);
    // const folderUrl = (filesResult || {}).folder;
    // form.url_documentos = folderUrl;
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
