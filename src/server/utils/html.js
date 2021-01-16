function createHtmlTemplate(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .setTitle('Encuentro Colombiano')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

export default function doGet() {
  return createHtmlTemplate('index.html');
}
