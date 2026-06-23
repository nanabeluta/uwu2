const SHEET_ID = '1vKppVTJ-4pRBE4Sj1gxvkaFvca4E5Dmf0sqnWGhl9fk';
const SHEET_NAME = 'Sheet1';

function doOptions(e) {
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    let body = {};
    if (e.postData && e.postData.type === 'application/json' && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else {
      body = {
        recipe: e.parameter.recipe || '',
        items: e.parameter.items ? e.parameter.items.split(',').map(i => i.trim()) : [],
        timestamp: e.parameter.timestamp || ''
      };
    }

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
