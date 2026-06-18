# Negative Samples Improvement

During real-world prediction tests, the model sometimes detected non-tomato objects as tomato disease classes.

For example, objects such as apples, peppers, faces or background elements were sometimes detected as:

- Anthracnose
- Blossom end rot
- Healthy Tomato
- Spotted wilt Virus

## Problem

The first YOLOv8 model was trained only on tomato images.  
Therefore, the model learned to associate some visual patterns such as red color, round shape or shiny texture with tomato classes.

Since the model does not know a class called `not tomato` or `unknown object`, it can force a prediction among the classes it learned.

This caused false detections on objects outside the tomato domain.

## Example of false detections

The model detected non-tomato objects such as:

- apple detected as tomato disease
- red pepper detected as Anthracnose
- background or face detected as a tomato-related class

This is a common issue in object detection when the dataset does not contain enough negative examples.

## Proposed solution

To improve robustness, negative images were added to the dataset.

Negative images are images that do not contain any tomato object.

Examples of negative images:

- apple
- banana
- orange
- pepper
- face
- hand
- kitchen background
- empty table
- other vegetables without tomatoes

## YOLO negative labels

In YOLO format, a negative image must have an empty label file.

Example:

```text
train/images/apple_001.jpg
train/labels/apple_001.txt