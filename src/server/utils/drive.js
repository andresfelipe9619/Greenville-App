const ROOT_FOLDER = 'Greenville app';
const FILES_FOLDER = 'Storage';
const FILES_COMMENTS = 'Comments';

function base64ToBlob(fileName, fileData) {
  const contentType = fileData.substring(5, fileData.indexOf(';'));
  const bytes = Utilities.base64Decode(
    fileData.substr(fileData.indexOf('base64,') + 7)
  );
  const blob = Utilities.newBlob(bytes, contentType, fileName);
  return blob;
}

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

function getCommentsFolder(folder) {
  let mainFolder = folder;
  if (!folder) mainFolder = getFilesFolder();
  const commentsFolder = findOrCreateFolder(FILES_COMMENTS, mainFolder);
  return commentsFolder;
}

function getHouseCommentsFolder(name) {
  const commentsFolder = getCommentsFolder();
  const houseFolder = findOrCreateFolder(name, commentsFolder);
  return houseFolder;
}

function getHouseFolder(name) {
  const filesFolder = getFilesFolder();
  const houseFolder = findOrCreateFolder(name, filesFolder);
  return houseFolder;
}

function createDriveFile({ id, folder, blob }) {
  const result = {
    url: '',
    name: '',
  };
  const file = folder.createFile(blob);
  file.setDescription(`Subido Por ${id}`);
  result.url = file.getUrl();
  result.name = file.getName();
  result.file = file;
  return result;
}

export function createHouseFile({ fileName, id, fileData }) {
  const currentFolder = getHouseFolder(id);
  const blob = base64ToBlob(fileName, fileData);
  const result = createDriveFile({ id, blob, folder: currentFolder });
  return result;
}

export function createHouseCommentFile({ fileName, id, fileData }) {
  const currentFolder = getHouseCommentsFolder(id);
  const blob = base64ToBlob(fileName, fileData);
  const result = createDriveFile({ id, blob, folder: currentFolder });
  return result;
}

function mapHouseFiles({ idHouse, files, createFile }) {
  const savedFiles = files.map(file => {
    const name = file.name || '';
    const base64 = file.base64 || '';
    Logger.log(name);
    const savedFile = createFile({
      fileName: name,
      id: idHouse,
      fileData: base64,
    });
    return savedFile.file;
  });
  return savedFiles;
}

export function uploadHouseCommentsFiles(idHouse, files) {
  Logger.log(`=======UPLOADING HOUSE ${idHouse} COMMENTS FILES======`);
  if (!files.length) return null;
  const savedFiles = mapHouseFiles({
    idHouse,
    files,
    createFile: createHouseCommentFile,
  });
  const currentFolder = getHouseCommentsFolder(idHouse);
  const response = { files: savedFiles, folder: currentFolder.getUrl() };
  Logger.log('FILES RESPONSE:');
  Logger.log(response);

  Logger.log(`=======END UPLOADING HOUSE${idHouse} COMMENTS FILES========`);
  return response;
}

export function uploadHouseFiles(idHouse, files) {
  Logger.log(`=======UPLOADING HOUSE ${idHouse} FILES======`);
  if (!files.length) return null;
  const savedFiles = mapHouseFiles({
    idHouse,
    files,
    createFile: createHouseFile,
  });
  const currentFolder = getHouseFolder(idHouse);
  const response = { files: savedFiles, folder: currentFolder.getUrl() };
  Logger.log('FILES RESPONSE:');
  Logger.log(response);

  Logger.log(`=======END UPLOADING HOUSE${idHouse} FILES========`);
  return response;
}
