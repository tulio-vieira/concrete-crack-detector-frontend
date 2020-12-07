import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  progressDisplay: {
    zIndex: 8,
    background: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
}));

export default function ProgressDisplay() {
  const classes = useStyles();
  return (
    <div className={classes.progressDisplay}>
      <CircularProgress variant="indeterminate" color='primary' />
    </div>
  );
}