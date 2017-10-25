/* global document window */
import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main';

const shiftWindow = () => { window.scrollBy(0, -64); };
if (window.location.hash) shiftWindow();
window.addEventListener('hashchange', shiftWindow);

function getAppointments(url, day, month, year, success, error) {
  $.ajax({
    url: `Rablabla?url=${encodeURIComponent(url)}&day=${day}&month=${month}&year=${year}`,
    type: 'GET',
    success,
    error,
  });
  return 'Accessing appointments...';
}

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Render the main app react component into the app div.
// For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
render(
  <Main getAppointments={getAppointments} />,
document.getElementById('app'));
