import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import {CANVAS_WIDTH} from '../config';

const styles = () => ({
  canvas: {
    width: '100%',
    position: 'absolute',
    zIndex: 5,
    top: 0,
    left: 0,
    filter: 'opacity(50%)'
  }
});

class Canvas extends Component {

  componentDidMount() {
    this.drawBoundaries();
  }

  componentDidUpdate(prevProps) {
    if (this.props.predictions && this.props.predictions !== prevProps.predictions) this.drawBoundaries();
  }
  
  drawBoundaries = () => {
    const { numCols, numRows, predictions } = this.props;
    const ctx = this.canvas.getContext('2d');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = this.props.imgObj.height * CANVAS_WIDTH / this.props.imgObj.width;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const strideWidth = this.canvas.width / (numCols + 1);
    const strideHeight = this.canvas.height / (numRows + 1);
    const windowWidth = strideWidth * 2;
    const windowHeight = strideHeight * 2;
    ctx.fillStyle = '#a90000';
    for (let j = 0; j < numRows; j++) {
      for (let i = 0; i < numCols; i++) {
        let index = j * numCols + i;
        if (predictions[index]) {
          ctx.fillRect(strideWidth * i, strideHeight * j, windowWidth, windowHeight)
        }
      }
    }
  }

  render() {
    return (
      <canvas
        className={this.props.classes.canvas}
        ref={canvas => this.canvas = canvas} />
    );
  }
}

export default withStyles(styles)(Canvas);