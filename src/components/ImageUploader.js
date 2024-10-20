import React, { useState } from 'react';
import { createImageTo3DTask } from '../services/meshyApi';

function ImageUploader({ onTaskCreated, onError }) {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidUrl(imageUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log('Submitting image URL:', imageUrl);

    try {
      console.log('Calling createImageTo3DTask');
      const result = await createImageTo3DTask(imageUrl);
      console.log('Task created successfully:', JSON.stringify(result, null, 2));
      
      // Reshape the response to match expected structure
      const taskData = { task_id: result.result };
      console.log('Reshaped task data:', JSON.stringify(taskData, null, 2));
      
      onTaskCreated(taskData.task_id);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Failed to create task: ' + err.message);
      if (onError) onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="imageUrlInput">Image URL:</label>
      <input
        id="imageUrlInput"
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Enter image URL"
        required
      />
      <button type="submit" disabled={isLoading || !imageUrl.trim()}>
        {isLoading ? 'Converting...' : 'Convert to 3D'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default ImageUploader;