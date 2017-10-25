import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import React from 'react';
import PropTypes from 'prop-types';
import yellow from 'material-ui/colors/yellow';
import NavigationBar from './components/NavigationBar';
import Calendar from './components/Calendar';

export default function Main(props) {
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
  const { getAppointments, getICSLink } = props;
  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <NavigationBar
          title="KW 42"
          iconColor="contrast"
          iconStyle={{ fontSize: 25, marginRight: 15 }}
          icons={[
            {
              href: 'https://www.google.com/',
              name: 'file_download',
            },
            {
              href: 'https://github.com/',
              name: 'settings',
            },
          ]}
        />
        <Calendar getAppointments={getAppointments} getICSLink={getICSLink} />
      </div>
    </MuiThemeProvider>
  );
}

Main.propTypes = {
  getAppointments: PropTypes.func.isRequired,
  getICSLink: PropTypes.func.isRequired,
};
