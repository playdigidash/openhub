import React, { useState } from 'react';
import './CombinedApp.css';
import MeshyApp from './MeshyApp';
import ModelViewer from './ModelViewer';

function CombinedApp() {
  const [currentModel, setCurrentModel] = useState(null);

  const handleModelGenerated = (modelUrl) => {
    setCurrentModel(modelUrl);
  };

  return (
    <div className="combined-app">
    <h1 className="app-title">MESHY APP</h1>
      <div className="app-content">
        <div className="left-side">
          <MeshyApp onModelGenerated={handleModelGenerated} />
        </div>
        <div className="right-side">
          <ModelViewer modelUrl={currentModel} />
        </div>
      </div>
    </div>
  );
}

export default CombinedApp;