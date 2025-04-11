from flask import Flask, request, jsonify
import uuid, subprocess, os, time, re, json
import anthropic
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive

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

from anthropic._exceptions import OverloadedError

# Claude Prompt with past error learning
def send_to_claude(prompt, attempt=1, past_errors=None):
    error_feedback = ""
    if past_errors:
        error_feedback = "\n\nAvoid these errors from earlier attempts:\n" + "\n\n".join(past_errors[-5:])

    print(f"🔄 Attempt {attempt} for prompt: {prompt}")
    full_prompt = f"""
You are a helpful assistant that writes Blender Python scripts.

Your task is to generate a colorful and dynamic 3D obstacle using Blender Python API based on this description:
\"{prompt}\"{error_feedback}

The script must:
- Create unique geometry based on the prompt
- Optionally include animation or transformations
- Apply at least one material or color
- Avoid using deprecated or unsupported attributes
- Always export to: bpy.ops.export_scene.gltf(filepath=\"your_file.glb\", export_format='GLB')

Only output valid Blender Python code. Do NOT include any explanation, comments, markdown, or extra text — just raw code.
"""
    try:
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1024,
            temperature=0.7,
            system="You're a Blender scripting expert.",
            messages=[{"role": "user", "content": full_prompt}]
        )
    except OverloadedError:
        print("⚠️ Claude API overloaded. Retrying in 5 seconds...")
        time.sleep(5)
        return send_to_claude(prompt, attempt + 1, past_errors)

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

    script_filename = f"blender_script_{prompt_id}.py"
    glb_filename = f"obstacle_{prompt_id}.glb"
    glb_path = os.path.abspath(glb_filename).replace("\\", "/")

    past_errors = []
    MAX_ATTEMPTS = 10

    for attempt in range(1, MAX_ATTEMPTS + 1):
        print(f"🔁 Attempt {attempt} with {len(past_errors)} past error samples.")
        blender_code = send_to_claude(prompt, attempt, past_errors)

        # Replace export filepath if needed
        blender_code = re.sub(
            r'filepath\s*=\s*"[^"]+\.glb"',
            f'filepath="{glb_path}"',
            blender_code
        )

        with open(script_filename, "w", encoding="utf-8") as f:
            f.write(blender_code)

        # Track .glb files before execution
        before_files = set(f for f in os.listdir() if f.endswith(".glb"))

        try:
            result = subprocess.run([
                r"C:\\Program Files\\Blender Foundation\\Blender 4.3\\blender.exe",
                "--background", "--python", script_filename
            ], capture_output=True, text=True, check=True)

            print("✅ Success on attempt", attempt)
            print("🌀 Blender Output:\n", result.stdout)

        except subprocess.CalledProcessError as e:
            print(f"❌ Attempt {attempt} failed.")
            print("⚠️ Blender Error Log:\n", e.stderr[-1000:])
            error_excerpt = e.stderr.strip().split("\n")[-10:]
            past_errors.append("\n".join(error_excerpt))
            continue

        # Check for actual file creation
        after_files = set(f for f in os.listdir() if f.endswith(".glb"))
        new_files = list(after_files - before_files)

        if not os.path.exists(glb_path) and new_files:
            print("⚠️ Blender saved a different .glb:", new_files[0])
            shutil.copyfile(new_files[0], glb_path)
            print("✅ Renamed", new_files[0], "→", glb_path)

        if os.path.exists(glb_path):
            break

    if os.path.exists(glb_path):
        FOLDER_ID = "170mfKhiHTy3i0SWH4EddIszxPXLDr5WS"
        glb_file = drive.CreateFile({
            'title': glb_filename,
            'parents': [{'id': FOLDER_ID}]
        })
        glb_file.SetContentFile(glb_path)

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
            "code": blender_code,
            "date": time.strftime("%Y-%m-%d %H:%M:%S")
        })
    else:
        print("❌ GLB not created.")
        print("📂 Directory contents:", os.listdir(os.getcwd()))
        return jsonify({"error": "GLB not created after retries"}), 500


if __name__ == "__main__":
    app.run(port=5000)
