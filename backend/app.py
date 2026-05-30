from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os
import uuid
import base64
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
RESULT_FOLDER = os.path.join(BASE_DIR, "results")
MODEL_PATH = os.path.join(BASE_DIR, "models", "tomato_best.pt")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

model = YOLO(MODEL_PATH)


def extract_detections(results):
    detections = []

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            confidence = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append({
                "class": class_name,
                "confidence": round(confidence, 3),
                "bbox": [round(x1), round(y1), round(x2), round(y2)]
            })

    return detections


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Tomato YOLO API is running"})


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "Aucune image envoyée"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Nom de fichier vide"}), 400

    filename = str(uuid.uuid4()) + "_" + file.filename
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(image_path)

    image = cv2.imread(image_path)

    if image is None:
        return jsonify({"error": "Image invalide"}), 400

    height, width = image.shape[:2]

    results = model.predict(
        source=image_path,
        conf=0.25,
        save=True,
        project=RESULT_FOLDER,
        name="predictions",
        exist_ok=True
    )

    detections = extract_detections(results)

    return jsonify({
        "filename": filename,
        "image_width": width,
        "image_height": height,
        "total_detections": len(detections),
        "detections": detections
    })


@app.route("/predict-frame", methods=["POST"])
def predict_frame():
    data = request.get_json()

    if not data or "image" not in data:
        return jsonify({"error": "Aucune frame envoyée"}), 400

    try:
        image_data = data["image"]

        if "," in image_data:
            image_data = image_data.split(",")[1]

        image_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Frame invalide"}), 400

        height, width = frame.shape[:2]

        results = model.predict(
            source=frame,
            conf=0.25,
            verbose=False
        )

        detections = extract_detections(results)

        return jsonify({
            "image_width": width,
            "image_height": height,
            "total_detections": len(detections),
            "detections": detections
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)