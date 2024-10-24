import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function ModelViewer({ generatedModelUrl }) {
  const [uploadedModel, setUploadedModel] = useState(null);
  const [currentModelUrl, setCurrentModelUrl] = useState(null);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('File selected:', file);
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      console.log('Setting uploaded model');
      setUploadedModel(file);
    } else {
      alert('Please upload a .glb or .gltf file');
    }
  };

  useEffect(() => {
    if (generatedModelUrl) {
      setCurrentModelUrl(generatedModelUrl);
    } else if (uploadedModel) {
      setCurrentModelUrl(URL.createObjectURL(uploadedModel));
    } else {
      setCurrentModelUrl(null);
    }
  }, [generatedModelUrl, uploadedModel]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    }

    );

    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;
    mountRef.current.appendChild(renderer.domElement);


    // In your initial scene setup useEffect

    camera.position.set(2, 2, 5); // Set an initial camera position
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 3); // Changed color to white and increased intensity
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5); // Increased intensity
    directionalLight.position.set(5, 5, 5); // Adjusted position
    directionalLight.castShadow = true;
    scene.add(directionalLight); 

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight2.position.set(-5, 5, -5);
    directionalLight2.castShadow = true;
    scene.add(directionalLight2);


    // Add more lights for better coverage
    const pointLight = new THREE.PointLight(0xffffff, 5);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);

    // Optional: Add a hemisphere light for more natural lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(hemisphereLight);

    scene.background = new THREE.Color(0xffffff); // White background

    // scene.background = new THREE.Color(0x000000);  //Black background

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    camera.position.z = 5;

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    }
    window.addEventListener('resize', onWindowResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!currentModelUrl || !sceneRef.current) return;
  
    console.log('Loading model:', currentModelUrl);
  
    const loader = new GLTFLoader();
    
    loader.load(
      currentModelUrl,
      (gltf) => {
        console.log('Model loaded:', gltf);
  
        // Remove existing model if any
        while(sceneRef.current.children.length > 0){ 
          sceneRef.current.remove(sceneRef.current.children[0]); 
        }
  
        // Add lights back
        const ambientLight = new THREE.AmbientLight(0xffffff, 3);
        sceneRef.current.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        sceneRef.current.add(directionalLight);
        
        
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
        directionalLight2.position.set(-5, 5, -5);
        directionalLight2.castShadow = true;
        sceneRef.current.add(directionalLight2);

        const pointLight = new THREE.PointLight(0xffffff, 5);
        pointLight.position.set(-5, 5, -5);
        sceneRef.current.add(pointLight);
  
        // Traverse the model and set material properties if needed
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material.needsUpdate = true;
            // Optional: Enhance material properties
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
 
        // Add the model to the scene
        sceneRef.current.add(gltf.scene);
  
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
  
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim; // Increased scale factor
        gltf.scene.scale.set(scale, scale, scale);
  
        gltf.scene.position.sub(center.multiplyScalar(scale));
  
        console.log('Model position:', gltf.scene.position);
        console.log('Model scale:', gltf.scene.scale);
      },
      undefined,
      (error) => {
        console.error('An error occurred loading the model:', error);
      }
    );
  
  }, [currentModelUrl]);

  return (
    <div>
      <h2>3D Model Viewer</h2>
      <input
        type="file"
        accept=".glb,.gltf"
        onChange={handleFileUpload}
      />
      <div ref={mountRef} 
        style={{ 
        marginTop: '120px',
        width: '100px',  // 100% of viewport width
        height: '100px', // 100% of viewport height
        border: '2px solid #ccc',
        // position: 'absolute', // Add this to ensure full coverage
        left: 0,           // Add this to ensure full coverage
        top: 0,            // Add this to ensure full coverage 
      }} 
      />
      {!currentModelUrl && <p>No model selected. Please upload a .glb or .gltf file, or click on a generated image.</p>}
    </div>
  );
}

export default ModelViewer;

        
        
// ***********Another Way of Implementing 3D Modal Viewer*************************


// import React, { Suspense, useState } from 'react';
// import './App.css'
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei';
// // import Background from 'three/src/renderers/common/Background.js';
// // import { BackgroundTexture } from 'three';

// function ModelViewer({ modelUrl }) {
//   const { scene } = useGLTF(modelUrl);
//   return <primitive object={scene} scale={2.5} />;
// }

// function App() {
//   const [modelUrl, setModelUrl] = useState(null);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setModelUrl(url);
//     }
//   };

//   return (
//     <div className="Model" style={{ height: '100vh', textAlign: 'Center'}}>
//       <h1>3D Object Viewer</h1>
//       <h3>Please upload an 3D Object file in File Uploader to view your 3D object</h3>
//       <input type="file" accept=".glb,.gltf" onChange={handleFileUpload} className='file-input'/>
//       <Canvas>
//         <Suspense fallback={null}>
//           <ambientLight intensity={1.0} />
//           <directionalLight intensity={1.5} position={[2, 5, 2]} />
//           <pointLight intensity={0.8} position={[-5, 5, 5]} />
//           <pointLight intensity={0.5} position={[5, -5, -5]} />
          
//           <Environment preset="sunset" />
//           {modelUrl && <ModelViewer modelUrl={modelUrl} />}
//           <OrbitControls autoRotate />
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }

// export default App;