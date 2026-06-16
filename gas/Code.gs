/**
 * 範例 Apps Script：接收 POST JSON 並把資料寫入 Spreadsheet
 * 使用方式：
 * 1. 在 Google Drive 建立一個 Spreadsheet，記下 id（網址中的 /d/<id>/）
 * 2. 在 Apps Script 上建立專案，貼上此檔案，將 SHEET_ID 填入
 * 3. 部署為 Web App（任何人，包括匿名者）以取得部署網址，並把網址貼回前端的 GAS_URL
 */

const SHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  try {
    const body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    const row = [new Date(), body.recipe || '', (body.items || []).join(', '), body.timestamp || ''];
    sheet.appendRow(row);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err.message);
  }
}
