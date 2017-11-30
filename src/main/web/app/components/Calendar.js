import React from 'react';
import PropTypes from 'prop-types';
import TimeView from './TimeView';
import Day from './Day';

// ISO 8601
export function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // week end on sunday
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return Math.ceil((((d - new Date(Date.UTC(d.getUTCFullYear(), 0, 1))) / 86400000) + 1) / 7);
}

function normalize(d) {
  const nd = new Date(d.getTime());
  nd.setDate(nd.getDate() - nd.getDay() + 1);
  return nd;
}

export default function Calendar(props) {
  const currentDay = new Date();
  const { weekEvents, date, start, end } = props;
  const normDate = normalize(date);
  return (
    <container>
      <div className="calendar">
        <TimeView start={start} end={end} />
        {new Array(6).fill().map((_, i) => {
          const day = new Date(normDate.getTime());
          day.setDate(day.getDate() + i); // shift
          return (<Day
            key={i}
            eventData={weekEvents[i]}
            name={name}
            start={start}
            end={end}
            date={day}
            isCurrent={i === (currentDay.getDay() - 1)
              && getWeekNumber(currentDay) === getWeekNumber(date)
              && currentDay.getFullYear() === date.getFullYear()}
          />);
        })}
      </div>
    </container>
  );
}

Calendar.propTypes = {
  weekEvents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  date: PropTypes.object.isRequired,
  start: PropTypes.number,
  end: PropTypes.number,
};

Calendar.defaultProps = {
  start: 8,
  end: 18,
};
