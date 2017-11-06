import React from 'react';
import DayView from './DayView';

export default function Day(props) {
  const { eventData, start, end, name, isCurrent } = props;
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
      name={name}
      events={eventData}
      start={start}
      end={end}
      isCurrent={isCurrent}
    />
  );
}
