import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  sliderContainer: {
    textAlign: 'center',
    '& p': {
      margin: '0 0.5em'
    }
  },
  disabled: {
    textAlign: 'center',
    '& p': {
      margin: '0 0.5em',
      color: '#707070'
    }
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8
  },
  slider: {
    maxWidth: 300,
    appearance: 'none',
    height: 15,
    borderRadius: 5,  
    background: '#d3d3d3',
    outline: 'none',
    opacity: 0.7,
    transition: 'opacity .2s',
    '&::-webkit-slider-thumb': {
      appearance: 'none',
      width: 25,
      height: 25,
      borderRadius: '50%', 
      background: theme.palette.primary.main,
      cursor: 'pointer'
    },
    '&:disabled&::-webkit-slider-thumb': {
      background: 'grey',
      cursor: 'not-allowed'
    }
  }
}));

export default function Slider({disabled, value, min, max, onChange}) {
  const classes = useStyles();

  return (
    <div className={disabled ? classes.disabled : classes.sliderContainer}>
      <div className={classes.wrapper}>
        <p>{min}</p>
          <input
            className={classes.slider}
            type='range'
            disabled={disabled}
            value={value}
            min={min}
            max={max}
            onChange={onChange} />
        <p>{max}</p>
      </div>
      <p>Window size: {value}px</p>
    </div>
  );
}