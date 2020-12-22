# Concrete Crack Detector App

This app is an implementation of a Convolutional Neural Network trained for classifing images of cracked and non-cracked concrete images. You can run it in the browser [here](https://tulio-vieira.github.io/concrete-crack-detector-app), preferably on Chrome. Since it uses [Tensorflow.js](https://www.tensorflow.org/js), which is still in its early days, the app doesn't work on mobile or weaker machines.

## How it works

The user selects an image of a concrete surface with cracks, and then the model predicts the presence or absence of concrete cracks in each position of a sliding window that passes over the selected image. The result is shown below:

![Demo image](https://github.com/tulio-vieira/concrete-crack-detector-app/blob/master/demo.jpeg?raw=true)

The heart of the app is the preprocessing step for the sliding window, which uses the [tensorflowjs API](https://js.tensorflow.org/api/latest). This step is separated in a special class, written in this [file](https://github.com/tulio-vieira/concrete-crack-detector-frontend/blob/main/src/Predictor.js).

Technologies used:
 - Tensorflow JS
 - React
 - Material UI

 ## Additional Information

To see the notebooks used for training the neural network, click [here](https://github.com/tulio-vieira/concrete-crack-detector-train).

Created by [Tulio Vieira](http://www.github.com/tulio-vieira)