/* global document window */
import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import $ from 'jquery';
import Main from './Main';

// This is a fix for #section1 links. It scrolls
const shiftWindow = () => { window.scrollBy(0, -64); };
if (window.location.hash) shiftWindow();
window.addEventListener('hashchange', shiftWindow);

function getParams(args) {
  const params = {};
  const pStrings = args.split('&');
  Object.keys(pStrings).forEach((param) => {
    const kvStrings = pStrings[param].split('=');
    params[kvStrings[0]] = kvStrings[1];
  });
  return params;
}

const getYearlyCalendar = (url, success, error) => {
  const deSuffix = '.de/rapla?';
  const params = getParams(url.substring(url.indexOf(deSuffix) + deSuffix.length));
  if (params.key) {
    $.ajax({
      url: `Rablabla?url=${url}`,
      type: 'POST',
      success,
      error,
    });
    return 'Accessing calendar file...';
  } else if (params.user && params.file) {
    success(`${url}&page=ical`);
  } else {
    console.error(`Yearly calendar not supported for url: ${url}`);
  }
  return 'Reqeust denied.';
};

const getAppointments = (url, day, month, year, success, error) => {
  $.ajax({
    url: `Rablabla?url=${encodeURIComponent(url)}&day=${day}&month=${month}&year=${year}`,
    type: 'GET',
    success,
    error,
  });
  return 'Accessing appointments...';
};

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Render the main app react component into the app div.
// For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
render(<Main getAppointments={getAppointments} getICSLink={getYearlyCalendar} />, document.getElementById('app'));
