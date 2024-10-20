import React, { useState } from 'react';
import { create3DTask, get3DTask } from '../api';

const UploadForm = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [modelUrl, setModelUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setProgress(0);
    setModelUrl(null); // Clear previous model link

    try {
      const newTaskId = await create3DTask(imageUrl);
      setTaskId(newTaskId);

      const interval = setInterval(async () => {
        try {
          const task = await get3DTask(newTaskId);
          setProgress(task.progress);

          if (task.status === 'SUCCEEDED') {
            setModelUrl(task.model_urls.glb);
            clearInterval(interval);
            setIsLoading(false);
          } else if (task.status === 'FAILED') {
            setError('Task failed to process');
            clearInterval(interval);
            setIsLoading(false);
          }
        } catch (error) {
          setError(`Error checking task status: ${error.message}`);
          clearInterval(interval);
          setIsLoading(false);
        }
      }, 5000);
    } catch (error) {
      setError(`Error creating 3D task: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-form">
      <h2>Upload Image to Create 3D Model</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          className="input-field"
          disabled={isLoading} // Disable input while loading
        />
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Processing...' : 'Create 3D Model'}
        </button>
      </form>
      
      {error && <p className="error-message">{error}</p>}
      {taskId && <p className="task-id">Task ID: {taskId}</p>}
      {progress > 0 && (
        <div className="progress">
          <p>Progress: {progress}%</p>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      {modelUrl && (
        <div className="model-download">
          <h3>Download 3D Model</h3>
          <a 
            href={modelUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="download-link"
          >
            Download GLB Model
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
