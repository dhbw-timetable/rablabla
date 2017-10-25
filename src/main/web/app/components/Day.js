import React from 'react';
import DayView from './DayView';

export default function Day(props) {
  const events = props.eventData;
  events.forEach((el) => {
    // Calculate dimensions
    const startTime = el.startTime.split(':');
    const endTime = el.endTime.split(':');
    const startY = ((startTime[0] - 8) + (startTime[1] / 60)) * 10;
    const endY = ((endTime[0] - 8) + (endTime[1] / 60)) * 10;
    const duration = endY - startY;

    const height = 'calc(' + duration + '% - ' + ((duration / 10) * 0.2).toFixed(2) + 'em)';
    const top = 'calc(' + startY + '% - ' + ((0.2 * startY) / 10).toFixed(2) + 'em)';

    el.height = height;
    el.top = top;
  });
  
  return (
    <DayView
      name={props.name}
      events={events}
    />
  );
}
