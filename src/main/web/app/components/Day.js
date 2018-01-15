import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import DayView from './DayView';

export default function Day(props) {
  const { eventData, start, end, isCurrent, date } = props;
  eventData.forEach((el) => {
    // Calculate dimensions
    const startTime = el.startTime.split(':');
    const endTime = el.endTime.split(':');
    const startY = ((startTime[0] - start) + (startTime[1] / 60))
      * (100 / (end - start + 0.5));
    const endY = ((endTime[0] - start) + (endTime[1] / 60))
      * (100 / (end - start + 0.5));
    const duration = endY - startY;

    const height = `${duration}%`;
    const top = `${startY}%`;

    el.height = height;
    el.top = top;
    el.duration = duration;
  });
  return (
    <DayView
      name={dateFormat(date, 'ddd. dd.')}
      events={eventData}
      start={start}
      end={end}
      isCurrent={isCurrent}
    />
  );
}

Day.propTypes = {
  eventData: PropTypes.arrayOf(PropTypes.object).isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  date: PropTypes.object.isRequired,
  isCurrent: PropTypes.bool,
};

Day.defaultProps = { isCurrent: false };
