
import React, { useState } from 'react';
import './CombinedApp.css';
import MeshyApp from './MeshyApp';
import ModelViewer from './ModelViewer';
import ImageUploader from './components/ImageUploader';
import TaskStatus from './components/TaskStatus';
import ProgressBar from './components/ProgressBar';
import HomePage from './components/HomePage';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';

function DropdownMenu() {
  const navigate = useNavigate();

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      navigate(`${selectedValue}?t=${new Date().getTime()}`);  // Append a timestamp
    }
  };

  // return (
  //   <select onChange={handleChange} defaultValue="">
  //     <option value="" disabled>Please Select a model</option>
  //     <option value="/">Home</option>
  //     <option value="/MeshyApp">Meshy Text to 3D</option>
  //     <option value="/modelviewer">Model Viewer</option>
  //     <option value="/Meshy Image to 3D">Meshy Image to 3D</option>
  //   </select>
  // );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error('Captured error:', error); return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

function CombinedApp() {
  const [currentModel, setCurrentModel] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [completedTask, setCompletedTask] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleModelGenerated = (modelUrl) => {
    setCurrentModel(modelUrl);
  };

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
    <BrowserRouter>
      <div className="combined-app">
        <header className="app-header">
          <h1 className="app-title">Lid Vizion's 3D Hub</h1>
          <nav className="navbar">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/MeshyApp" className="nav-link">Text to 3D</Link>
            <Link to="/image-to-3d" className="nav-link">Image to 3D</Link>
            <Link to="/modelviewer" className="nav-link">3D Model Viewer</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/MeshyApp" element={<MeshyApp onModelSelected={handleModelGenerated} />} />
          <Route path="/modelviewer" element={<ModelViewer modelUrl={currentModel} />} />
          <Route 
            path="/image-to-3d" 
            element={
              <div className="ImageTo3D">
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
              </div>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default CombinedApp;

//   return (
//     <BrowserRouter>
//       <div className="combined-app">
//         <h1 className="app-title">MESHY APP</h1>
//         <DropdownMenu />
//         <ErrorBoundary>
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/MeshyApp" element={<MeshyApp onModelSelected={handleModelGenerated} />} />
//             <Route path="/modelviewer" element={<ModelViewer modelUrl={currentModel} />} />
//             <Route 
//               path="/Meshy Image to 3D" 
//               element={
//                 <div className="ImageTo3D">
//                   <ImageUploader onTaskCreated={handleTaskCreated} />
//                   {taskId && !completedTask && (
//                     <>
//                       <ProgressBar progress={progress} />
//                       <TaskStatus 
//                         taskId={taskId} 
//                         onTaskCompleted={handleTaskCompleted} 
//                         onProgressUpdate={handleProgressUpdate}
//                       />
//                     </>
//                   )}
//                   {completedTask && (
//                     <div className="completed-task">
//                       <h2>3D Model Ready!</h2>
//                       <p>Download links:</p>
//                       <ul className="download-links">
//                         <li><a href={completedTask.model_urls.glb} target="_blank" rel="noopener noreferrer">GLB Model</a></li>
//                         <li><a href={completedTask.model_urls.fbx} target="_blank" rel="noopener noreferrer">FBX Model</a></li>
//                         <li><a href={completedTask.model_urls.usdz} target="_blank" rel="noopener noreferrer">USDZ Model</a></li>
//                       </ul>
//                       <img src={completedTask.thumbnail_url} alt="3D Model Thumbnail" className="thumbnail" />
//                     </div>
//                   )}
//                 </div>
//               } 
//             />
//           </Routes>
//         </ErrorBoundary>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default CombinedApp;

// ******** code sucessfully implemeted without meshyimage to 3d model****

// import React, { useState } from 'react';
// import './CombinedApp.css';
// import MeshyApp from './MeshyApp';
// import ModelViewer from './ModelViewer';
// import ImageUploader from './components/ImageUploader';
// import TaskStatus from './components/TaskStatus';
// import ProgressBar from './components/ProgressBar';
// import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
// // import DropdownMenu from './components/DropdownMenu';

// function DropdownMenu() {
//   const navigate = useNavigate();

//   // const handleChange = (event) => {
//   //   console.log("Navigating to:", event.target.value); navigate(event.target.value);
//   // };


//   const handleChange = (event) => {
//     const selectedValue = event.target.value;
//     if (selectedValue) {
//       navigate(`${selectedValue}?t=${new Date().getTime()}`);  // Append a timestamp
//     }
//   };

//   return (
//     <select onChange={handleChange} defaultValue="">
//       <option value="" disabled>Please Select a model</option>
//       <option value="/MeshyApp">Meshy App</option>
//       <option value="/modelviewer">Model Viewer</option>
//       <option value="/">Meshy Image to 3D</option>
//     </select>
//   );
// }


// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     console.error('Captured error:', error); return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Error caught in Error Boundary:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <h1>Something went wrong.</h1>;
//     }

//     return this.props.children; 
//   }
// }

// function CombinedApp() {
//   const [currentModel, setCurrentModel] = useState(null);

//   const handleModelGenerated = (modelUrl) => {
//     setCurrentModel(modelUrl);
//   };

//   return (
//     <BrowserRouter>
//       <div className="combined-app">
//         <h1 className="app-title">MESHY APP</h1>
//         <DropdownMenu />
//         <ErrorBoundary>
//           <Routes>
//             <Route path="/MeshyApp" element={<MeshyApp onModelSelected={handleModelGenerated} />} />
//             <Route path="/modelviewer" element={<ModelViewer modelUrl={currentModel} />} />
//             <Route path="/" element={<div>Welcome to the Meshy App! Select an option from the dropdown.</div>} />
//           </Routes>
//         </ErrorBoundary>

//         {/* <div className="app-content">
//         <div className="left-side">
//           <MeshyApp onModelGenerated={handleModelGenerated} />
//         </div>
//         <div className="right-side">
//           <ModelViewer modelUrl={currentModel} />
//         </div>
//       </div> */}
//       </div>
//     </BrowserRouter>
//   );
// }

// export default CombinedApp;


// *****************************************************

// import React, { useState } from 'react';
// import './CombinedApp.css';
// import MeshyApp from './MeshyApp';
// import ModelViewer from './ModelViewer';
// import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
// // import DropdownMenu from './components/DropdownMenu';

// function DropdownMenu() {
//   const navigate = useNavigate();

//   const handleChange = (event) => {
//     navigate(event.target.value);
//   };

//   return (
//     <select onChange={handleChange}>
//       <option value="/MeshyApp">MeshyApp</option>
//       <option value="/modelviewer">Model Viewer</option>
//       <option value="/">Meshy Image to 3D</option>
//     </select>
//   );
// }


// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Error caught in Error Boundary:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <h1>Something went wrong.</h1>;
//     }

//     return this.props.children; 
//   }
// }

// function CombinedApp() {
//   const [currentModel, setCurrentModel] = useState(null);

//   const handleModelGenerated = (modelUrl) => {
//     setCurrentModel(modelUrl);
//   };

//   return (
//     <BrowserRouter>
//       <div className="combined-app">
//         <h1 className="app-title">MESHY APP</h1>
//         <DropdownMenu />
//         <ErrorBoundary>
//           <Routes>
//             <Route path="/MeshyApp" element={<MeshyApp onModelSelected={handleModelGenerated} />} />
//             <Route path="/modelviewer" element={<ModelViewer modelUrl={currentModel} />} />
//             <Route path="/" element={<div>Welcome to the Meshy App! Select an option from the dropdown.</div>} />
//           </Routes>
//         </ErrorBoundary>

//         {/* <div className="app-content">
//         <div className="left-side">
//           <MeshyApp onModelGenerated={handleModelGenerated} />
//         </div>
//         <div className="right-side">
//           <ModelViewer modelUrl={currentModel} />
//         </div>
//       </div> */}
//       </div>
//     </BrowserRouter>
//   );
// }

// export default CombinedApp;