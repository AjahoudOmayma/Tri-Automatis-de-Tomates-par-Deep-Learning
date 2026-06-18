# Notebooks

This folder contains the notebooks used for YOLOv8 model development.

## 01_yolov8_baseline_and_evaluation.ipynb

This notebook contains the initial YOLOv8 pipeline:

- dataset loading and verification;
- baseline YOLOv8n training;
- validation and test evaluation;
- loss analysis;
- data augmentation experiment;
- model comparison.

The baseline model is kept as the most stable model for standard tomato detection.

## 02_yolov8_negative_samples_experiment.ipynb

This notebook contains the robustness experiment using negative samples.

Negative images were added to reduce false detections on non-tomato objects. These images include fruits, vegetables and some real images taken manually, such as peppers, carrots, onions, apples, oranges and other non-tomato objects.

All negative images were added with empty YOLO label files. This means that the model should learn that no tomato object should be detected in those images.

This experiment showed that negative samples can improve robustness, but the negative dataset was relatively simple. Many images contained isolated objects on simple backgrounds.

Some real-world cases remain difficult, especially images containing tomatoes together with peppers, onions, hands or complex backgrounds.

Therefore, this notebook is kept as an improvement experiment and future work direction.