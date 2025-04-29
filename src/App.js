import React, { Suspense, useState } from 'react';
import './App.css'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei';
import Background from 'three/src/renderers/common/Background.js';

function ModelViewer({ modelUrl }) {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} scale={3.5} />;
}

function App() {
  const [modelUrl, setModelUrl] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
    }
  };

  return (
    <div className="Model" style={{ height: '100vh', textAlign: 'Center'}}>
      <h1>3D Object Viewer</h1>
      <h3>Please upload an 3D Object file in File Uploader to view your 3D object</h3>
      <input type="file" accept=".glb,.gltf" onChange={handleFileUpload} className='file-input'/>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <Environment preset="sunset" />
          {modelUrl && <ModelViewer modelUrl={modelUrl} />}
          <OrbitControls autoRotate />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
