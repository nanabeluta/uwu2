const SHEET_ID = '1vKppVTJ-4pRBE4Sj1gxvkaFvca4E5Dmf0sqnWGhl9fk';
const SHEET_NAME = 'Sheet1';

function doOptions(e) {
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.TEXT)
    .getHeaders()['Access-Control-Allow-Origin'] = '*';
}

function doPost(e) {
  try {
    const body = e.postData && e.postData.contents
      ? JSON.parse(e.postData.contents)
      : {};
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    const row = [
      new Date(),
      body.recipe || '',
      (body.items || []).join(', '),
      body.timestamp || ''
    ];
    sheet.appendRow(row);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err.message);
  }
}
