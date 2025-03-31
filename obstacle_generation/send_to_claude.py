import anthropic

# Replace this with your actual key (DO NOT share it)
client = anthropic.Anthropic(api_key="ANTHROPIC_API_KEY")

def send_to_claude(prompt):
    full_prompt = f"""
You are a helpful assistant that writes Blender Python scripts.

Your task is to generate a colorful and dynamic 3D obstacle using Blender Python API based on this description:
"{prompt}"

The script must:
- Create unique geometry based on the prompt
- Optionally include animation or transformations
- Apply at least one material or color
- Export the object as a `.glb` using: bpy.ops.export_scene.gltf

Only output valid Blender Python code. Do NOT include any explanation, comments, markdown, or extra text — just raw code.
"""

    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=1024,
        temperature=0.7,
        system="You're a Blender scripting expert.",
        messages=[
            {"role": "user", "content": full_prompt}
        ]
    )

    output = response.content[0].text

    # Filter out non-code lines Claude might add
    lines = output.splitlines()
    cleaned_lines = [
        line for line in lines
        if "image_settings.file_format" not in line
        and not line.strip().startswith("Here is")
        and not line.strip().startswith("```")
    ]
    return
