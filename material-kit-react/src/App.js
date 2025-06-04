import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TriviaPage from "./pages/TriviaPage";
import MeshyPage from "./pages/MeshyPage";
import ObstaclePage from "./pages/ObstaclePage";
import { AppBar, Toolbar, Button } from "@mui/material";

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/trivia">
            Trivia
          </Button>
          <Button color="inherit" component={Link} to="/meshy">
            Meshy
          </Button>
          <Button color="inherit" component={Link} to="/obstacles">
            Obstacles
          </Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<div style={{ padding: 20 }}>Select a feature from the navbar.</div>} />
        <Route path="/trivia" element={<TriviaPage />} />
        <Route path="/meshy" element={<MeshyPage />} />
        <Route path="/obstacles" element={<ObstaclePage />} />
      </Routes>
    </Router>
  );
}

export default App;
