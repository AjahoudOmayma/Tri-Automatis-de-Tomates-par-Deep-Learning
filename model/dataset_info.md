# Dataset Information

## Dataset source

The dataset used in this project comes from **Roboflow Universe**.

- Dataset name: **Tomato Fruit Disease Detection**
- Download format: **YOLOv8**
- Task type: **Object Detection**
- Usage: training, validation and testing of a YOLOv8 model for tomato disease detection and classification.

The dataset was downloaded as a ZIP file from Roboflow and used in Google Colab for model training.
## Classes

- Anthracnose
- Blossom end rot
- Healthy Tomato
- Spotted wilt Virus
## Dataset summary

| Split | Images | Labels | Bounding boxes |
|---|---:|---:|---:|
| Train | 1816 | 1816 | 2378 |
| Valid | 113 | 113 | 114 |
| Test | 114 | 114 | 165 |

## Why the dataset is not included in this repository

The full dataset is not included in this GitHub repository because it contains many image files and can be heavy.

Instead, this repository contains:

- the YOLOv8 training notebook;
- the preprocessing and verification steps;
- the model metrics;
- the evaluation figures;
- the final report;
- the trained model or a link to the model weights.

To reproduce the training, the dataset should be downloaded again from Roboflow in YOLOv8 format and uploaded to Google Colab.

## Dataset format

The dataset is organized in YOLOv8 format.

Expected structure:

```text
dataset/
├── train/
│   ├── images/
│   └── labels/
│
├── valid/
│   ├── images/
│   └── labels/
│
├── test/
│   ├── images/
│   └── labels/
│
└── data.yaml

## Note

The dataset was verified before training. Each image has a corresponding label file. The YOLOv8 labels were checked and the `data.yaml` paths were corrected for Google Colab.