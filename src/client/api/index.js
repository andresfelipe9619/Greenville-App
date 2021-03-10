import server from '../utils/server';

const { serverFunctions } = server;

function noFolderCreated() {
  throw new Error(
    'Somenthing went wrong creating files. It is not returning any folder.'
  );
}

// props: group, zone, files, ...etc
async function uploadFileToHouse({ idHouse, ...props }) {
  const fileFromDrive = await serverFunctions.uploadHouseFiles({
    idHouse,
    ...props,
  });
  console.log('fileFromDrive', fileFromDrive);
  if (!fileFromDrive.folder) noFolderCreated();
  return fileFromDrive;
}

async function uplaodFilesGroups({ idHouse, zone, houseFiles = [] }) {
  if (!houseFiles.length) return null;
  const [firstGroup, ...restGroups] = houseFiles;
  // Upload first group independently
  // so we can create the folder for the rest of files
  const result = await uploadFileToHouse({ idHouse, zone, ...firstGroup });
  if (!restGroups || !restGroups.length) return result;

  return Promise.all(
    restGroups.map(fileGroup =>
      uploadFileToHouse({ idHouse, zone, ...fileGroup })
    )
  );
}

serverFunctions.uplaodFilesGroups = uplaodFilesGroups;
serverFunctions.uploadFileToHouse = uploadFileToHouse;

export default serverFunctions;
