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
# ==========================================================



from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os, uuid, base64, cv2, numpy as np, json
from datetime import datetime

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
    with open(HISTORY_FILE, "w") as f:
        json.dump([], f)

model = YOLO(MODEL_PATH)

# ==========================================================
# CLASSES YOLOV8 (TON DATASET)
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
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_history(data):
    with open(HISTORY_FILE, "w") as f:
        json.dump(data, f, indent=4)

# ==========================================================
# DETECTIONS
# ==========================================================
def extract_detections(results):
    detections = []

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append({
                "class": model.names[cls],
                "confidence": round(conf, 3),
                "bbox": [round(x1), round(y1), round(x2), round(y2)]
            })

    return detections

# ==========================================================
# HOME
# ==========================================================
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "YOLOv8 Tomato API running"})

# ==========================================================
# PREDICT + HISTORY + DATE
# ==========================================================
@app.route("/predict", methods=["POST"])
def predict():

    if "file" not in request.files:
        return jsonify({"error": "No image"}), 400

    file = request.files["file"]

    filename = str(uuid.uuid4()) + "_" + file.filename
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)

    img = cv2.imread(path)
    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    h, w = img.shape[:2]

    results = model.predict(path, conf=0.25)
    detections = extract_detections(results)

    # ======================================================
    # CLASS COUNTING
    # ======================================================
    def count(cls_name):
        return sum(1 for d in detections if cls_name in d["class"].lower())

    anthracnose = count("anthracnose")
    blossom = count("blossom")
    healthy = count("healthy")
    virus = count("spotted")

    avg_conf = sum(d["confidence"] for d in detections) / len(detections) if detections else 0

    # ======================================================
    # SAVE HISTORY (WITH DATE)
    # ======================================================
    history = load_history()

    history.append({
        "id": len(history) + 1,
        "timestamp": datetime.now().isoformat(),
        "filename": filename,

        "totalDetections": len(detections),

        "anthracnose": anthracnose,
        "blossomEndRot": blossom,
        "healthy": healthy,
        "spottedWiltVirus": virus,

        "averageConfidence": round(avg_conf, 3)
    })

    save_history(history)

    return jsonify({
        "filename": filename,
        "image_width": w,
        "image_height": h,
        "total_detections": len(detections),
        "detections": detections
    })

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