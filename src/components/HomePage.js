
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import ModelDisplay from './ModelDisplay';
import model from '../Assests/model.glb';

function HomePage() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Lid Vizion's Meshy 3D Hub</h1>
        <p>Convert, View, and Refine 3D Models from Images and Text in Just a Few Clicks</p>
        <div className="cta-buttons">
          <Link to="/image-to-3d" className="cta-button">Get Started with Image to 3D</Link>
          <Link to="/modelviewer" className="cta-button">Explore 3D Models</Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="features">
        <h2>Main Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>2D Image to 3D  Model</h3>
            <p>Turn any image into a high-quality 3D model.</p>
            <Link to="/image-to-3d">Learn More</Link>
          </div>
          <div className="feature-card">
            <h3>3D Model Viewer</h3>
            <p>Explore and interact with your 3D creations.</p>
            <Link to="/modelviewer">Learn More</Link>
          </div>
          <div className="feature-card">
            <h3>Text to 3D Model </h3>
            <p>Refining, Fine-tune and enhance your models for perfection.</p>
            <Link to="/MeshyApp">Learn More</Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Give any text Prompt or Image Link</h3>
            <p>Select any image to get started with conversion.</p>
          </div>
          <div className="step">
            <h3>2. Convert to 3D</h3>
            <p>Our tool transforms your image into a 3D model.</p>
          </div>
          <div className="step">
            <h3>3. Refine or View</h3>
            <p>Use the Meshy App to refine or view it in the Model Viewer.</p>
          </div>
        </div>
      </section>


      {/* User Showcase or Gallery */}
      <section className="gallery">
        <h2>See What You Can Create</h2>
        <div className="gallery-items">
          {/* These can be actual images or placeholders for demonstration */}
          {/* <img src="sample1.jpg" alt="Sample 3D Model" />
          <img src="sample2.jpg" alt="Sample 3D Model" />
          <img src="sample3.jpg" alt="Sample 3D Model" /> */}
          <ModelDisplay modelUrl={model} />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>LIDVIZION © 2024 Meshy 3D Hub. All rights reserved.</p>
        <nav className="footer-nav">
          <Link to="https://www.lidvizion.com/">LID VIZION Offical  Website</Link>
          <Link to="/">Home</Link>
          <Link to="/MeshyApp">Meshy App</Link>
          <Link to="/modelviewer">Model Viewer</Link>
          <Link to="/Meshy Image to 3D">Meshy Image to 3D</Link>
        </nav>
      </footer>
    </div>
  );
}

export default HomePage;
