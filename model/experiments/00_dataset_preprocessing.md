# Dataset Preprocessing and Verification

Before training the YOLOv8 model, the dataset was verified and prepared.

## Dataset format

The dataset is annotated in YOLOv8 format and contains:

- train/images
- train/labels
- valid/images
- valid/labels
- test/images
- test/labels
- data.yaml

## Classes

- Anthracnose
- Blossom end rot
- Healthy Tomato
- Spotted wilt Virus

## Preprocessing steps

The following preprocessing and verification steps were performed:

1. Import the dataset ZIP into Google Colab.
2. Extract the dataset.
3. Locate the `data.yaml` file.
4. Correct train, validation and test paths inside `data.yaml`.
5. Verify the number of images and labels for each split.
6. Check missing labels.
7. Check empty label files.
8. Check invalid YOLO annotations.
9. Analyze class distribution.
10. Visualize annotated images with bounding boxes.

## Dataset summary

| Split | Images | Labels | Bounding boxes | Images without labels | Empty labels | Invalid lines |
|---|---:|---:|---:|---:|---:|---:|
| Train | 1816 | 1816 | 2378 | 0 | 34 | 442 |
| Valid | 113 | 113 | 114 | 0 | 0 | 58 |
| Test | 114 | 114 | 165 | 0 | 2 | 22 |

## Interpretation

The dataset is correctly organized for YOLOv8 training.  
Each image has a corresponding label file. Some labels are empty, which can be used for images without objects. Some invalid lines were detected because of segmentation-like annotations, but YOLOv8 ignored the segments and used bounding boxes for object detection.