import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import BASE_URL from "../api";

export default function History({ onLogout, setPage, activePage, onReuse }) {
  const [history, setHistory] = useState([]);

  const fetchHistory = () => {
    fetch(`${BASE_URL}/history`)
      .then(res => res.json())
      .then(setHistory)
      .catch(err => console.error("Error:", err));
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const res = await fetch(`${BASE_URL}/history/${id}`, { method: 'DELETE' });
        if (res.ok) fetchHistory();
      } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <Layout onLogout={onLogout} setPage={setPage} activePage={activePage}>
      <div className="card p-4">
        <h2>Printing History</h2>
        <table className="table table-hover mt-3">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>OA Number</th>
              <th>Instructions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <tr key={item._id}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.oaNumber}</td>
                <td>{item.legendsInfo}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => onReuse(item)}>Reuse</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}