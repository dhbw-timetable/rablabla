import React from 'react';
import { createMuiTheme } from 'material-ui/styles';
import yellow from 'material-ui/colors/yellow';
import Slide from 'material-ui/transitions/Slide';
import $ from 'jquery';

// = = = = B A C K E N D = = = = =

// for local testing against staging backend
const ajaxTarget = window.location.href.indexOf('rablabla.mybluemix.net') !== -1 ? '' : 'https://rablabla-staging.mybluemix.net';

const getParams = (args) => {
  const params = {};
  const pStrings = args.split('&');
  Object.keys(pStrings).forEach((param) => {
    const kvStrings = pStrings[param].split('=');
    params[kvStrings[0]] = kvStrings[1];
  });
  return params;
};

const getICSLink = (url, success, error) => {
  const deSuffix = '.de/rapla?';
  const baseURL = url.substring(0, url.indexOf(deSuffix) + deSuffix.length);
  const params = getParams(url.substring(url.indexOf(deSuffix) + deSuffix.length));
  if (params.key) {
    $.ajax({
      url: `${ajaxTarget}/Rablabla?url=${url}`,
      type: 'POST',
      success,
      error,
    });
    return 'Accessing calendar file...';
  } else if (params.user && params.file) {
    console.log(baseURL);
    success(`${baseURL}page=ical&user=${params.user}&file=${params.file}`);
  } else {
    console.error(`Yearly calendar not supported for url: ${url}`);
  }
  return 'Request denied.';
};

const getAppointments = (url, mmt, success, error, pre) => {
  pre(mmt);
  $.ajax({
    url: `${ajaxTarget}/Rablabla?url=${encodeURIComponent(url)}&day=${mmt.date()}&month=${mmt.month() + 1}&year=${mmt.year()}`,
    type: 'GET',
    success,
    error,
  });
  return 'Accessing appointments...';
};

// = = = = T H E M E = = = = =

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

const slidingTransition = props => <Slide direction="up" {...props} />;

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

// = = = = = = D A T E - U T I L S = = = = = = =

module.exports = {
  getParams,
  slidingTransition,
  theme,
  getAppointments,
  getICSLink,
};
