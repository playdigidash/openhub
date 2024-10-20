import React from 'react';
import UploadForm from './components/UploadForm';
import './styles.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught in ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please try again later.</h2>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Meshy Image to 3D Converter</h1>
        <p>Upload an image to create a 3D model using Meshy's API.</p>
        <ErrorBoundary>
          <UploadForm />
        </ErrorBoundary>
      </header>
    </div>
  );
}

export default App;
