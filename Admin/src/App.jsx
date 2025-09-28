import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Import CSS file

export default function AdminUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("❌ Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(`✅ ${res.data.message} | Questions: ${res.data.count}`);
    } catch (err) {
      setMessage("❌ Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h1>Admin Upload Panel</h1>

        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="file-input"
          />

          <button type="submit" disabled={loading} className="upload-btn">
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </form>

        {message && <p className={`message ${message.startsWith("✅") ? "success" : "error"}`}>{message}</p>}
      </div>
    </div>
  );
}
