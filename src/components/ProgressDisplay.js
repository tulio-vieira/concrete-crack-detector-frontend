import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
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
    transform: 'translate(-50%, -50%)',
    '& span': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }
}));

export default function ProgressDisplay({value}) {
  const classes = useStyles();
  return (
    <div className={classes.progressDisplay}>
      <CircularProgress variant="static" color='primary' value={value} />
      <Typography variant="caption" component="span" color="inherit">{value}%</Typography>
  </div>
  );
}