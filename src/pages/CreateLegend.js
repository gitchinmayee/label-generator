import React, { useState } from "react";
import Layout from "../components/Layout";
import PreviewGrid from "../components/PreviewGrid";
import BASE_URL from "../api";
import "../styles/create.css";

export default function CreateLegend() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [oa, setOA] = useState("");
  const [instructions, setInstructions] = useState("");

  // PREVIEW
  const handlePreview = async () => {
    if (!file) return alert("Select file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/preview`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      setPreview(data);
    } catch (err) {
      alert("Preview error");
    }
  };

  // PDF
  const handleGenerate = async () => {
    if (!file) return alert("Select file first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("oa", oa);
    formData.append("instructions", instructions);

    try {
      const res = await fetch(`${BASE_URL}/generate-pdf`, {
        method: "POST",
        body: formData,
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      alert("PDF error");
    }
  };

  return (
    <Layout>
      <div className="card">
        <h2>Create Legends</h2>

        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={handlePreview}>Preview</button>

        <input
          placeholder="OA Number"
          value={oa}
          onChange={e => setOA(e.target.value)}
        />

        <input
          placeholder="Instructions"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
        />

        <button onClick={handleGenerate}>Generate PDF</button>
      </div>

      {preview.length > 0 && (
        <div className="preview-section">
          <h3>Preview</h3>
          <PreviewGrid data={preview} />
        </div>
      )}
    </Layout>
  );
}