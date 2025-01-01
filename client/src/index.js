import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import '@fontsource/roboto';

const theme = createTheme(
  {
    palette : {
      primary : {
        main : "#9966CC"
      },
      secondary : {
        main : "#FFFFFF"
      },
    },
    typography:{
      fontFamily: 'Roboto,',
    }
  }
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
       <ThemeProvider theme={theme}>
         <CssBaseline />
           <App />
       </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);


