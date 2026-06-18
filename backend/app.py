# ==========================================================
# Contribution: Omayma Ajahoud
# Role:
# - YOLOv8 model integration
# - Image prediction API
# - Webcam frame prediction API
# - Bounding boxes response
#
# Contribution: Laila Ililou
# Role:
# - Detection history system
# - JSON storage of predictions
# - /history API endpoint
#
# Contribution: L'BREK Oumaima
# Role:
# - Dashboard backend compatibility
# - Aggregated detection fields for analytics
# - History record structure for dashboard statistics
# ==========================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from datetime import datetime
import os
import uuid
import base64
import cv2
import numpy as np
import json

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
RESULT_FOLDER = os.path.join(BASE_DIR, "results")
MODEL_PATH = os.path.join(BASE_DIR, "models", "best_tomato_yolov8.pt")
HISTORY_FILE = os.path.join(BASE_DIR, "history.json")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump([], f, indent=4)

model = YOLO(MODEL_PATH)

# ==========================================================
# CLASSES YOLOV8
# ==========================================================
CLASSES = [
    "anthracnose",
    "blossom end rot",
    "healthy tomato",
    "spotted wilt virus"
]

# ==========================================================
# HISTORY
# ==========================================================
def load_history():
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except Exception:
        return []

def save_history(data):
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# ==========================================================
# DETECTIONS
# ==========================================================
def extract_detections(results):
    detections = []

    for r in results:
        if not hasattr(r, "boxes") or r.boxes is None:
            continue

        for box in r.boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            class_name = model.names[cls] if cls in model.names else str(cls)

            detections.append({
                "class": class_name,
                "confidence": round(conf, 3),
                "bbox": [round(x1), round(y1), round(x2), round(y2)]
            })

    return detections

def count_classes(detections):
    def count(keyword):
        return sum(1 for d in detections if keyword in d["class"].lower())

    anthracnose = count("anthracnose")
    blossom = count("blossom")
    healthy = count("healthy")
    virus = count("spotted")

    return anthracnose, blossom, healthy, virus

def save_detection_to_history(filename, detections):
    history = load_history()

    anthracnose, blossom, healthy, virus = count_classes(detections)

    avg_conf = (
        sum(d["confidence"] for d in detections) / len(detections)
        if detections else 0
    )

    record = {
        "id": len(history) + 1,
        "timestamp": datetime.now().isoformat(),
        "filename": filename,
        "totalDetections": len(detections),
        "anthracnose": anthracnose,
        "blossomEndRot": blossom,
        "healthy": healthy,
        "spottedWiltVirus": virus,
        "averageConfidence": round(avg_conf, 3)
    }

    history.append(record)
    save_history(history)

    return record

# ==========================================================
# HOME
# ==========================================================
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "YOLOv8 Tomato API running"
    })

# ==========================================================
# IMAGE PREDICTION
# ==========================================================
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filename = f"{uuid.uuid4()}_{file.filename}"
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)

    img = cv2.imread(path)
    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    h, w = img.shape[:2]

    try:
        results = model.predict(path, conf=0.25, verbose=False)
        detections = extract_detections(results)
        save_detection_to_history(filename, detections)

        return jsonify({
            "filename": filename,
            "image_width": w,
            "image_height": h,
            "total_detections": len(detections),
            "detections": detections
        })
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

# ==========================================================
# WEBCAM FRAME PREDICTION
# ==========================================================
@app.route("/predict-frame", methods=["POST"])
def predict_frame():
    try:
        data = request.get_json()

        if not data or "image" not in data:
            return jsonify({"error": "No image data provided"}), 400

        image_data = data["image"]

        if "," not in image_data:
            return jsonify({"error": "Invalid base64 image format"}), 400

        header, encoded = image_data.split(",", 1)
        img_bytes = base64.b64decode(encoded)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Invalid frame"}), 400

        h, w = img.shape[:2]

        results = model.predict(img, conf=0.25, verbose=False)
        detections = extract_detections(results)

        filename = f"webcam_{uuid.uuid4()}.jpg"
        save_detection_to_history(filename, detections)

        return jsonify({
            "filename": filename,
            "image_width": w,
            "image_height": h,
            "total_detections": len(detections),
            "detections": detections
        })

    except Exception as e:
        return jsonify({"error": f"Webcam prediction failed: {str(e)}"}), 500

# ==========================================================
# HISTORY API
# ==========================================================
@app.route("/history", methods=["GET"])
def history():
    return jsonify(load_history())

# ==========================================================
# RUN
# ==========================================================
if __name__ == "__main__":
    app.run(debug=True, port=5000)