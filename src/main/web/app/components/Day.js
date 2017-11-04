import React from 'react';
import DayView from './DayView';

export default function Day(props) {
  const events = props.eventData;
  events.forEach((el) => {
    // Calculate dimensions
    const startTime = el.startTime.split(':');
    const endTime = el.endTime.split(':');
    const startY = ((startTime[0] - props.start) + (startTime[1] / 60)) * (100 / (props.end - props.start + 0.5));
    const endY = ((endTime[0] - props.start) + (endTime[1] / 60)) * (100 / (props.end - props.start + 0.5));
    const duration = endY - startY;

    const height = `${duration}%`;
    const top = `${startY}%`;

    el.height = height;
    el.top = top;
    el.duration = duration;
  });
  return (
    <DayView
      name={props.name}
      events={events}
      start={props.start}
      end={props.end}
    />
  );
}
