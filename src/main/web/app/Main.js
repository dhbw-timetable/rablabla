import Paper from 'material-ui/Paper';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import React from 'react';
import yellow from 'material-ui/colors/yellow';
import NavigationBar from './components/NavigationBar';
import Calendar from './components/Calendar';


export default function Main() {
  const dhbwtimetablepalette = {
    50: '#f7e7e7',
    100: '#eac3c3',
    200: '#dd9c9c',
    300: '#cf7474',
    400: '#c45656',
    500: '#ba3838',
    600: '#b33232',
    700: '#ab2b2b',
    800: '#a32424',
    900: '#941717',
    A100: '#ffc9c9',
    A200: '#ff9696',
    A400: '#ff6363',
    A700: '#ff4a4a',
    contrastDefaultColor: 'light',
  };

  const theme = createMuiTheme({
    palette: {
      primary: dhbwtimetablepalette,
      secondary: {
        ...dhbwtimetablepalette,
        A400: 'white', // Accent color
      },
      error: yellow,
    },
  });

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <div>
          <NavigationBar
            title="KW 42"
            iconSize="48px"
            iconColor="white"
            icons={[
              {
                href: 'https://www.xing.com/',
                viewBox: '-10 0 38 24',
                paths: ['M13.58,24,8.25,14.33,16.32,0h4.93L13.19,14.33,18.46,24ZM6.29,5H1.35L4.11,9.74,0,17H4.91L9,9.73Z'],
              },
              {
                href: 'https://www.linkedin.com/',
                viewBox: '-15 -16 110 100',
                paths:
                [
                  'M77.9,58.59h-.61V57.34h.78c.4,0,.86.07.86.59S78.46,58.59,77.9,58.59Zm.61.37a.94.94,0,0,0,.95-1c0-.7-.42-1-1.3-1h-1.4v3.68h.53V59h.65v0l1,1.58h.57L78.44,59h.07',
                  'M78,61.8a3,3,0,1,1,3-3A3,3,0,0,1,78,61.8Zm0-6.51a3.48,3.48,0,1,0,3.49,3.48A3.45,3.45,0,0,0,78,55.28',
                  'M61.35,61.35H50.68V44.64c0-4-.07-9.11-5.55-9.11s-6.41,4.34-6.41,8.82v17H28.05V27H38.29v4.7h.15a11.22,11.22,0,0,1,10.1-5.55c10.81,0,12.81,7.11,12.81,16.37ZM16,22.3a6.19,6.19,0,1,1,6.19-6.19A6.19,6.19,0,0,1,16,22.3Zm5.34,39.05H10.67V27H21.35ZM66.67,0H5.31A5.26,5.26,0,0,0,0,5.19V66.8A5.26,5.26,0,0,0,5.31,72H66.67A5.27,5.27,0,0,0,72,66.8V5.19A5.26,5.26,0,0,0,66.67,0',
                ],
              },
              {
                href: 'https://github.com/',
                viewBox: '0 -10 33 50',
                paths: ['M32.58,16.29A16.29,16.29,0,0,1,21.45,31.74c-.83.16-1.12-.35-1.12-.78s0-2.29,0-4.47a3.89,3.89,0,0,0-1.11-3c3.63-.4,7.44-1.78,7.44-8A6.29,6.29,0,0,0,25,11.07a5.85,5.85,0,0,0-.16-4.31s-1.37-.44-4.48,1.67a15.44,15.44,0,0,0-8.16,0C9.1,6.32,7.73,6.76,7.73,6.76a5.86,5.86,0,0,0-.16,4.31A6.3,6.3,0,0,0,5.9,15.44c0,6.24,3.8,7.64,7.42,8.05a3.48,3.48,0,0,0-1,2.18,3.47,3.47,0,0,1-4.74-1.35A3.42,3.42,0,0,0,5,22.63s-1.59,0-.11,1A4.31,4.31,0,0,1,6.74,26s1,3.17,5.49,2.18c0,1.36,0,2.38,0,2.77s-.3.93-1.11.79A16.29,16.29,0,1,1,32.58,16.29Z'],
              },
            ]}
          />
        <Calendar />
        </div>
      </MuiThemeProvider>
    </div>
  );
}
