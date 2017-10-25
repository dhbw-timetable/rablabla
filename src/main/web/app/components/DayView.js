import React from 'react';
import Event from './Event';

export default function DayView(props) {
  const events = props.events;
  const eventNodes = [];

  let i = 0;
  events.forEach((el) => {
    eventNodes.push(
      <Event key={i++} data={el} />
    );
  })

  return (
    <div className="day">
      <h2 className="day--name">{props.name}</h2>
        <ul className="schedule">
          {eventNodes}
        </ul>
    </div>
  );
}
