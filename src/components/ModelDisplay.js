import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './HomePage.css'

function Model({ url }) {
  const { scene } = useGLTF(url);
  scene.scale.set(4, 4, 4);  // Scale the model to make it larger
  return <primitive object={scene} />;
}

function ModelDisplay({ modelUrl }) {
  return (
    <div className="model-container">
      <Canvas camera={{ position: [0, 0, 8] }}>  {/* Adjusted camera position to fit larger model */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, 0, 5]} intensity={1.5} />
        <pointLight position={[5, 0, 5]} intensity={1.5} />
        <pointLight position={[0, 5, 5]} intensity={1} />
        <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={4.5} />
        <Model url={modelUrl} />
      </Canvas>
    </div>
  );
}

export default ModelDisplay;
