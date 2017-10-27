import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import React from 'react';
import PropTypes from 'prop-types';
import yellow from 'material-ui/colors/yellow';
import NavigationBar from './components/NavigationBar';
import Calendar from './components/Calendar';

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate((d.getUTCDate() + 4) - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  // Return array of year and week number
  return weekNo;
}

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
  const title = `KW${getWeekNumber(new Date())}`;
  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <NavigationBar
          title={title}
          icons={[
            { icon: 'date_range', onClick: () => {} },
            { icon: 'question_answer', onClick: () => {} },
          ]}
          menuItems={[
            { text: 'Refresh', onClick: () => {} },
            { text: 'Get external calendar', onClick: () => {} },
            { text: 'Switch timetable', onClick: () => {} },
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
