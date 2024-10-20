import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import TaskStatus from './components/TaskStatus';
import ProgressBar from './components/ProgressBar';
import './App.css';

function App() {
  const [taskId, setTaskId] = useState(null);
  const [completedTask, setCompletedTask] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleTaskCreated = (newTaskId) => {
    setTaskId(newTaskId);
    setCompletedTask(null);
    setProgress(0);
  };

  const handleTaskCompleted = (taskData) => {
    setCompletedTask(taskData);
    setProgress(100);
  };

  const handleProgressUpdate = (newProgress) => {
    setProgress(newProgress);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meshy Image to 3D Converter</h1>
        <ImageUploader onTaskCreated={handleTaskCreated} />
        {taskId && !completedTask && (
          <>
            <ProgressBar progress={progress} />
            <TaskStatus 
              taskId={taskId} 
              onTaskCompleted={handleTaskCompleted} 
              onProgressUpdate={handleProgressUpdate}
            />
          </>
        )}
        {completedTask && (
          <div className="completed-task">
            <h2>3D Model Ready!</h2>
            <p>Download links:</p>
            <ul className="download-links">
              <li><a href={completedTask.model_urls.glb} target="_blank" rel="noopener noreferrer">GLB Model</a></li>
              <li><a href={completedTask.model_urls.fbx} target="_blank" rel="noopener noreferrer">FBX Model</a></li>
              <li><a href={completedTask.model_urls.usdz} target="_blank" rel="noopener noreferrer">USDZ Model</a></li>
            </ul>
            <img src={completedTask.thumbnail_url} alt="3D Model Thumbnail" className="thumbnail" />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;