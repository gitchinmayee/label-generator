'use strict';
const XLSX = require('xlsx');

/**
 * Parses the Excel file starting from the "Column Number" header.
 * Maps Column, Row, Size, and joins Legend Lines 1-10.
 */
function parseExcel(buffer) {
  try {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

    // Finds the row where "Column Number" starts
    const headerIndex = rawData.findIndex(row => 
      row.some(cell => String(cell).toLowerCase().includes("column number"))
    );

    if (headerIndex === -1) throw new Error("Invalid Excel Header structure.");

    const dataRows = rawData.slice(headerIndex + 1);

    return dataRows
      .filter(row => row[0] !== "" && row[0] !== undefined) // Process only valid rows
      .map((row) => {
        // Collect Legend Lines 1-10 from columns D through M (indices 3-12)
        let labelLines = [];
        for (let i = 3; i <= 12; i++) {
          if (row[i] && String(row[i]).trim() !== "") {
            labelLines.push(String(row[i]).trim());
          }
        }

        return {
          col: Number(row[0]),
          row: Number(row[1]),
          // Logic: If column C (index 2) contains 'big', set size to 'big'
          size: String(row[2] || 'small').toLowerCase().includes('big') ? 'big' : 'small',
          label: labelLines.join('\n') || 'SPARE'
        };
      });
  } catch (err) {
    console.error("Parse Error:", err);
    throw err;
  }
}

module.exports = { parseExcel };