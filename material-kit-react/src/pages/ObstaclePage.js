import React, { useState } from "react";
import axios from "axios";

function ObstaclePage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://127.0.0.1:5000/runBlender", { prompt });
      setResult(res.data);
    } catch (err) {
      setError("Failed to generate obstacle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Obstacle Generator</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={prompt}
          placeholder="Enter obstacle description"
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div>
          <p>Object Name: {result.objectName}</p>
          <a href={result.fileUrl} target="_blank" rel="noopener noreferrer">
            Download GLB
          </a>
        </div>
      )}
    </div>
  );
}

export default ObstaclePage;
