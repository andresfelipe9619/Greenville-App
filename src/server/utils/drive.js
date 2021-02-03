const ROOT_FOLDER = 'Greenville app';
const FILES_FOLDER = 'Archivos';

function findOrCreateFolder(name, folder2search) {
  let folder;
  const folders = folder2search.getFoldersByName(name);
  if (folders.hasNext()) folder = folders.next();
  else folder = folder2search.createFolder(name);
  return folder;
}

function getMainFolder() {
  const mainFolder = findOrCreateFolder(ROOT_FOLDER, DriveApp);
  return mainFolder;
}

function getFilesFolder(folder) {
  let mainFolder = folder;
  if (!folder) mainFolder = getMainFolder();

  const filesFolder = findOrCreateFolder(FILES_FOLDER, mainFolder);
  return filesFolder;
}

function getHouseFolder(name, folder) {
  const filesFolder = getFilesFolder(folder);
  const houseFolder = findOrCreateFolder(name, filesFolder);
  return houseFolder;
}

export function createHouseFile(fileName, id, fileData) {
  const result = {
    url: '',
    name: '',
  };
  const mainFolder = getMainFolder();
  Logger.log(`Main Folder: ${mainFolder}`);
  const currentFolder = getHouseFolder(id, mainFolder);
  Logger.log(`File Folder: ${currentFolder}`);
  const contentType = fileData.substring(5, fileData.indexOf(';'));
  Logger.log(`Content Type: ${contentType}`);
  const bytes = Utilities.base64Decode(
    fileData.substr(fileData.indexOf('base64,') + 7)
  );
  const blob = Utilities.newBlob(bytes, contentType, fileName);

  const file = currentFolder.createHouseFile(blob);
  file.setDescription(`Subido Por ${id}`);
  result.url = file.getUrl();
  result.name = file.getName();
  result.file = file;
  return result;
}

export function uploadHouseFiles(idHouse, files) {
  Logger.log(`=======UPLOADING HOUSE ${idHouse} FILES======`);
  if (!files.length) return null;
  Logger.log('FILES:');
  const savedFiles = files.map(file => {
    const name = file.name || '';
    const base64 = file.base64 || '';
    Logger.log(name);
    const savedFile = createHouseFile(name, idHouse, base64);
    return savedFile.file;
  });
  const mainFolder = getMainFolder();
  const currentFolder = getHouseFolder(idHouse, mainFolder);
  const response = { files: savedFiles, folder: currentFolder.getUrl() };
  Logger.log('FILES RESPONSE:');
  Logger.log(response);

  Logger.log(`=======END UPLOADING HOUSE${idHouse} FILES========`);
  return response;
}
