import React, { useState, useEffect } from 'react';
import { getImageTo3DTask } from '../services/meshyApi';
import './TaskStatus.css'; // Make sure to create this CSS file

function TaskStatus({ taskId, onTaskCompleted, onProgressUpdate }) {
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const taskData = await getImageTo3DTask(taskId);
        setTask(taskData);

        if (taskData.status === 'SUCCEEDED') {
          onTaskCompleted(taskData);
        } else {
          const progressPercentage = taskData.progress || 0;
          onProgressUpdate(progressPercentage);
          
          if (taskData.status === 'PROCESSING' || taskData.status === 'IN_PROGRESS') {
            setTimeout(checkStatus, 5000);
          }
        }
      } catch (error) {
        console.error('Error checking task status:', error);
        setError('Failed to fetch task status. Please try again.');
      }
    };

    checkStatus();
  }, [taskId, onTaskCompleted, onProgressUpdate]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!task) {
    return <div>Loading task status...</div>;
  }

  return (
    <div className="task-status">
      <h3>Task Status: {task.status}</h3>
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${task.progress}%` }}
        ></div>
      </div>
      <p>Progress: {task.progress}%</p>
      {task.status === 'SUCCEEDED' && task.result && (
        <div className="download-links">
          <p>3D Model is ready!</p>
          <a href={task.result.glb} target="_blank" rel="noopener noreferrer">Download GLB</a>
          <a href={task.result.fbx} target="_blank" rel="noopener noreferrer">Download FBX</a>
          <a href={task.result.usdz} target="_blank" rel="noopener noreferrer">Download USDZ</a>
        </div>
      )}
    </div>
  );
}

export default TaskStatus;