const PDFDocument = require('pdfkit');

/**
 * Generates a Landscape A4 PDF using original vertical column logic loops.
 * Applies automatic layout balancing constraints to keep boxes from touching the paper edges.
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
    
    // Original base dimension values
    let baseSmallWidth = 31 * mmToPt;
    let baseSmallHeight = 29.48 * mmToPt;
    let baseBigWidth = 65.44 * mmToPt;
    let baseBigHeight = 29.61 * mmToPt;

    const bigBoxes = rows.filter(r => r.size === 'big');
    const smallBoxes = rows.filter(r => r.size === 'small');

    // 📐 PRE-CALCULATE WIDTH: Check how many horizontal columns will exist
    const bigCols = Math.ceil(bigBoxes.length / 4);
    const smallCols = Math.ceil(smallBoxes.length / 4);
    const totalGridWidth = (bigCols * baseBigWidth) + (smallCols * baseSmallWidth);

    // Landscape A4 Maximum Safe Horizontal Area (Leaves 40pt safe margin on each side)
    const maxAllowedWidth = 842 - 80; 
    let scalingFactor = 1.0;

    // If grid size overflows the target boundaries, compute safe reduction scales
    if (totalGridWidth > maxAllowedWidth) {
      scalingFactor = maxAllowedWidth / totalGridWidth;
    }

    // Apply the safety scale factor
    const sizes = {
      small: { width: baseSmallWidth * scalingFactor, height: baseSmallHeight },
      big: { width: baseBigWidth * scalingFactor, height: baseBigHeight }
    };

    // Center the grid perfectly within the page container width using calculated padding offsets
    const computedGridWidth = (bigCols * sizes.big.width) + (smallCols * sizes.small.width);
    const startX = (842 - computedGridWidth) / 2;
    const startY = 55;

    let currentX = startX;
    let currentY = startY;
    
    // Ultra pro thinner hairline border vector scale
    doc.lineWidth(0.15); 

    // --- BIG Boxes (Original loop structural math) ---
    bigBoxes.forEach((item, index) => {
      const { width, height } = sizes.big;
      
      if (index > 0 && index % 4 === 0) {
        currentY = startY;
        currentX += width; 
      }

      doc.rect(currentX, currentY, width, height).stroke();
      
      const textLabel = (item.label || 'SPARE').toUpperCase();
      let computedFontSize = textLabel.length > 22 ? 7 : 8.5;
      doc.font('Helvetica-Bold').fontSize(computedFontSize);

      const textHeight = doc.heightOfString(textLabel, { width: width - 6 });
      const centerY = currentY + (height / 2) - (textHeight / 2);

      doc.text(textLabel, currentX + 3, centerY, {
        width: width - 6,
        align: 'center'
      });

      currentY += height; 
    });

    // --- SMALL Boxes (Original loop structural math) ---
    if (bigBoxes.length > 0 && bigBoxes.length % 4 !== 0) {
      // Catch alignment case if big boxes layout breaks early
      currentX += sizes.big.width;
    } else if (bigBoxes.length > 0) {
      currentX += sizes.big.width;
    }
    currentY = startY; 
    
    smallBoxes.forEach((item, index) => {
      const { width, height } = sizes.small;

      if (index > 0 && index % 4 === 0) {
        currentY = startY;
        currentX += width;
      }

      doc.rect(currentX, currentY, width, height).stroke();
      
      const textLabel = (item.label || 'SPARE').toUpperCase();
      let computedFontSize = textLabel.length > 22 ? 5.5 : 7;
      doc.font('Helvetica-Bold').fontSize(computedFontSize);

      const textHeight = doc.heightOfString(textLabel, { width: width - 4 });
      const centerY = currentY + (height / 2) - (textHeight / 2);

      doc.text(textLabel, currentX + 2, centerY, {
        width: width - 4,
        align: 'center'
      });

      currentY += height; 
    });

    // --- Central Footer Layout ---
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`OA: ${options.oa} | ${options.footerText}`, 0, 535, {
      width: 842,
      align: 'center'
    });

    doc.end();
  });
};