# Concrete Crack Detector App

This app is an implementation of a Convolutional Neural Network trained for classifing images of cracked and non-cracked concrete images.

The user selects an image of a concrete surface with cracks, and then the model predicts the presence or absence of concrete cracks in each position of a sliding window that passes over the selected image. The result is shown below:

![Demo image](https://github.com/tulio-vieira/concrete-crack-detector-app/blob/master/demo.jpeg?raw=true)

The heart of the app is the preprocessing step for the sliding window, which uses the [tensorflowjs API](https://www.tensorflow.org/js). This step is separated in a special class, written in this [file](https://github.com/tulio-vieira/concrete-crack-detector-frontend/blob/main/src/Predictor.js).

Technologies used:
 - Tensorflow JS
 - React
 - Material UI

Created by [Tulio Vieira](http://www.github.com/tulio-vieira)