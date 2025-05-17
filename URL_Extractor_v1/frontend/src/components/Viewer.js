// src/components/Viewer.js

import React, { useState } from 'react';
import axios from 'axios';

const Viewer = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleExtract = async () => {
    setError(null);
    setResult(null);
    try {
      const res = await axios.post('http://localhost:8000/extract', { url });
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data || { error: 'Something went wrong.' });
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>🌐 URL Asset Extractor</h2>
      <input
        type="text"
        style={{ width: '500px' }}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL..."
      />
      <button onClick={handleExtract} style={{ marginLeft: '10px' }}>
        Extract
      </button>

      {result && (
        <div style={{ marginTop: '30px' }}>
          <h3>Profile Image (fallback URL)</h3>
          <img
            src={result.profile_file_id
              ? `http://localhost:8000/image/${result.profile_file_id}`
              : result.profile_image}
            alt="Profile"
            style={{ width: '200px', border: '1px solid gray' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = result.profile_image;
            }}
          />

          <h3>Banner Image (from GridFS)</h3>
          <img
            src={`http://localhost:8000/image/${result.banner_file_id}`}
            alt="Banner"
            style={{ width: '400px', border: '1px solid gray' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = result.banner_image;
            }}
          />

          <h3>Extracted Text:</h3>
          <textarea
            rows={10}
            cols={100}
            value={
              result.text_preview ||
              `http://localhost:8000/text/${result.text_file_id}`
            }
            readOnly
          />
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h4>Error:</h4>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Viewer;
