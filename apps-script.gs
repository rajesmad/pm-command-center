// ── PM STATUS TOOL — Google Apps Script Backend ──────────────────────
// Paste this entire file into Extensions → Apps Script in your Google Sheet
// Then deploy as Web App (Anyone can access)

const SHEET_NAME = "Sheet1"; // Change if your sheet tab has a different name

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  // CORS headers via callback
  const params = e.parameter || {};
  const action = params.action || (e.postData ? JSON.parse(e.postData.contents).action : null);

  try {
    let result;

    if (action === "submit") {
      const data = JSON.parse(e.postData.contents);
      result = submitUpdate(data);
    } else if (action === "fetch") {
      result = fetchUpdates();
    } else if (action === "note") {
      const data = JSON.parse(e.postData.contents);
      result = saveNote(data);
    } else {
      result = { success: false, error: "Unknown action" };
    }

    output.setContent(JSON.stringify(result));
  } catch (err) {
    output.setContent(JSON.stringify({ success: false, error: err.message }));
  }

  return output;
}

// ── SUBMIT a new PM update ────────────────────────────────────────────
function submitUpdate(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit"
  });

  sheet.appendRow([
    timestamp,
    data.pm || "",
    data.project || "",
    data.track || "",
    data.customer || "",
    data.rag || "",
    data.milestone || "",
    data.risk || "",
    data.accomplishments || "",
    data.needsDecision ? "YES" : "NO",
    data.decisionText || "",
    "" // RaguNotes starts empty
  ]);

  return { success: true, message: "Update submitted successfully" };
}

// ── FETCH all updates for current week ───────────────────────────────
function fetchUpdates() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();

  if (rows.length <= 1) return { success: true, data: [] }; // only headers

  const headers = rows[0];
  const data = [];

  // Get start of current week (Monday)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0]) continue; // skip empty rows

    // Parse timestamp back to date for filtering
    const rowDate = new Date(row[0]);
    // Include all rows if date parsing fails (fallback)
    const include = isNaN(rowDate) ? true : rowDate >= monday;

    if (include) {
      data.push({
        id: i, // row number as ID
        submittedAt: row[0],
        pm: row[1],
        project: row[2],
        track: row[3],
        customer: row[4],
        rag: row[5],
        milestone: row[6],
        risk: row[7],
        accomplishments: row[8],
        needsDecision: row[9] === "YES",
        decisionText: row[10],
        ragNotes: row[11]
      });
    }
  }

  return { success: true, data };
}

// ── SAVE Ragu's note on a project ────────────────────────────────────
function saveNote(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  // data.rowId is 1-based row index (header is row 1, data starts row 2)
  const rowIndex = data.rowId + 1; // +1 because row 1 is headers
  sheet.getRange(rowIndex, 12).setValue(data.note); // Column L = RaguNotes
  return { success: true };
}
