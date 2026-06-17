# Loss and Overfitting Analysis

After baseline training, train and validation losses were compared to check whether the model overfits.

## Loss comparison

| Loss | Train | Validation | Ratio | Interpretation |
|---|---:|---:|---:|---|
| box_loss | 0.4299 | 0.3906 | 0.91 | No overfitting |
| cls_loss | 0.3890 | 0.5751 | 1.48 | Slight overfitting risk |
| dfl_loss | 0.9799 | 0.9578 | 0.98 | No overfitting |

## Analysis

The `box_loss` and `dfl_loss` are close between training and validation.  
This means the model generalizes well for bounding box localization.

The `cls_loss` is higher on validation than on training.  
This can indicate a slight overfitting risk on classification.

However, the validation metrics remain high:

- Precision: 0.9136
- Recall: 0.8478
- mAP50: 0.9241
- mAP50-95: 0.8507

## Conclusion

There is no strong global overfitting.  
Only a slight classification overfitting signal was observed.  
For this reason, an additional experiment with data augmentation was performed.