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
  const startMinA = parseInt(startTimeWrapperA[0] * 60 + startTimeWrapperA[1]);
  const endMinA = parseInt(endTimeWrapperA[0] * 60 + endTimeWrapperA[1]);

  const startTimeWrapperB = b.startTime.split(':');
  const endTimeWrapperB = b.endTime.split(':');
  const startMinB = parseInt(startTimeWrapperB[0] * 60 + startTimeWrapperB[1]);
  const endMinB = parseInt(endTimeWrapperB[0] * 60 + endTimeWrapperB[1]);

  return (startMinA <= startMinB && endMinA >= endMinB) // a contains(equals) b
    || (startMinA >= startMinB && endMinA <= endMinB) // b contains(equals) a
    || (startMinA < startMinB && endMinA < endMinB && endMinA > startMinB) // a intersects b
    || (startMinA > startMinB && endMinA > endMinB && startMinA < endMinB) // b intersects a
  ;
};

/* divides a list of events into the maximum-non-colliding list of events and the rest
const splitGreedy = (eventStack) => {
  const filterFalse = [];
  let done = false;
  do {
    // count the intersections of each event
    eventStack.forEach((ev) => {
      ev.intersectionCount = 0;
      eventStack.filter(otherEvent => ev !== otherEvent).forEach((otherEvent) => {
        if (intersects(ev, otherEvent)) {
          ev.intersectionCount++;
        }
      });
    });

    // sort for intersection count
    eventStack.sort((a, b) => a.intersectionCount - b.intersectionCount);

    // if collisions remaining -> repeat without the max intersects element
    if (eventStack.filter(ev => ev.intersectionCount > 0).length > 0) {
      filterFalse.push(eventStack.pop());
    } else {
      done = true;
    }
  } while (!done);

  return { filterTrue: eventStack, filterFalse };
}; */

const splitterSearch = (possibleSolutions, todo, current) => {
  // get every event without collision to current
  todo.filter((testEv) => {
    return current.filter(safeEv => intersects(safeEv, testEv)).length === 0;
  }).forEach((semiSafeEv) => {
    const newSolution = current.concat([semiSafeEv]);
    possibleSolutions.push(newSolution);
    const remaining = todo.filter(el => el !== semiSafeEv);
    splitterSearch(possibleSolutions, remaining, newSolution);
  });
};

// same as splitGreedy() but more intelligent
const splitter = (eventStack) => {
  const safe = [], todo = [];
  // count the intersections of each event
  eventStack.forEach((ev) => {
    ev.intersectionCount = 0;
    eventStack.filter(otherEvent => ev !== otherEvent).forEach((otherEvent) => {
      if (intersects(ev, otherEvent)) {
        ev.intersectionCount++;
      }
    });
  });

  // divide into safe and colliding
  eventStack.forEach((ev) => {
    (ev.intersectionCount > 0 ? todo : safe).push(ev);
  });

  const possibleSolutions = [];
  let filterTrue = safe;
  // if there are colliding elements
  if (todo.length > 0) {
    splitterSearch(possibleSolutions, todo, []);
    // search for biggest solution
    possibleSolutions.sort((arr1, arr2) => arr2.length - arr1.length);
    filterTrue = safe.concat(possibleSolutions[0]);
  }
  // merge with safe ones
  return {
    filterTrue,
    filterFalse: eventStack.filter(ev => filterTrue.indexOf(ev) === -1),
  };
};

const makeDays = (events) => {
  /* console.log(splitter([
    {
      date: '11.03.2018',
      Date: moment().date(11).month(3).year(2018),
      startTime: '08:00',
      endTime: '14:00',
      course: 'Webducksign',
      persons: 'Daisy Duck',
      resources: 'STG-INF42X',
    },
    {
      date: '11.03.2018',
      Date: moment().date(11).month(3).year(2018),
      startTime: '08:00',
      endTime: '14:00',
      course: 'Ducktales Introduction',
      persons: 'Donald Duck',
      resources: 'STG-INF42X',
    },
    {
      date: '11.03.2018',
      Date: moment().date(11).month(3).year(2018),
      startTime: '16:00',
      endTime: '18:00',
      course: 'Mousorithms',
      persons: 'Micky Mouse',
      resources: 'STG-INF42X',
    },
  ])); */
  const dailyEvents = [[
    {
      date: '11.03.2018',
      Date: moment().date(11).month(3).year(2018),
      startTime: '08:00',
      endTime: '14:00',
      course: 'Webducksign',
      persons: 'Daisy Duck',
      resources: 'STG-INF42X',
    },
    {
      date: '11.03.2018',
      Date: moment().date(11).month(3).year(2018),
      startTime: '08:00',
      endTime: '14:00',
      course: 'Ducktales Introduction',
      persons: 'Donald Duck',
      resources: 'STG-INF42X',
    },
    {
      date: '11.03.2018',
      Date: moment().date(11).month(3).year(2018),
      startTime: '16:00',
      endTime: '18:00',
      course: 'Mousorithms',
      persons: 'Micky Mouse',
      resources: 'STG-INF42X',
    },
  ], [], [], [], [], [], []];
  events.forEach((el) => {
    dailyEvents[el.Date.day()].push(el);
  });

  dailyEvents.forEach((day) => {
    // init
    day.forEach((el) => {
      el.col = 0;
    });
    const todoStack = [day];
    const doneStack = [];

    // execute algorithm until no collisions remaining
    while (todoStack.length > 0) {
      const divison = splitter(todoStack.pop());
      if (divison.filterFalse.length > 0) todoStack.push(divison.filterFalse);
      doneStack.push(divison.filterTrue);
    }

    // assign the col values
    doneStack.forEach((colLevel, i) => {
      colLevel.forEach((el) => {
        el.col = i;
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

// = = = = = = D A T E - U T I L S = = = = = = =

module.exports = {
  getParams,
  slidingTransition,
  theme,
  parseDates,
  makeDays,
  getAppointments,
  getICSLink,
};
