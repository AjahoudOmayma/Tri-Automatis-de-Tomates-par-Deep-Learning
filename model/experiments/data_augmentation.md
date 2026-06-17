# Data Augmentation Experiment

After training the baseline YOLOv8n model, a second training experiment was performed using data augmentation and hyperparameter tuning.

## Objective

The objective of this experiment was to improve the model generalization and reduce the slight overfitting signal observed on the classification loss.

The baseline model already achieved good validation performance, but the validation classification loss was higher than the training classification loss. Therefore, data augmentation was tested to make the model more robust.

## Baseline issue

During the baseline analysis, the following loss comparison was observed:

| Loss | Train | Validation | Interpretation |
|---|---:|---:|---|
| box_loss | 0.4299 | 0.3906 | No overfitting |
| cls_loss | 0.3890 | 0.5751 | Slight overfitting risk |
| dfl_loss | 0.9799 | 0.9578 | No overfitting |

The main issue was related to `cls_loss`, which suggested that the model could have some difficulty generalizing the classification of tomato disease classes.

## Improvements applied

The following data augmentation and hyperparameter tuning techniques were used:

- Lower learning rate: `lr0 = 0.001`
- Weight decay: `0.0005`
- Rotation augmentation
- Translation augmentation
- Scale augmentation
- Horizontal flip
- HSV color augmentation
- Mosaic augmentation
- MixUp augmentation

## Training configuration

| Parameter | Value |
|---|---:|
| Model | YOLOv8n |
| Epochs | 80 |
| Image size | 640 |
| Batch size | 16 |
| Patience | 15 |
| Learning rate | 0.001 |
| Weight decay | 0.0005 |

## Validation results

| Model | Precision | Recall | mAP50 | mAP50-95 |
|---|---:|---:|---:|---:|
| Baseline YOLOv8n | 0.9136 | 0.8478 | 0.9241 | 0.8507 |
| Augmented YOLOv8n | 0.8470 | 0.8890 | 0.9250 | 0.8290 |

## Analysis

The augmented model improved the recall from 0.8478 to 0.8890.  
This means that the augmented model detected more real objects and missed fewer tomatoes or diseased regions.

However, the precision decreased from 0.9136 to 0.8470.  
This means that the augmented model produced more false detections than the baseline model.

The mAP50 remained almost the same between the two models:

- Baseline mAP50: 0.9241
- Augmented mAP50: 0.9250

However, the mAP50-95 decreased:

- Baseline mAP50-95: 0.8507
- Augmented mAP50-95: 0.8290

## Conclusion

The data augmentation experiment improved the recall, which means the model became more sensitive and detected more objects.  
However, the precision and mAP50-95 decreased compared to the baseline model.

Therefore, the augmented model was not selected as the final model.  
The baseline model was kept because it provided the best global balance between precision, recall, mAP50 and mAP50-95.