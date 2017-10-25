import React from 'react';
import Event from './Event';

export default function DayView(props) {
  const { name, events } = props;
  return (
    <div className="day">
      <h2 className="day--name">{name}</h2>
      <ul className="schedule">
        {events.map((el, i) => <Event key={i} data={el} />)}
      </ul>
    </div>
  );
}
