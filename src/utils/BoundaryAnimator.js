const HIGHER_FPS = 30;
const LOWER_FPS = 10;

export default class BoundaryAnimator {
  FPS = 10;

  constructor(windowSize, canvas, imgObj) {
    this.canvas = canvas;
    this.imgObj = imgObj;
    this.num_rows = Math.floor( (imgObj.height * 2) / windowSize - 1 );
    this.num_cols = Math.floor( (imgObj.width * 2) / windowSize - 1 );
    this.position_count = this.num_rows *  this.num_cols;
    this.fps = this.position_count > 200 ? HIGHER_FPS : LOWER_FPS;
    this.position = 0;
    this.strideWidth = canvas.width / (this.num_cols + 1);
    this.strideHeight = canvas.height / (this.num_rows + 1);
    this.windowWidth = this.strideWidth * 2;
    this.windowHeight = this.strideHeight * 2;
  }

  beginAnimation() {
    let fpsInterval = 1000 / this.fps;
    this.intervalId = setInterval(this._drawFrame.bind(this), fpsInterval);
  }

  stopAnimation() {
    clearInterval(this.intervalId);
    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.imgObj, 0, 0, this.canvas.width, this.canvas.height);
  }

  _drawFrame() {
    if (this.position > this.position_count - 1) this.position = 0;
    let i = Math.floor(this.position / this.num_cols);
    let j = this.position % this.num_cols;
    const ctx = this.canvas.getContext('2d');
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#FF0000";
    ctx.drawImage(this.imgObj, 0, 0, this.canvas.width, this.canvas.height);
    ctx.beginPath();
    ctx.rect(this.strideWidth * j, this.strideHeight * i, this.windowWidth, this.windowHeight);
    ctx.stroke();
    this.position++;
  }
}