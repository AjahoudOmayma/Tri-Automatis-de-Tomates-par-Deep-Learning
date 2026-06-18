## Final decision

Several models were compared:

- Baseline YOLOv8n
- Augmented YOLOv8n
- YOLOv8n with negative samples
- Augmented YOLOv8n with negative samples

The baseline model remains the most stable model for detecting tomatoes in standard test images and real tomato images.

The model trained with negative samples improved robustness against some non-tomato images, but it showed limitations on real-world images because the negative dataset was relatively simple and did not fully represent complex real scenes.

For this reason, the negative-samples model is kept as a robustness experiment, while the application should use the model that performs best on real tomato images.

Future improvements should include mixed real-world and hard images, such as tomatoes with peppers, onions, hands and kitchen backgrounds, with only tomatoes annotated.

## Limitation: Anthracnose class and real-world predictions

The `Anthracnose` class is one of the main limitations of the model. In the test set, only 3 Anthracnose images were available, so the evaluation of this class is not statistically reliable. This explains why the confusion matrix can show a very low or even zero value on the Anthracnose diagonal.

During real-world tests in the web application, one tomato image was predicted as `Anthracnose` with 90.6% confidence. However, since this image does not have an expert-validated ground-truth label, we cannot confirm that the prediction is correct.

Therefore, predictions on real images should be considered as model suggestions, not confirmed diagnoses. To improve this limitation, more annotated Anthracnose images and expert-validated real-world test images are needed.
