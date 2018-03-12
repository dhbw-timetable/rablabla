import React from 'react';
import PropTypes from 'prop-types';
import DayView from './DayView';

export default function Day(props) {
  const { eventData, start, end, isCurrent, date, showBackdrop } = props;

  eventData.forEach((el) => {
    // Calculate dimensions
    const startTime = el.startTime.split(':');
    const endTime = el.endTime.split(':');
    const startY = ((startTime[0] - start) + (startTime[1] / 60))
      * (100 / (end - start + 0.5));
    const endY = ((endTime[0] - start) + (endTime[1] / 60))
      * (100 / (end - start + 0.5));

    el.duration = endY - startY;
    el.height = `${el.duration}%`;
    el.top = `${startY}%`;
  });

  const lineY = ((date.hour() - start) + (date.minute() / 60))
    * (100 / (end - start + 0.5));

  return (
    <DayView
      name={date.format('dd. D.')}
      events={eventData}
      start={start}
      end={end}
      isCurrent={isCurrent}
      showBackdrop={showBackdrop}
      lineY={lineY}
    />
  );
}

Day.propTypes = {
  eventData: PropTypes.arrayOf(PropTypes.object).isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  date: PropTypes.object.isRequired,
  showBackdrop: PropTypes.func.isRequired,
  isCurrent: PropTypes.bool,
};

Day.defaultProps = { isCurrent: false };
