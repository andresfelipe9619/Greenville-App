import * as publicSheetFunctions from './utils/sheets';
import * as publicDriveFunctions from './utils/drive';

// Expose public functions by attaching to `global`
global.createHouseFile = publicDriveFunctions.createHouseFile;
global.uploadHouseFiles = publicDriveFunctions.uploadHouseFiles;

global.getSheetsData = publicSheetFunctions.getSheetsData;
global.addSheet = publicSheetFunctions.addSheet;
global.deleteSheet = publicSheetFunctions.deleteSheet;
global.setActiveSheet = publicSheetFunctions.setActiveSheet;
