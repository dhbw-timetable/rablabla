/* global document window */
import React from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main';

require('moment/locale/de');

// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

moment.locale('de');
moment.locale();

render(<Main />, document.getElementById('app'));
