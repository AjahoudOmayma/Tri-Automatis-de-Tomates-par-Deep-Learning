from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os
import uuid

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "results"
MODEL_PATH = "models/tomato_best.pt"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

model = YOLO(MODEL_PATH)

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

    results = model.predict(
        source=image_path,
        conf=0.25,
        save=True,
        project=RESULT_FOLDER,
        name="predictions",
        exist_ok=True
    )

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

    return jsonify({
        "filename": filename,
        "total_detections": len(detections),
        "detections": detections
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)