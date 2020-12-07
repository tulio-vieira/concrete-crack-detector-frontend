import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';

// width of canvas while animating through loading state.
// Set it to a high resolution, so that the moving rectangle outline
// doesn't appear pixelated
const CANVAS_WIDTH = 1000;
const HIGHER_FPS = 30;
const LOWER_FPS = 10;

const styles = () => ({
  canvas: {
    width: '100%',
    position: 'absolute',
    zIndex: 5,
    top: 0,
    left: 0
  }
});

class Canvas extends Component {
  animating = false;

  componentDidUpdate(prevProps) {
    if (this.props.loading && !this.animating) this.beginAnimation();
    if (!this.props.loading && this.animating) this.stopAnimation();
    if (this.props.results && this.props.results !== prevProps.results) this.drawBoundaries();
  }
  
  drawBoundaries = () => {
    const { num_cols, num_rows, predictions } = this.props.results;
    const ctx = this.canvas.getContext('2d');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = this.props.imgObj.height * CANVAS_WIDTH / this.props.imgObj.width;
    const strideWidth = this.canvas.width / (num_cols + 1);
    const strideHeight = this.canvas.height / (num_rows + 1);
    const windowWidth = strideWidth * 2;
    const windowHeight = strideHeight * 2;
    ctx.fillStyle = '#a90000';
    for (let j = 0; j < num_rows; j++) {
      for (let i = 0; i < num_cols; i++) {
        let index = j * num_cols + i;
        if (predictions[index]) {
          ctx.fillRect(strideWidth * i, strideHeight * j, windowWidth, windowHeight)
        }
      }
    }
  }
  
  clearCanvas = (ctx) => {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  beginAnimation() {
    this.animating = true;
    const {imgObj, windowSize} = this.props;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = imgObj.height * CANVAS_WIDTH / imgObj.width;
    this.num_rows = Math.floor( (imgObj.height * 2) / windowSize - 1 );
    this.num_cols = Math.floor( (imgObj.width * 2) / windowSize - 1 );
    this.position_count = this.num_rows *  this.num_cols;
    this.position = 0;
    this.strideWidth = this.canvas.width / (this.num_cols + 1);
    this.strideHeight = this.canvas.height / (this.num_rows + 1);
    this.windowWidth = this.strideWidth * 2;
    this.windowHeight = this.strideHeight * 2;
    const fps = this.position_count > 200 ? HIGHER_FPS : LOWER_FPS;
    const fpsInterval = 1000 / fps;
    this.intervalId = setInterval(this.drawFrame.bind(this), fpsInterval);
  }

  drawFrame() {
    if (this.position > this.position_count - 1) this.position = 0;
    let i = Math.floor(this.position / this.num_cols);
    let j = this.position % this.num_cols;
    const ctx = this.canvas.getContext('2d');
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#FF0000";
    this.clearCanvas(ctx);
    ctx.beginPath();
    ctx.rect(this.strideWidth * j, this.strideHeight * i, this.windowWidth, this.windowHeight);
    ctx.stroke();
    this.position++;
  }

  stopAnimation = () => {
    this.animating = false;
    clearInterval(this.intervalId);
    const ctx = this.canvas.getContext('2d');
    this.clearCanvas(ctx);
  }

  render() {
    const {
      classes,
      loading,
      results
    } = this.props;

    return (
      <canvas
        className={classes.canvas}
        ref={canvas => this.canvas = canvas}
        style={{
          display: (results || loading) ? null: 'none',
          filter: loading ? null: 'opacity(50%)'
        }} />
    );
  }
}

export default withStyles(styles)(Canvas);