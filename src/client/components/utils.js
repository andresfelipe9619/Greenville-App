export const getFile = file => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};

export const getFileSize = fileSize => {
  let size = fileSize;
  const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
  let i = 0;
  while (size > 900) {
    size /= 1024;
    i++;
  }
  const exactSize = `${Math.round(size * 100) / 100} ${fSExt[i]}`;
  return exactSize;
};
