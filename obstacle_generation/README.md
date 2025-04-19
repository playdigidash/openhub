# Claude 3D Obstacle Generation System – Guide

This system allows you to generate dynamic 3D `.glb` obstacle files from text prompts using **Claude (Anthropic)** + **Blender** + **Google Drive** + **Google Apps Script** + **Flask**.

---

## 📋 Project Components

### 1. Google Sheet Structure

**Sheet: `Test`**
- **Column A**: ID  
- **Column B**: Prompt (e.g., "A glowing neon cube with spikes")  
- **Column C**: Status (empty or ✅ Done)

**Sheet: `Output`**
- Stores the Claude response info:
  - UUID  
  - Original ID  
  - Object Name  
  - File URL (Google Drive)  
  - Date Generated  

---

### 2. Google Drive Folder Structure

Create two folders in Google Drive:

- **ClaudeGLBUploads**  
  - Stores generated `.glb` files  
  - Folder ID (used in Python):  
    `170mfKhiHTy3i0SWH4EddIszxPXLDr5WS`

- **ClaudeScripts** (optional)  
  - For raw Blender Python scripts

---

## 🐍 Flask API (claude_api.py)

### 🔧 Requirements

Install dependencies:
```bash
pip install flask pydrive2 anthropic
```

Ensure the following are present:
- `mycreds.txt` – created after Google Drive browser auth
- `client_secrets.json` – Google OAuth credentials
- **Blender 4.3+** installed and accessible from script

---

### ⭮️ How It Works

1. A POST request is made to `/runBlender` with a text prompt.
2. The prompt is sent to Claude (model: `claude-3-haiku-20240307`)
3. Claude returns Blender Python code.
4. Script is patched to fix known issues (e.g., `.add()`).
5. Script is saved and executed by Blender in background mode.
6. Blender exports a `.glb` file.
7. File is uploaded to Google Drive (`ClaudeGLBUploads` folder).
8. JSON response is returned with file URL, UUID, and code.

---

## 🌐 Ngrok for Local Access

To expose your local Flask app to Google Apps Script:

```bash
ngrok http 5000
```

Example URL (replace with your own):
```
https://9aef-2605-a601-ae94-b900-49d1-fe1d-57e3-6ee2.ngrok-free.app
```

Use this URL in the `sendPromptToClaude()` function in your `Test.gs`.

---

## 📄 Google Apps Script (Test.gs)

This script reads prompts from the `Test` sheet, sends them to the Flask API, and logs results in the `Output` sheet.

- Sends POST request with prompt
- Waits for Blender + Claude to generate code and `.glb`
- Appends results to Output tab
- Marks ✅ Done in the `Test` sheet

---

## 🧲 How to Run the Full Flow

1. **Start the Flask API**  
   ```bash
   python claude_api.py
   ```

2. **Start ngrok** in a separate terminal  
   ```bash
   ngrok http 5000
   ```

3. **Set up the Google Sheet**  
   - Ensure `Test` and `Output` tabs exist  
   - Enter prompts in the `Test` sheet

4. **Run the Apps Script**
   - Open Script Editor
   - Run `generateBlenderScripts()`

---

## ✅ Final Outputs

- `.glb` files and Python scripts are uploaded to Google Drive (ClaudeGLBUploads)
- Each `Test` row is marked as ✅ Done
- `Output` sheet logs:
  - UUID
  - Object name
  - Google Drive file URL
  - Timestamp

