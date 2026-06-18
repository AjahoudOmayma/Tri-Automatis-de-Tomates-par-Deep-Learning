# AI-Powered Tomato Disease Detection Dashboard

## Project Overview

This project is an AI-powered web application for tomato detection and disease classification using YOLOv8.

The goal is to detect tomatoes in images or webcam captures, draw bounding boxes around detected tomatoes, and classify them into one of the available tomato disease classes.

The project combines:

- a YOLOv8 object detection model;
- a Flask backend API;
- a frontend dashboard;
- model evaluation notebooks;
- performance metrics and visual results.

The main focus of the machine learning part is to train, evaluate and compare several YOLOv8 models for tomato detection and classification.

---

## Problem Statement

Tomato disease detection is important in agriculture because early identification of diseases can help reduce crop losses.

In this project, we aim to build a computer vision system able to:

- detect tomatoes in images;
- classify tomato health or disease class;
- ignore non-tomato objects as much as possible;
- provide results through a simple web application.

A key challenge observed during testing is that some non-tomato objects such as peppers, apples, onions, oranges or faces can visually look similar to tomatoes. Therefore, an additional robustness experiment using negative images was performed.

---

## Dataset

The main dataset used in this project comes from Roboflow Universe.

- Dataset name: Tomato Fruit Disease Detection
- Format: YOLOv8
- Task type: Object Detection

The dataset contains four classes:

- Anthracnose
- Blossom end rot
- Healthy Tomato
- Spotted wilt Virus

The dataset follows the YOLOv8 structure:

    dataset/
    ├── train/
    │   ├── images/
    │   └── labels/
    ├── valid/
    │   ├── images/
    │   └── labels/
    ├── test/
    │   ├── images/
    │   └── labels/
    └── data.yaml

The full dataset is not included in this repository because it contains many image files and can be heavy.

More details are available in:

    model/dataset_info.md

---

## Project Architecture

    AI-POWERED-TOMATO-DASHBOARD/
    ├── backend/
    │   ├── app.py
    │   ├── requirements.txt
    │   ├── models/
    │   ├── uploads/
    │   └── results/
    │
    ├── frontend/
    │
    ├── model/
    │   ├── notebooks/
    │   ├── experiments/
    │   ├── metrics/
    │   └── dataset_info.md
    │
    ├── reports/
    │   └── figures/
    │
    ├── docs/
    │
    ├── CONTRIBUTIONS.md
    ├── README.md
    └── .gitignore

---

## Machine Learning Pipeline

The machine learning workflow was developed in several steps.

### 1. Dataset Loading and Verification

The YOLOv8 dataset was loaded and verified before training.

The verification step checked:

- number of images;
- number of label files;
- missing labels;
- empty labels;
- invalid label lines;
- class names from data.yaml.

This step ensures that the dataset is correctly structured before training.

---

### 2. Baseline YOLOv8n Model

A first YOLOv8n model was trained as a baseline.

The baseline model was used as the reference model for comparison with later experiments.

Training configuration:

- Model: YOLOv8n
- Image size: 640
- Epochs: 50
- Batch size: 16
- Patience: 10

The baseline model achieved strong results on the original tomato dataset and was considered the most stable model for standard tomato detection.

---

### 3. Loss and Overfitting Analysis

Training and validation losses were analyzed:

- box_loss: bounding box localization error;
- cls_loss: classification error;
- dfl_loss: bounding box regression quality.

The train and validation curves showed that the model was learning correctly. No strong global overfitting was observed, although some gap between training and validation losses remained.

---

### 4. Data Augmentation Experiment

A second experiment was performed using data augmentation to improve generalization.

The augmentation techniques included:

- rotation;
- translation;
- scaling;
- horizontal flipping;
- HSV augmentation;
- mosaic;
- mixup;
- learning rate adjustment;
- weight decay.

The goal was to make the model more robust to different visual conditions.

---

### 5. Negative Samples Robustness Experiment

During real-world tests, the model sometimes detected non-tomato objects as tomatoes.

Examples of confusing objects:

- peppers;
- apples;
- onions;
- oranges;
- carrots;
- eggplants;
- hands;
- faces;
- red or round objects.

To reduce these false detections, a robustness experiment was performed using negative images.

Negative images were added with empty YOLO label files. This means that no new class such as apple, pepper or face was created.

The goal was not to classify these objects, but to teach YOLOv8:

    If there is no tomato in the image, detect nothing.

This experiment improved robustness on some negative examples, but it also showed limitations on real-world complex images.

---

## Model Results

Several models were compared:

- baseline YOLOv8n;
- YOLOv8n with data augmentation;
- baseline YOLOv8n with negative samples;
- augmented YOLOv8n with negative samples.

