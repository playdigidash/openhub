import React from "react";
import * as ReactDOMClient from "react-dom/client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App"; // Assuming App.js is in the same folder
import theme from "./theme"; // Import the theme from theme.js

// Ensure the root container element exists in the DOM
const container = document.getElementById("root");

if (container) {
  // Create a root using React 18's new root API
  const root = ReactDOMClient.createRoot(container);

  root.render(
      
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
  );
} else {
  console.error("Root container not found in the DOM.");
}
