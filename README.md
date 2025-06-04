# OpenHub

This repository combines several features into a single React frontend.

## Unified React Frontend

The [`material-kit-react`](./material-kit-react) project contains routes for:

- Trivia generation from uploaded PDFs
- Meshy text-to-3D model generation
- Obstacle generator using the Flask API

Run the frontend locally with:

```bash
cd material-kit-react
npm install
npm start
```

Ensure the Flask services in `backend` and `obstacle_generation` are running so the pages can reach their APIs.
