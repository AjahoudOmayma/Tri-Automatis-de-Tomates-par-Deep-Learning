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