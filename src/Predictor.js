import * as tf from '@tensorflow/tfjs';
import {INPUT_SIZE, BATCH_SIZE, NUM_PROGRESS_UPDATES} from './config';

let modelPromise = tf.loadLayersModel(process.env.PUBLIC_URL + '/tfjs_model/model.json')
  .catch(err => {
    console.log(err);
  });

export default class Predictor {
  constructor(imgObj, numRows, numCols, setProgress) {
    this.imgTensor = tf.tidy(() => {
      let imgTensor = tf.browser.fromPixels(imgObj);
      imgTensor = tf.div(imgTensor, tf.scalar(255));
      return tf.expandDims(imgTensor, 0);
    });
    this.numRows = numRows;
    this.numCols = numCols;
    this.setProgress = setProgress;
    this.getBoxes();
    this.predictions = [];
  }

  getPredictions = async () => {
    this.model = await modelPromise;
    if (!this.model) throw new Error('Connection failed');
    this.counter = 0;
    return (await new Promise((resolve, reject) => this.predictBatch(0, resolve, reject)));
  }

  predictBatch = async (sliceStart, resolve, reject) => {
    try {
      let sliceEnd = (sliceStart + BATCH_SIZE > this.boxes.length) ? this.boxes.length : sliceStart + BATCH_SIZE;

      let cropsBatch = tf.image.cropAndResize(
        this.imgTensor,
        this.boxes.slice(sliceStart, sliceEnd),
        this.boxIndices.slice(sliceStart, sliceEnd),
        [INPUT_SIZE, INPUT_SIZE]
      );
      let newPredictions = this.model.predict(cropsBatch);
      cropsBatch.dispose();
      const newPredictionsTypedArr = (await newPredictions.data()).filter((_, i) => (i % 2) ).map(pred => Math.round(pred));
      newPredictions.dispose();
      this.predictions = this.predictions.concat(Array.from(newPredictionsTypedArr));

      if (sliceEnd / this.boxes.length > this.counter / NUM_PROGRESS_UPDATES) {
        this.counter++;
        this.setProgress(Math.floor(100 * sliceEnd / this.boxes.length));
      }
      if (sliceEnd === this.boxes.length) {
        this.imgTensor.dispose();
        delete this.boxes;
        delete this.boxIndices;
        resolve(this.predictions);
      } else {
        setTimeout(this.predictBatch.bind(this, sliceEnd, resolve, reject), 0);
      }
    } catch(err) {
      console.log(err);
      reject(err);
    }
  }
  
  getBoxes = () => {
    let boxes = [];
    let boxIndices = [];
    // i -> row number; j -> column number
    for(let j = 0; j < this.numRows; j++) {
      for(let i = 0; i < this.numCols; i++) {
        boxes.push([j / (this.numRows + 1), i / (this.numCols + 1), (j + 2) / (this.numRows + 1), (i + 2) / (this.numCols + 1)]);
        boxIndices.push((j * this.numRows + i)/(this.numRows * this.numCols));
      }
    }
    this.boxes = boxes;
    this.boxIndices = boxIndices;
  }
}