export default class BoundaryDrawer {
  constructor(apiResponse, canvas) {
    this.num_rows = apiResponse.num_rows;
    this.num_cols = apiResponse.num_cols;
    this.boundaryCorners = this._processPredictions(apiResponse.predictions);
    this.strideWidth = canvas.width / (apiResponse.num_cols + 1);
    this.strideHeight = canvas.height / (apiResponse.num_rows + 1);
    this.ctx = canvas.getContext('2d');
  }

  _getPrediction([row, col], predictions) {
    let index = row * this.num_cols + col;
    return predictions[index];
  }
  
  _processPredictions(predictions) {
    let boundaryCorners = [];
  
    for (var j = 0; j < this.num_rows + 2; j++) {
      boundaryCorners.push(new Array(this.num_cols + 2).fill(0));
    }
  
    const adjCoordinates = [
      [0, 0],
      [0, 1],
      [0, -1],
      [-1, -1],
      [1, 1],
      [1, 0],
      [-1, 0],
      [1, -1],
      [-1, 1]
    ];
  
    // make boundaryCorners array, by padding the predictions array with zeros
    // and setting to 1 every adjacent point to the prediction
    for (let j = 0; j < this.num_rows + 2; j++) {
      for (let i = 0; i < this.num_cols + 2; i++) {
        if ( j === 0 || i === 0 || j === this.num_rows + 1 || i === this.num_cols + 1 || !this._getPrediction([j - 1, i - 1], predictions) ) continue;
        adjCoordinates.forEach(coord => {
          boundaryCorners[ j + coord[0] ][ i + coord[1] ] = 1;
        });
      }
    }
    return boundaryCorners;
  }

  _matrixToPixel([row, col]) {
    return [col * this.strideWidth, row * this.strideHeight];
  }

  _drawLine(j, i) {
    const points = [
      [j    , i    ],
      [j    , i + 1],
      [j + 1, i + 1],
      [j + 1, i   ],
    ];
    let adjCorners = [];
  
    // get case number
    let caseNumber = 0;
  
    points.forEach((point, index) => {
      let isCorner = this.boundaryCorners[point[0]][point[1]];
      caseNumber += isCorner * (2 ** index);
      if (isCorner) adjCorners.push(point);
    });
  
    switch(caseNumber) {
      case 13:
        adjCorners = [adjCorners[1], adjCorners[2], adjCorners[0]];
        break;
      case 11:
        adjCorners = [adjCorners[2], adjCorners[0], adjCorners[1]];
        break;
      case 14:
      case 7:
      case 12:
      case 6:
      case 3:
      case 9:
        break;
      default: adjCorners = [];
    }
    for (let index = 0; index < adjCorners.length - 1; index++) {
      this.ctx.beginPath();
      const [x0, y0] = this._matrixToPixel(adjCorners[index]);
      this.ctx.moveTo(x0, y0);
      const [x, y] = this._matrixToPixel(adjCorners[index + 1]);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
  }
  
  draw() {
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = "#FF0000";
    for (let j = 0; j < this.num_rows + 1; j++) {
      for (let i = 0; i < this.num_cols + 1; i++) {
        this._drawLine(j, i);
      }
    }
  }
}