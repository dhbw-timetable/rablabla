import React from 'react';
import moment from 'moment';
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
  // backend uses monday as first day of the week
  // we use en locale so we make an exception for sundays
  $.ajax({
    url: `${ajaxTarget}/Rablabla?url=${encodeURIComponent(url)}&day=${mmt.day() > 0 ? mmt.date() : mmt.day(1).date()}&month=${mmt.month() + 1}&year=${mmt.year()}`,
    type: 'GET',
    success,
    error,
  });
  return 'Accessing appointments...';
};

const parseDates = (events) => {
  events.forEach((el) => {
    const dateElements = el.date.split('.');
    el.Date = moment().date(dateElements[0]).month(dateElements[1] - 1).year(dateElements[2]);
  });
  return events;
};

// check if there's a collision between the events a and b
const intersects = (a, b) => {
  const startTimeWrapperA = a.startTime.split(':');
  const endTimeWrapperA = a.endTime.split(':');
  const startMinA = parseInt(startTimeWrapperA[0]) * 60 + parseInt(startTimeWrapperA[1]);
  const endMinA = parseInt(endTimeWrapperA[0]) * 60 + parseInt(endTimeWrapperA[1]);

  const startTimeWrapperB = b.startTime.split(':');
  const endTimeWrapperB = b.endTime.split(':');
  const startMinB = parseInt(startTimeWrapperB[0]) * 60 + parseInt(startTimeWrapperB[1]);
  const endMinB = parseInt(endTimeWrapperB[0]) * 60 + parseInt(endTimeWrapperB[1]);

  return (startMinA <= startMinB && endMinA >= endMinB) // a contains(equals) b
    || (startMinA >= startMinB && endMinA <= endMinB) // b contains(equals) a
    || (startMinA < startMinB && endMinA < endMinB && endMinA > startMinB) // a intersects b
    || (startMinA > startMinB && endMinA > endMinB && startMinA < endMinB) // b intersects a
  ;
};

// checks if the target event intersects any of the dayAgenda (except itself)
const intersectsAny = (targetEvent, dayAgenda) => {
  return dayAgenda.filter(evnt => evnt !== targetEvent && intersects(targetEvent, evnt)).length > 0;
};

const makeDays = (events) => {
  const dailyEvents = [[], [], [], [], [], [], []];

  events.forEach((el) => {
    dailyEvents[el.Date.day()].push(el);
  });

  // for each day in week
  dailyEvents.forEach((dayAgenda) => {
    // a stack of columns
    const stacks = [[]];

    // for each event of this day
    dayAgenda.forEach((evnt) => {
      let i = 0, finish = false;
      while (!finish) {
        // if there'd be an intersection on this stack
        if (!intersectsAny(evnt, stacks[i])) {
          stacks[i].push(evnt);
          finish = true;
        } else {
          i++;
          // open up a new column
          if (stacks.length === i) {
            stacks.push([evnt]);
            finish = true;
          }
        }
      }
    });

    // assign the column values
    stacks.forEach((colLevel, i) => {
      colLevel.forEach((el) => {
        el.col = i;
        el.maxCol = stacks.length;
        el.intersections = dayAgenda.filter(evnt => evnt !== el && intersects(el, evnt)).length;
      });
    });
  });

  console.log(dailyEvents);

  return dailyEvents;
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

module.exports = {
  getParams,
  slidingTransition,
  theme,
  parseDates,
  makeDays,
  getAppointments,
  getICSLink,
  ajaxTarget,
};
