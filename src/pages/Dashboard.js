import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import BASE_URL from "../api";

export default function Dashboard({ onLogout, setPage, activePage, preFillData, clearPreFill }) {
  const [file, setFile] = useState(null);
  const [oaNumber, setOaNumber] = useState("");
  const [instructions, setInstructions] = useState("");
  const [bigCount, setBigCount] = useState(0);
  const [smallCount, setSmallCount] = useState(0);
  const [approverName, setApproverName] = useState("");
  const [previewData, setPreviewData] = useState([]);

  useEffect(() => {
    if (preFillData) {
      setOaNumber(preFillData.oaNumber || "");
      setInstructions(preFillData.legendsInfo || "");
      setTimeout(() => {
        alert(`Data for OA ${preFillData.oaNumber} loaded. Please re-select Excel.`);
        clearPreFill();
      }, 100);
    }
  }, [preFillData, clearPreFill]);

  const handleAction = async (endpoint, isDownload = false) => {
    if (!file) return alert("Please select an Excel file.");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bigCount", bigCount);
    formData.append("smallCount", smallCount);
    
    if (isDownload) {
      formData.append("oa", oaNumber);
      formData.append("instructions", instructions);
      formData.append("userName", localStorage.getItem("userName") || "Admin");
      formData.append("approverName", approverName);
    }

    try {
      const res = await fetch(`${BASE_URL}/${endpoint}`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      if (isDownload) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `Legend_OA_${oaNumber}.pdf`;
        document.body.appendChild(a); a.click(); a.remove();
      } else {
        const data = await res.json();
        setPreviewData(data);
      }
    } catch (err) { alert("Error: " + err.message); }
  };

  return (
    <Layout onLogout={onLogout} setPage={setPage} activePage={activePage}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginBottom: '25px', color: '#1a237e', fontWeight: '700' }}>Create Legends</h2>
        
        {/* Form Grid Layout */}
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px', 
            marginBottom: '30px' 
        }}>
          <div className="form-group">
            <label style={labelStyle}>Excel File</label>
            <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <div className="form-group">
            <label style={labelStyle}>BIG Boxes</label>
            <input type="number" className="form-control" value={bigCount} onChange={(e) => setBigCount(e.target.value)} />
          </div>
          <div className="form-group">
            <label style={labelStyle}>SMALL Boxes</label>
            <input type="number" className="form-control" value={smallCount} onChange={(e) => setSmallCount(e.target.value)} />
          </div>
          <div className="form-group">
            <label style={labelStyle}>OA Number</label>
            <input type="text" className="form-control" value={oaNumber} onChange={(e) => setOaNumber(e.target.value)} />
          </div>
          <div className="form-group">
            <label style={labelStyle}>Approver</label>
            <input type="text" className="form-control" value={approverName} onChange={(e) => setApproverName(e.target.value)} />
          </div>
          <div className="form-group">
            <label style={labelStyle}>Instructions</label>
            <input type="text" className="form-control" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <button className="btn btn-primary btn-lg me-3" onClick={() => handleAction("preview")}>Preview</button>
          <button className="btn btn-success btn-lg" onClick={() => handleAction("generate-pdf", true)}>Download PDF</button>
        </div>

        {/* Preview Section */}
        {previewData.length > 0 && (
          <div style={{ marginTop: '40px', padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '8px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
                width: '842px', 
                height: '595px', 
                backgroundColor: 'white', 
                padding: '40px', 
                position: 'relative', 
                boxShadow: '0 0 15px rgba(0,0,0,0.1)',
                boxSizing: 'border-box'
            }}>
              <div style={{ 
                  display: 'grid', 
                  gridAutoFlow: 'column', 
                  gridTemplateRows: 'repeat(4, 1fr)', 
                  columnGap: '0px', 
                  rowGap: '0px',
                  width: '100%',
                  height: 'calc(100% - 60px)'
              }}>
                {previewData.map((item, i) => {
                  const isBig = item.size === 'big';
                  const currentFontSize = item.label && item.label.length > 22 ? '8.5px' : '10.5px';

                  return (
                    <div key={i} style={{
                      // Ultra pro thin razor outline line
                      border: '0.15px solid #000000',
                      width: isBig ? '210px' : '100px', 
                      height: '48px',
                      
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center',
                      padding: '4px',
                      boxSizing: 'border-box',
                      backgroundColor: 'white',
                      
                      fontSize: currentFontSize, 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      textAlign: 'center',
                      wordBreak: 'break-word',
                      lineHeight: '1.2'
                    }}>{item.label}</div>
                  );
                })}
              </div>
              <div style={{ position: 'absolute', bottom: '25px', left: 0, right: 0, textAlign: 'center', fontWeight: 'bold', fontSize: '15px' }}>
                OA: {oaNumber} | {instructions}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#555',
    fontSize: '14px'
};