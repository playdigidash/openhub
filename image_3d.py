import requests
import os
import time
from dotenv import load_dotenv

# Load your environment variables
load_dotenv()
API_KEY = os.getenv("MESHY_API_KEY")

# Define a valid public image URL
image_url = "https://i.pinimg.com/736x/e2/7f/e5/e27fe5b06bc777a7832b9b9e8e5ce291.jpg"  # Replace with a valid image URL

# Create a function to generate the 3D model
def create_3d_model(image_url):
    url = "https://api.meshy.ai/v1/image-to-3d"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "image_url": image_url,
        "enable_pbr": True,
        "ai_model": "meshy-4"
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 202:
        # Get the task ID
        task_id = response.json()['result']
        print("Task Created. Task ID:", task_id)
        return task_id
    else:
        print("Error:", response.status_code, response.json())
        return None

# Function to check the status of the task
def check_task_status(task_id):
    url = f"https://api.meshy.ai/v1/image-to-3d/{task_id}"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
    }

    while True:
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            result = response.json()
            print("Task Status:", result['status'])
            if result['status'] in ['SUCCEEDED', 'FAILED', 'EXPIRED']:
                # Task has finished
                return result
        else:
            print("Error fetching task status:", response.status_code, response.json())

        # Wait for a few seconds before checking again
        time.sleep(5)

# Execute the functions
task_id = create_3d_model(image_url)
if task_id:
    task_result = check_task_status(task_id)
    print("Final Task Result:", task_result)
