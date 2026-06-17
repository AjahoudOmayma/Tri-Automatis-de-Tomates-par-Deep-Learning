# Baseline YOLOv8n Training

A first YOLOv8n model was trained as a baseline.

The baseline is the first reference model trained without additional robustness improvements such as negative samples.

## Training configuration

- Model: YOLOv8n
- Epochs: 50
- Image size: 640
- Batch size: 16
- Patience: 10
- Optimizer: AdamW
- Dataset format: YOLOv8
- Environment: Google Colab GPU

## YOLOv8 losses

During training, YOLOv8 optimizes three main losses:

- `box_loss`: bounding box localization loss.
- `cls_loss`: classification loss.
- `dfl_loss`: Distribution Focal Loss for improving box quality.

## Final training losses

| Loss | Final train value |
|---|---:|
| box_loss | 0.4299 |
| cls_loss | 0.3890 |
| dfl_loss | 0.9799 |

## Validation results

| Metric | Value |
|---|---:|
| Precision | 0.9136 |
| Recall | 0.8478 |
| mAP50 | 0.9241 |
| mAP50-95 | 0.8507 |

## Interpretation

The baseline model achieved strong validation performance.  
The precision is high, which means the model produces few false detections on the validation set.  
The mAP50 and mAP50-95 values are also high, showing that the model performs well in both detection and classification.