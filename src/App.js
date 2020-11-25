import React from 'react';
import NavBar from './components/Navbar';
import Detector from './containers/Detector'
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { GitHub } from '@material-ui/icons';
import { green, indigo } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: '0 20%',
    paddingTop: 60,
    minHeight: 'calc(100vh - 60px - 72.8px)',
    [theme.breakpoints.down(960)]: {
        margin: '0 10%',
    },
    [theme.breakpoints.down(600)]: {
        margin: '0 5%',
    },
    [theme.breakpoints.down(350)]: {
        margin: '0 16px',
    }
  },
  footer: {
    width: '100%',
    textAlign: 'center',
    padding: '8px 0',
    backgroundColor: '#212121',
    '& p': {
      fontSize: '0.8em',
      margin: '0.5em',
      color: '#cacaca'
    },
    '& a': {
      display: 'inline-flex',
      alignItems: 'center',
      color: 'inherit'
    }
  }
}));

export default function App() {
  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: indigo,
      secondary: green
    }
  });
  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <main className={classes.wrapper}>
        <Detector />
      </main>
      <footer className={classes.footer}>
        <p>Created by: Tulio Vieira</p>
        <p><a href="https://github.com/tulio-vieira/"><GitHub style={{height: '0.8em'}}/><span>/tulio-vieira</span></a></p>
      </footer>
    </ThemeProvider>
  );
}