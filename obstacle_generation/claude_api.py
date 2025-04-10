from flask import Flask, request, jsonify
import uuid, subprocess, os, time, re
import anthropic
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive
import socket
import re

app = Flask(__name__)

# Your Claude API Key here (keep secret!)
client = anthropic.Anthropic(api_key="")

# Google Drive Auth
gauth = GoogleAuth()
gauth.LoadCredentialsFile("mycreds.txt")
if gauth.credentials is None:
    gauth.LocalWebserverAuth()
elif gauth.access_token_expired:
    gauth.Refresh()
else:
    gauth.Authorize()
gauth.SaveCredentialsFile("mycreds.txt")
drive = GoogleDrive(gauth)

# Claude Prompt
def send_to_claude(prompt, attempt=1):
    print(f"🔄 Attempt {attempt} for prompt: {prompt}")
    full_prompt = f"""
You are a helpful assistant that writes Blender Python scripts.

Your task is to generate a colorful and dynamic 3D obstacle using Blender Python API based on this description:
\"{prompt}\"

The script must:
- Create unique geometry based on the prompt
- Optionally include animation or transformations
- Apply at least one material or color
- Avoid using deprecated or unsupported attributes like `emission_strength`
- Export the object as a `.glb` using: bpy.ops.export_scene.gltf

Only output valid Blender Python code. Do NOT include any explanation, comments, markdown, or extra text — just raw code.
"""
    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=1024,
        temperature=0.7,
        system="You're a Blender scripting expert.",
        messages=[{"role": "user", "content": full_prompt}]
    )

    output = response.content[0].text
    print("Claude response:\n", output)
    return "\n".join([
        line for line in output.splitlines()
        if "```" not in line and not line.strip().startswith("Here is")
    ])


@app.route("/runBlender", methods=["POST"])
def run_blender():
    data = request.get_json()
    prompt = data.get("prompt", "")
    prompt_id = str(uuid.uuid4())[:8]
    if not prompt:
        return jsonify({"error": "Missing prompt"}), 400

    max_attempts = 3
    blender_code = None

    for attempt in range(1, max_attempts + 1):
        blender_code = send_to_claude(prompt, attempt)

        # Patch known bad lines
        bad_snippets = [
            ".emit", ".emission_color", 'inputs["Transmission"]',
            ".emission_strength", 'bpy.ops.anim.keyframe_insert_menu',
            'bpy.ops.wm.redraw_timer'
        ]
        patched_lines = []
        for line in blender_code.splitlines():
            if any(bad in line for bad in bad_snippets):
                patched_lines.append(f"# ⚠️ PATCHED: {line}")
            elif ".add()" in line:
                patched_lines.append(re.sub(r"\.add\(\)", ".add(1)", line))  # Fix for keyframe add
            else:
                patched_lines.append(line)
        final_code = "\n".join(patched_lines)

        # File paths
        script_filename = f"blender_script_{prompt_id}.py"
        glb_filename = f"obstacle_{prompt_id}.glb"
        glb_path = os.path.abspath(glb_filename).replace("\\", "/")
        final_code = re.sub(r'filepath\s*=\s*"[^"]+\.glb"', f'filepath="{glb_path}"', final_code)

        print("📁 Exporting GLB to:", glb_path)

        with open(script_filename, "w", encoding="utf-8") as f:
            f.write(final_code)

        try:
            result = subprocess.run([
                r"C:\Program Files\Blender Foundation\Blender 4.3\blender.exe",
                "--background", "--python", script_filename
            ], capture_output=True, text=True, check=True)

            print("🌀 Blender Output:\n", result.stdout)
            print("⚠️ Blender Errors:\n", result.stderr)
        except subprocess.CalledProcessError as e:
            print("🔥 Blender execution failed.")
            continue

        if os.path.exists(glb_path):
            # ✅ Upload to specific Drive folder
            FOLDER_ID = "170mfKhiHTy3i0SWH4EddIszxPXLDr5WS"
            glb_file = drive.CreateFile({
                'title': glb_filename,
                'parents': [{'id': FOLDER_ID}]
            })
            glb_file.SetContentFile(glb_path)

            # ⏳ Retry upload on failure
            MAX_UPLOAD_RETRIES = 3
            for retry in range(MAX_UPLOAD_RETRIES):
                try:
                    glb_file.Upload()
                    print("✅ Uploaded to Google Drive.")
                    break
                except Exception as e:
                    print(f"⏳ Upload failed (Attempt {retry+1}): {e}")
                    time.sleep(3)
            else:
                return jsonify({"error": "Google Drive upload failed after retries"}), 500

            return jsonify({
                "uuid": prompt_id,
                "objectName": f"Obstacle {prompt_id}",
                "fileUrl": glb_file['alternateLink'],
                "code": final_code,
                "date": time.strftime("%Y-%m-%d %H:%M:%S")
            })

        else:
            print("❌ GLB not created.")
            print("📂 Directory contents:", os.listdir(os.getcwd()))

    return jsonify({"error": "GLB not created after retries"}), 500


if __name__ == "__main__":
    app.run(port=5000)