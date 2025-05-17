import React, { useState } from 'react';
import axios from 'axios';

function Viewer() {
  const [url, setUrl] = useState('');
  const [profileImgUrl, setProfileImgUrl] = useState('');
  const [bannerImgUrl, setBannerImgUrl] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/extract_assets', { url });

      if (res.data) {
        const { profile_image, banner_image, text_file_id } = res.data;

        if (profile_image) {
          setProfileImgUrl(`http://localhost:8000/image/${profile_image}`);
        }

        if (banner_image) {
          setBannerImgUrl(`http://localhost:8000/image/${banner_image}`);
        }

        if (text_file_id) {
          const textRes = await axios.get(`http://localhost:8000/text/${text_file_id}`);
          setText(textRes.data.text);
        } else {
          setText("No text extracted.");
        }
      }
    } catch (err) {
      console.error(err);
      setText("Error extracting assets.");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🌐 URL Asset Extractor</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: '60%', padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '1rem' }}>Extract Assets</button>
      </form>

      <div style={{ marginTop: '2rem' }}>
        {profileImgUrl && (
          <div>
            <h3>🖼 Profile Image</h3>
            <img src={profileImgUrl} alt="Profile" style={{ width: '300px' }} />
          </div>
        )}

        {bannerImgUrl && (
          <div style={{ marginTop: '2rem' }}>
            <h3>🖼 Banner Image</h3>
            <img src={bannerImgUrl} alt="Banner" style={{ width: '100%', maxWidth: '800px' }} />
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <h3>📄 Extracted Content</h3>
          <div style={{ whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '1rem' }}>{text}</div>
        </div>
      </div>
    </div>
  );
}

export default Viewer;
