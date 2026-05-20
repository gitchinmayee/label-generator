const PDFDocument = require('pdfkit');

/**
 * Generates a Landscape A4 PDF with touching boxes (zero gap).
 * Logic: Strictly 4 rows per column before shifting right.
 */
exports.generatePDF = async (rows, options) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ 
      margin: 0, 
      size: 'A4', 
      layout: 'landscape' 
    });
    
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    const mmToPt = 2.83465;
    const sizes = {
      small: { width: 31 * mmToPt, height: 29.48 * mmToPt },
      big: { width: 65.44 * mmToPt, height: 29.61 * mmToPt }
    };

    const startX = 50;
    const startY = 50;
    let currentX = startX;
    let currentY = startY;
    
    doc.lineWidth(0.1); 

    const bigBoxes = rows.filter(r => r.size === 'big');
    const smallBoxes = rows.filter(r => r.size === 'small');

    // --- BIG Boxes (4 per column) ---
    doc.font('Helvetica-Bold').fontSize(9);
    bigBoxes.forEach((item, index) => {
      const { width, height } = sizes.big;
      
      if (index > 0 && index % 4 === 0) {
        currentY = startY;
        currentX += width; 
      }

      doc.rect(currentX, currentY, width, height).stroke();
      doc.text(item.label.toUpperCase(), currentX + 2, currentY + (height / 2) - 4, {
        width: width - 4,
        align: 'center'
      });

      currentY += height; 
    });

    // --- SMALL Boxes (4 per column) ---
    if (bigBoxes.length > 0) {
        currentX += sizes.big.width;
    }
    currentY = startY; 
    
    doc.fontSize(7);
    smallBoxes.forEach((item, index) => {
      const { width, height } = sizes.small;

      if (index > 0 && index % 4 === 0) {
        currentY = startY;
        currentX += width;
      }

      doc.rect(currentX, currentY, width, height).stroke();
      doc.text(item.label.toUpperCase(), currentX + 2, currentY + (height / 2) - 3, {
        width: width - 4,
        align: 'center'
      });

      currentY += height; 
    });

    // --- Footer ---
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`OA: ${options.oa} | ${options.footerText}`, 0, 550, {
      width: 842,
      align: 'center'
    });

    doc.end();
  });
};