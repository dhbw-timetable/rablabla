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

const getWeekNumber = (d) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // week end on sunday
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return Math.ceil((((d - new Date(Date.UTC(d.getUTCFullYear(), 0, 1))) / 86400000) + 1) / 7);
};

export default function Calendar(props) {
  const currentDay = new Date();
  const { dailyEvents, date, start, end } = props;
  return (
    <container>
      <div className="calendar">
        <TimeView start={start} end={end} />
        {dayNames.map((name, i) => (
          <Day
            key={i}
            eventData={dailyEvents[i]}
            name={name}
            start={start}
            end={end}
            isCurrent={i === (currentDay.getDay() - 1)
              && getWeekNumber(currentDay) === getWeekNumber(date)
              && currentDay.getFullYear() === date.getFullYear()}
          />))}
      </div>
    </container>
  );
}

Calendar.propTypes = {
  dailyEvents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  date: PropTypes.object.isRequired,
  start: PropTypes.number,
  end: PropTypes.number,
};

Calendar.defaultProps = {
  start: 8,
  end: 18,
};
