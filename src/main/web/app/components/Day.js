import React from 'react';
import DayView from './DayView';

export default function Day(props) {
  /* const rawEvents = this.props.daylyEvents;
  const processedEvents = [];

  rawEvents.forEach((el) => {
    // Calculate dimensions
    const startTime = el.startTime.split(':');
    const endTime = el.endTime.split(':');
    const startY = ((startTime[0] - 8) + (startTime[1] / 60)) * 10;
    const endY = ((endTime[0] - 8) + (endTime[1] / 60)) * 10;
    const duration = endY - startY;

    const height = 'calc(' + duration + '% - ' + ((duration / 10) * 0.2).toFixed(2) + 'em)';
    const top = 'calc(' + startY + '% - ' + ((0.2 * startY) / 10).toFixed(2) + 'em)';

    // Parse information
    const time = el.startTime;
    const course = el.course;
    const ressources = el.ressources;
    const person = el.person;

    processedEvents.push({
      course: course,
      time: time,
      ressources: ressources,
      person: person,
      top: top,
      height: height,
    });
  }); */

  return (
    <DayView name={props.name} />
  );
}
