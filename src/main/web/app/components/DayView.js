import React from 'react';
import Event from './Event';

export default function DayView(props) {
  const eventData = props.eventData;
  const eventNodes = [];

  let i = 0;
  eventData.forEach((el) => {
    eventNodes.push(
      <Event key={i++} data={el} />
    );
  })

  return (
    <div>
      <h2>{props.name}</h2>
        <ul>
          {eventNodes}
        </ul>
    </div>
  );
}
