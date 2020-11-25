import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { GitHub } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  titleText: {
    margin: '0.2em auto 0.2em 0',
    fontSize: '1.25rem',
    fontWeight: 300
  },
  toolbar: {
    paddingLeft: 32,
    paddingRight: 32,
    minHeight: 56,
    display: 'flex',
    alignItems: 'center'
  }
}));

export default function NavBar() {
  const classes = useStyles();
  return (
    <AppBar>
      <div className={classes.toolbar}>
        <p className={classes.titleText}>CONCRETE CRACK DETECTOR</p>
        <a href="https://github.com/tulio-vieira/" style={{textDecoration: 'none', color: 'inherit', lineHeight: 0}}>
          <IconButton edge="end" color="inherit">
            <GitHub />
          </IconButton>
        </a>
      </div>
    </AppBar>
  );
}