The main metrics used were:

- Precision;
- Recall;
- mAP50;
- mAP50-95.

Model metrics are available in:

    model/metrics/

Important result files include:

- baseline_metrics.csv
- augmented_metrics.csv
- final_test_metrics.csv
- model_comparison.csv
- baseline_with_negatives_metrics.csv
- final_negative_augmented_metrics.csv
- final_model_comparison.csv

---

## Final Model Discussion

The baseline YOLOv8n model achieved the best stability for standard tomato detection.

The negative samples experiment improved robustness against some non-tomato objects, but it also made the model more conservative and sometimes less stable on real-world tomato images.

Therefore:

- the baseline model is kept as the most stable model for standard tomato detection;
- the negative-samples model is kept as an important robustness experiment;
- future work should include more mixed real-world images containing tomatoes and non-tomato objects together.

Examples of future training images:

- tomato + pepper
- tomato + hand
- tomato + onion
- tomato + apple
- tomato + kitchen background
- tomato with low light
- tomato partially hidden

In these images, only tomatoes should be annotated.

---

## Results and Figures

Important figures are stored in:

    reports/figures/

The figures include:

- dataset bounding box examples;
- training results;
- train/validation loss curves;
- validation metrics;
- confusion matrices;
- prediction examples;
- negative samples robustness examples;
- custom tomato/orange prediction examples.

These figures are used to explain model performance and limitations.

---

## Backend

The backend is implemented with Flask.

It is responsible for:

- loading the trained YOLOv8 model;
- receiving uploaded images from the frontend;
- running inference;
- returning detection results;
- saving prediction outputs.

Backend files are located in:

    backend/

The backend dependencies are listed in:

    backend/requirements.txt

---

## Frontend

The frontend provides a user interface for tomato detection.

It allows the user to:

- upload an image;
- start tomato detection;
- view bounding boxes and class predictions;
- see detection results.

The frontend is located in:

    frontend/

---

## How to Run the Project

### 1. Clone the repository

    git clone https://github.com/prof-elhajji/projet-machine-learning-industriel-reddetect.git
    cd projet-machine-learning-industriel-reddetect

### 2. Install backend dependencies

    cd backend
    pip install -r requirements.txt

### 3. Add model weights

The model weights are not necessarily included directly in GitHub. They can be stored in Google Drive and placed inside:

    backend/models/

Example:

    backend/models/best_yolov8n_baseline.pt

or:

    backend/models/best_yolov8n_augmented_with_negative_samples.pt

### 4. Run the backend

    python app.py

### 5. Run the frontend

From the frontend folder:

    npm install
    npm run dev

---

## Repository Organization

### model/notebooks/

Contains the notebooks used for model development:

- 01_yolov8_baseline_and_evaluation.ipynb
- 02_yolov8_negative_samples_experiment.ipynb
- README.md

### model/experiments/

Contains markdown files documenting each experiment:

- 00_dataset_preprocessing.md
- 01_baseline_training.md
- 02_loss_overfitting_analysis.md
- 03_data_augmentation.md
- 04_negative_samples_improvement.md
- 05_final_model_selection.md

### model/metrics/

Contains CSV files with model metrics and comparisons.

### reports/figures/

Contains important visual results used in the report.

### backend/

Contains the Flask API and model integration.

### frontend/

Contains the web dashboard.

---

## Limitations

The model works well on the original dataset, but some limitations remain:

- the dataset is relatively clean and easier than real-world images;
- real phone images may contain different lighting, blur, compression and complex backgrounds;
- visually similar objects can still be confused with tomatoes;
- negative samples improved robustness but were not sufficient for all real-world cases;
- more mixed real-world annotated images are needed.

The main limitation is a domain shift between the dataset images and real application images.

---

## Future Work

Future improvements include:

- collecting more real-world tomato images;
- adding mixed images with tomatoes and non-tomato objects;
- annotating only tomatoes in mixed images;
- testing different YOLOv8 model sizes;
- improving confidence threshold selection;
- improving frontend/backend deployment.

---

## Technologies Used

- Python
- YOLOv8 / Ultralytics
- PyTorch
- OpenCV
- Flask
- React / Vite
- Google Colab
- Google Drive
- Git / GitHub

---

## Contributors

Team contributions are described in:

    CONTRIBUTIONS.md

---

## References

- Ultralytics YOLOv8 Documentation: https://docs.ultralytics.com/
- Roboflow Universe: https://universe.roboflow.com/
- PyTorch Documentation: https://pytorch.org/
- Flask Documentation: https://flask.palletsprojects.com/
