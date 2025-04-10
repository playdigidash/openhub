# Claude Obstacle Generator API

This is a Flask-based API that takes text prompts, sends them to Claude (Anthropic), generates Blender Python scripts, and exports `.glb` 3D obstacle files.

---

## 💡 How It Works

- Prompts are sent to Claude 3 Haiku (`claude-3-haiku-20240307`)
- Claude returns Blender Python scripts
- Blender runs in headless mode to export `.glb` files
- Generated files are uploaded to a specific Google Drive folder (hardcoded folder ID)
- Supports retry logic and patching for Blender quirks

---

## 🚀 Run Locally

### 🧰 Requirements

- Blender 4.3 installed
- `mycreds.txt` and `client_secrets.json` for Google Drive
- Python 3.10+ installed

### 🔌 Install dependencies

```bash
pip install flask pydrive2 anthropic
