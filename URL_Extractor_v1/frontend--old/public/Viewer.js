
import React, { useState } from 'react';
import axios from 'axios';

const Viewer = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/extract', { url });
      setResult(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error extracting assets.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>URL Asset Extractor</h1>
      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '60%', marginRight: '1rem' }}
      />
      <button onClick={handleSubmit}>Extract</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result?.profile_file_id && (
        <div>
          <h3>Profile Image</h3>
          <img src={`http://localhost:8000/image/${result.profile_file_id}`} alt="Profile" width="300" />
        </div>
      )}

      {result?.banner_file_id && (
        <div>
          <h3>Banner Image</h3>
          <img src={`http://localhost:8000/image/${result.banner_file_id}`} alt="Banner" width="300" />
        </div>
      )}

      {result?.text_file_id && (
        <div>
          <h3>Extracted Text</h3>
          <iframe
            src={`http://localhost:8000/text/${result.text_file_id}`}
            width="100%"
            height="400px"
            title="Text Content"
          />
        </div>
      )}
    </div>
  );
};

export default Viewer;
