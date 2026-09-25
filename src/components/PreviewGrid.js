import React from "react";

export default function PreviewGrid({ data }) {
  const SW = 31;     // Small Width (mm)
  const SH = 29.48;  // Small Height (mm)
  const BW = 65.44;  // Big Width (mm)
  const BH = 29.61;  // Big Height (mm) - Preserving exact height parameter
  const MAX_W = 248; 

  let currentX = 0;
  let currentY = 0;
  let maxRowHeightInLine = SH;

  return (
    <div style={{ position: 'relative', width: `${MAX_W}mm`, margin: '20px auto', border: '1px solid #000', minHeight: '120mm', background: 'white' }}>
      {data.map((item, index) => {
        const isBig = item.size === 'big';
        const width = isBig ? BW : SW;
        const height = isBig ? BH : SH; // Applied correct physical height dynamically

        if (currentX + width > MAX_W + 1) {
          currentX = 0;
          currentY += maxRowHeightInLine;
          maxRowHeightInLine = height;
        }

        if (height > maxRowHeightInLine) {
          maxRowHeightInLine = height;
        }

        // Auto-shrink text style if label is too long to prevent spillover
        let dynamicFontSize = isBig ? '9pt' : '7.5pt';
        if (item.label && item.label.length > 25) {
          dynamicFontSize = isBig ? '7.5pt' : '6pt';
        }

        const boxStyle = {
          position: 'absolute',
          left: `${currentX}mm`,
          top: `${currentY}mm`,
          width: `${width}mm`,
          height: `${height}mm`,
          border: '0.1mm solid black', // Thinner box borders
          
          // Flexbox configuration ensuring multiple lines stay perfectly centered
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '1mm',
          
          fontSize: dynamicFontSize,
          fontWeight: 'bold',
          whiteSpace: 'normal', // Allows natural wrapping for multiple lines
          wordBreak: 'break-word',
          boxSizing: 'border-box'
        };

        currentX += width;

        return <div key={index} style={boxStyle}>{item.label}</div>;
      })}
    </div>
  );
}