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
- other vegetables without tomatoes

## YOLO negative labels

In YOLO format, a negative image must have an empty label file.

Example:

```text
train/images/apple_001.jpg
train/labels/apple_001.txt

## Discussion

The negative samples experiment was added to reduce false detections on non-tomato objects such as fruits, vegetables and faces.

However, the negative dataset used in this experiment was relatively simple. Many negative images contained isolated objects on simple backgrounds. This helped the model learn to ignore some non-tomato objects, but it was not sufficient to fully solve real-world cases where tomatoes appear together with peppers, onions, hands or other objects.

The experiment improved robustness on some negative examples, but it also made the model more conservative and sometimes less stable on real tomato images.

Therefore, negative samples are kept as an important robustness experiment, but the next improvement should use mixed real-world images containing tomatoes and non-tomato objects together, with annotations only on tomatoes.