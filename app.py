from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
from ultralytics import YOLO
import torch
import cv2

# Initialize Flask app
app = Flask(__name__)

<<<<<<< HEAD
# Load the trained model
model_path = r"best.pt"
=======
# Load the trained model using the YOLO class
model_path = r"best.pt"  
>>>>>>> parent of 8bb45ff1 (lfs1)
model = YOLO(model_path)  

# Define labels
labels = {0: 'Anger', 1: 'Happy', 2: 'Neutral', 3: 'Sad', 4: 'Surprise'}

# Define color mapping for expressions
colors = {
    "Anger": "#FB0205",
    "Happy": "#FDFF5E",
    "Neutral": "#FFFFFF",
    "Sad": "#5151FF",
    "Surprise": "#5ABDFE"
}

# Improved Haar face detection
def crop_face(image):
    gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt2.xml')

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,   # more sensitive
        minNeighbors=3,    # less strict
        minSize=(30, 30)   # smaller faces
    )

    if len(faces) == 0:
        print("No face detected.")
        return None

    (x, y, w, h) = faces[0]
    print(f"Face found at: x={x}, y={y}, w={w}, h={h}")
    return image.crop((x, y, x + w, y + h))

# Root endpoint
@app.route('/')
def home():
    return jsonify({"message": "Facial Expression Recognition API is running!"})

# Endpoint to classify emotion
@app.route('/classify', methods=['POST'])
def classify():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        # Load and convert image
        img = Image.open(file).convert('RGB')

        # Crop to face
        face = crop_face(img)
        if face is None:
            return jsonify({"error": "No face detected in the image"}), 400

        # Resize and preprocess for YOLO
<<<<<<< HEAD
        img = face.resize((48,48))
        img_array = np.mean(np.array(img), axis=2).astype(np.uint8)  # Convert to grayscale 
        rgb_img_array = cv2.cvtColor(img_array, cv2.COLOR_GRAY2RGB)  # Convert to RGB for YOLO
        
        # Predict emotion
        results = model.predict(source=rgb_img_array, conf=0.1, verbose=False)
=======
        img = face.resize((640, 640))
        img_array = np.array(img) / 255.0
        img_tensor = np.transpose(img_array, (2, 0, 1))
        img_tensor = torch.tensor(img_tensor).unsqueeze(0).float()

        # Predict emotion
        results = model.predict(source=img_tensor, conf=0.1, verbose=False)
>>>>>>> parent of 8bb45ff1 (lfs1)
    
        # Check if predictions exist
        if not results[0].boxes or len(results[0].boxes.cls) == 0:
            return jsonify({"error": "No predictions were made by the model."}), 400

        # Extract the predicted class
        predicted_class = int(results[0].boxes.cls[0].item())
        emotion = labels[predicted_class]
        color = colors[emotion]

        # Return emotion and color
        return jsonify({"emotion": emotion, "color": color})

    except Exception as e:
        return jsonify({"error": f"Processing error: {str(e)}"}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
