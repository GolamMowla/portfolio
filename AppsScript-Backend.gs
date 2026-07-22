/**
 * =============================================================
 *  MOWLA DIGITAL — CONTACT FORM BACKEND
 *  AppsScript-Backend.gs
 *
 *  Deploy this as its own Apps Script project bound to (or
 *  targeting) your Google Sheet, then:
 *    Deploy → New deployment → Web app
 *    Execute as: Me
 *    Who has access: Anyone
 *  Copy the resulting Web App URL into SCRIPT_URL at the top of
 *  script.js on the Blogger site.
 *
 *  No spreadsheet ID is hardcoded here either — set it once via
 *  SPREADSHEET_ID below, or leave it blank to use the sheet this
 *  script is bound to.
 * =============================================================
 */

// Paste your Google Sheet ID here (the long string in its URL
// between /d/ and /edit), or leave as '' if this script is
// container-bound to the spreadsheet already.
var SPREADSHEET_ID = '';

var SHEET_NAME = 'Bangladesh';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet_();

    sheet.appendRow([
      data['Date']      || '',
      data['Time']      || '',
      data['Full Name'] || '',
      data['Email']     || '',
      data['Phone']     || '',
      data['Company']   || '',
      data['Subject']   || '',
      data['Message']   || '',
      data['Browser']   || '',
      data['Device']    || '',
      data['IP']        || '',
      data['Status']    || 'New Lead'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_() {
  var ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Date', 'Time', 'Full Name', 'Email', 'Phone', 'Company',
      'Subject', 'Message', 'Browser', 'Device', 'IP', 'Status'
    ]);
    sheet.getRange(1, 1, 1, 12).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}
