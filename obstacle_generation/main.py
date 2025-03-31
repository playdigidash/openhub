import csv
import time
import os
import subprocess
from send_to_claude import send_to_claude

CSV_FILE = r"C:\Users\venkat\Downloads\LID VIZION\GLB\Obstacles\obstacle_prompts.csv"
OUTPUT_DIR = r"C:/Users/venkat/Downloads/LID VIZION/GLB/Obstacles/"
os.makedirs(OUTPUT_DIR, exist_ok=True)

blender_path = r"C:\Program Files\Blender Foundation\Blender 4.3\blender.exe"

def main():
    with open(CSV_FILE, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            prompt_id = row['id']
            prompt = row['prompt']

            print(f"\n🔧 Generating obstacle {prompt_id}: {prompt}")

            # Get Blender code from Claude
            blender_code = send_to_claude(prompt)

            # Define export path
            glb_filename = f"obstacle_{prompt_id}.glb"
            glb_path = os.path.join(OUTPUT_DIR, glb_filename).replace("\\", "/")

            print(f"📦 Export path: {glb_path}")

            # Replace default filename in Claude's script with actual path
            if "Obstacle.glb" in blender_code:
                blender_code = blender_code.replace("Obstacle.glb", glb_path)
            elif '"Obstacle.glb"' in blender_code:
                blender_code = blender_code.replace('"Obstacle.glb"', f'"{glb_path}"')

            # Write Blender script to a file
            script_filename = f"blender_script_{prompt_id}.py"
            script_path = os.path.abspath(script_filename)
            with open(script_path, "w", encoding="utf-8") as script_file:
                script_file.write(blender_code)

            # Optional: print part of the script for debugging
            print(f"🧠 Blender script preview:\n{blender_code[:200]}...\n")

            # Run Blender
            try:
                subprocess.run([blender_path, "--background", "--python", script_path], check=True)
                print(f"✅ Obstacle {prompt_id} saved as {glb_filename}")
            except subprocess.CalledProcessError as e:
                print(f"❌ Failed to generate obstacle {prompt_id}: {e}")

            time.sleep(5)

if __name__ == "__main__":
    main()
