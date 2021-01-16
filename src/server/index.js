import * as publicSheetFunctions from './utils/sheets';
import * as publicDriveFunctions from './utils/drive';
import doGet from './utils/html';

// Expose public functions by attaching to `global`
global.doGet = doGet;

global.createHouseFile = publicDriveFunctions.createHouseFile;
global.uploadHouseFiles = publicDriveFunctions.uploadHouseFiles;

global.getSheetsData = publicSheetFunctions.getSheetsData;
global.addSheet = publicSheetFunctions.addSheet;
global.deleteSheet = publicSheetFunctions.deleteSheet;
global.setActiveSheet = publicSheetFunctions.setActiveSheet;
