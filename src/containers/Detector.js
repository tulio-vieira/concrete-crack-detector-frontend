import { Component } from "react";
import {ReactComponent as UploadSvg} from '../icons/upload.svg';
import { Button, withStyles } from "@material-ui/core";
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import Slider from "../components/Slider";
import ErrorHandler from "../components/ErrorHandler";
import Canvas from "../components/Canvas";
import ProgressDisplay from '../components/ProgressDisplay';
import Predictor from '../Predictor';
import {INPUT_SIZE} from '../config';

const styles = (theme) => ({
  detector: {
    marginTop: 24,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  upload: {
    marginTop: 16,
    backgroundColor: '#adadad',
    padding: 16,
    borderRadius: 16,
    transition: 'background-color 0.1s ease',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#616161'
    }
  },
  title: {
    fontWeight: 400
  },
  uploadIcon: {
    height: 100,
    verticalAlign: 'middle',
    margin: '0 auto',
    fill: '#314198'
  },
  options: {
    display: 'flex',
    alignItems: 'center',
    padding: '32px 0',
    justifyContent: 'space-around',
    alignSelf: 'stretch'
  },
  display: {
    width: '100%',
    maxWidth: 1000,
    position: 'relative',
    border: '5px solid #404040',
    borderRadius: 3
  },
  windowPreview: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    height: 0,
    width: '100%',
    overflow: 'hidden'
  },
  preview: {
    position: 'absolute',
    height: 0,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '5px solid red',
    outline: '600px solid rgba(0, 0, 0, 0.5)'
  },
  [theme.breakpoints.down(450)]: {
    options: {
      flexDirection: 'column',
      '& div': { order: -1 },
      '& > *': {
        margin: '8px 0'
      }
    }
  }
});

class Detector extends Component {
  state = {
    loading: false,
    errorMessage: null,
    windowSize: null,
    minWindowSize: null,
    maxWindowSize: INPUT_SIZE,
    predictions: null,
    imgObj: null,
    sliderTouched: true,
    numRows: 0,
    numCols: 0,
    progress: 0
  };

  fileSelectedHandler = (event) => {
    try {
      // check extension
      let ext = event.target.files[0].name.split('.');
      ext = ext[ext.length - 1].toLowerCase();
      if (!['png', 'jpeg', 'jpg'].includes(ext)) return this.setState({errorMessage: "Invalid File type"});
      let imgObj = new Image();
      imgObj.src = URL.createObjectURL(event.target.files[0]);
      imgObj.onload = () => {
        // check dimensions
        const windowData = this.verifyImageDimensions(imgObj.width, imgObj.height);
        if (!windowData) return;
        this.setState({
          ...windowData,
          imgObj,
          predictions: null,
          sliderTouched: true
        });
      };
    } catch(e) {
      console.log(e);
    }
  }
  
  makeRequest = async () => {
    if (!this.state.imgObj) return;
    const numRows = Math.floor( (this.state.imgObj.height * 2) / this.state.windowSize - 1 );
    const numCols = Math.floor( (this.state.imgObj.width * 2) / this.state.windowSize - 1 );
    this.setState({
      loading: true,
      numRows,
      numCols 
    });
    try {
      const predictor = new Predictor(this.state.imgObj, numRows, numCols, (progress) => this.setState({progress}));
      const predictions = await predictor.getPredictions();
      this.setState({
        loading: false,
        predictions,
        sliderTouched: false,
        progress: 0
      });
    } catch(err) {
      this.setState({
        loading: false,
        errorMessage: err.message || 'Something went wrong...',
        sliderTouched: false,
        progress: 0
      });
    }
  }

  verifyImageDimensions = (L, H) => {
    let delta = Math.pow( ( H*H + 7598*H*L + L*L ), 0.5 );
    let minWindowSize = Math.ceil( (delta - H - L) / 1899 );
    if (minWindowSize < 10 ) minWindowSize = 10;
    let maxWindowSize = INPUT_SIZE;
    if (this.state.maxWindowSize > L || this.state.maxWindowSize > H) {
      maxWindowSize = L < H ? L : H;
    }
    if (minWindowSize > maxWindowSize || L < 10 || H < 10) {
      this.setState({ errorMessage: 'Invalid size for image' });
      return false;
    }
    return {
      minWindowSize,
      windowSize: Math.ceil((maxWindowSize + minWindowSize)/2),
      maxWindowSize
    };
  }
  
  render() {
    const classes = this.props.classes;
    const previewWidthPercent = this.state.imgObj ? this.state.windowSize * 100 / this.state.imgObj.width + '%' : null;

    return (
      <div className={classes.detector}>
        <h2 className={classes.title}>Detect concrete cracks with Convolutional Neural Network Classifier!</h2>
        <input
          style={{display: 'none'}}
          type='file'
          onChange={this.fileSelectedHandler}
          ref={fileInput => this.fileInput = fileInput}/>

        {this.state.imgObj ?
          <div className={classes.display}>

            <img src={this.state.imgObj.src} style={{width: '100%'}} alt=''/>

            {this.state.predictions &&
              <Canvas
                imgObj={this.state.imgObj}
                numRows={this.state.numRows}
                numCols={this.state.numCols}
                predictions={this.state.predictions} />
            }

            {this.state.loading && <ProgressDisplay progress={this.state.progress} />}
            
            {previewWidthPercent && !this.state.loading && this.state.sliderTouched &&
              <div className={classes.windowPreview} style={{
                paddingBottom: this.state.imgObj.height * 100 / this.state.imgObj.width + '%'}}>
    
                <div className={classes.preview} style={{
                  width: previewWidthPercent,
                  paddingBottom: previewWidthPercent}} />
              </div>
            }
          </div>
        :
          <div className={classes.upload} onClick={() => this.fileInput.click()}>
            <UploadSvg className={classes.uploadIcon} width={null} height={null}/>
          </div>
        }

        <div className={classes.options}>

          {this.state.imgObj &&
            <Button
              variant='outlined'
              disabled={this.state.loading}
              onClick={() => this.fileInput.click()}>
              <ImageOutlinedIcon />
              <span style={{marginLeft: '0.5em'}}>Choose Image</span>
            </Button>
          }
          
          {this.state.imgObj &&
            <Slider
              disabled={this.state.loading}
              value={this.state.windowSize}
              min={this.state.minWindowSize}
              max={this.state.maxWindowSize}
              onChange={(e) => this.setState({ windowSize: e.target.value, sliderTouched: true })} />
          }

          {this.state.imgObj &&
            <Button
              variant='contained'
              color='secondary'
              disabled={this.state.loading || !this.state.sliderTouched}
              onClick={this.makeRequest}>
              Detect
            </Button>
          }
       
        </div>

        <ErrorHandler
          errorMessage={this.state.errorMessage}
          errorConfirmed={() => this.setState({errorMessage: null})} />
      </div>
    );
  }
}

export default withStyles(styles)(Detector);