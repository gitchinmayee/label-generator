import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import BASE_URL from "../api";
import "../styles/approved.css";

export default function Approved() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/history`)
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <Layout>
      <div className="approved-card">
        <h2>Approved Legends</h2>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Model</th>
              <th>Legends Info</th>
              <th>OA</th>
              <th>Instructions</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map(item => (
              <tr key={item._id}>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td>{item.model || "-"}</td>
                <td>{item.data?.length} items</td>
                <td>{item.oa}</td>
                <td>{item.instructions}</td>
                <td>
                  <button onClick={() => viewPDF(item)}>
                    👁
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

function viewPDF(item) {
  alert("PDF preview can be added next");
}