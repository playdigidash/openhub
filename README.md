# OpenHub

This repository brings multiple experimental features under one interface built with Material Kit React.

## Projects

### material-kit-react
The main React application with pages for PDF trivia, Meshy 3D model generation, and obstacle generation.
See [material-kit-react/README.md](./material-kit-react/README.md) for full details.

Quick start:

```bash
cd material-kit-react
npm install
npm start
```

### backend
Flask service that extracts text from PDFs and generates quiz questions with OpenAI.
Run `pip install -r requirements.txt` and `python app.py` inside the folder.

### obstacle_generation
Flask API that creates `.glb` obstacles using Claude and Blender.
See [obstacle_generation/README.md](./obstacle_generation/README.md) for setup, including ngrok instructions.

### meshy-api-app and frontend
Legacy Create React App projects kept for reference. Each folder has its own README with the default CRA commands.

## Running locally

1. Start the Flask APIs from `backend` and `obstacle_generation`.
2. Launch the unified React app from `material-kit-react`:

```bash
cd material-kit-react
npm install
npm start
```
