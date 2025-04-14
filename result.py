import requests
from PIL import Image

# Define the API endpoint
url = "http://127.0.0.1:5000/classify"

# Path to the image 
file_path = r"D:\C Documents\GitHub\adaptive-ui-extension\images\happy_1.png" 

try:
    # Check if the file is a valid image
    with Image.open(file_path) as img:
        print(f"Image loaded successfully: {img.format}, {img.size}, {img.mode}")

    # Send the file to the Flask API
    with open(file_path, "rb") as f:
        response = requests.post(url, files={"file": f})
        print(response.json())

except FileNotFoundError:
    print("Error: The file was not found. Check the file path.")
except Exception as e:
    print(f"Error: {e}")
