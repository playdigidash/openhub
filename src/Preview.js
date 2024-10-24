import React from 'react';

function Preview({ thumbnailUrl, onClick }) {
  return (
    <img 
      src={thumbnailUrl} 
      alt="3D Model Preview" 
      style={{ cursor: 'pointer', maxWidth: '200px' }} 
      onClick={onClick}
    />
  );
}

export default Preview;