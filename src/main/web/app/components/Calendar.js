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
  return (
    <container>
      <div className="calendar">
        <TimeView start={7} end={18} />
        {dayNames.map((name, i) => <Day key={i} eventData={props.dailyEvents[i]} name={name} />)}
      </div>
    </container>
  );
}

Calendar.propTypes = {
  dailyEvents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
};
