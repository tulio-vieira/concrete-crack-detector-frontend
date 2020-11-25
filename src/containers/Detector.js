import { Component } from "react";
import {ReactComponent as UploadSvg} from '../icons/upload.svg';
import axios from '../axios-instance';
import { Button, withStyles } from "@material-ui/core";
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import Slider from "../components/Slider";
import ErrorHandler from "../components/ErrorHandler";
import Canvas from "../components/Canvas";
import ProgressDisplay from '../components/ProgressDisplay'

const MAX_WINDOW_SIZE = 227;

const styles = () => ({
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
  }
});

class Detector extends Component {
  state = {
    loading: false,
    errorMessage: null,
    windowSize: null,
    minWindowSize: null,
    maxWindowSize: MAX_WINDOW_SIZE,
    results: null,
    imgFile: null,
    imgObj: null,
    sliderTouched: true,
    progress: 0
  };

  fileSelectedHandler = (event) => {
    try {
      // check extension
      let ext = event.target.files[0].name.split('.');
      ext = ext[ext.length - 1].toLowerCase();
      if (!['png', 'jpeg', 'jpg'].includes(ext)) return this.setState({errorMessage: "Invalid File type"});
      let imgFile = event.target.files[0];
      let imgObj = new Image();
      imgObj.src = URL.createObjectURL(imgFile);
      imgObj.onload = () => {
        // check dimensions
        const windowData = this.verifyImageDimensions(imgObj.width, imgObj.height);
        if (!windowData) return;
        this.setState({
          ...windowData,
          imgObj,
          imgFile,
          results: null,
          sliderTouched: true
        });
      };
    } catch(e) {
      console.log(e);
    }
  }

  checkProgress = async (id) => {
    let response = (await axios.get(`/predict/${id}`)).data;
    if (response.progress) {
      this.setState({progress: response.progress});
      await new Promise((resolve, _) => setTimeout(resolve, 1000));
      response = await this.checkProgress(id);
    }
    return response;
  }
  
  makeRequest = () => {
    this.setState({ loading: true });
    if (!this.state.imgFile) return;
    let fd = new FormData();
    fd.append('image', this.state.imgFile);
    axios.post(`/predict?w=${this.state.windowSize}`, fd)
    .then(async (response) => {
      const results = response.data.predictions ? response.data : await this.checkProgress(response.data.job_id);
      this.setState({
        loading: false,
        results,
        sliderTouched: false,
        progress: 0
      });
    })
    .catch(err => {
      let errorMessage = 'Something went wrong';
      if (err.response) {
        if (err.response.data && err.response.data.message) errorMessage = err.response.data.message;
        if (typeof err.response.data === 'string') errorMessage = err.response.data;
      } else if (err.message) errorMessage = err.message;
      this.setState({ errorMessage, loading: false, progress: 0 });
    })
  }

  verifyImageDimensions = (L, H) => {
    let delta = Math.pow( ( H*H + 7598*H*L + L*L ), 0.5 );
    let minWindowSize = Math.ceil( (delta - H - L) / 1899 );
    if (minWindowSize < 10 ) minWindowSize = 10;
    let maxWindowSize = MAX_WINDOW_SIZE;
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

            <Canvas
              loading={this.state.loading}
              windowSize={this.state.windowSize}
              imgObj={this.state.imgObj}
              results={this.state.results} />

            {this.state.progress > 0 && this.state.loading && <ProgressDisplay value={this.state.progress} />}
            
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