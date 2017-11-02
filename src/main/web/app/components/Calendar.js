import React from 'react';
import PropTypes from 'prop-types';
import TimeView from './TimeView';
import Day from './Day';

const dayNames = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
];

export default function Calendar(props) {
  const start = 8;
  const end = 18;
  return (
    <container>
      <div className="calendar">
        <TimeView start={start} end={end} />
        {dayNames.map((name, i) =>
          <Day key={i} eventData={props.dailyEvents[i]} name={name} start={start} end={end} />)}
      </div>
    </container>
  );
}

Calendar.propTypes = {
  dailyEvents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
};
