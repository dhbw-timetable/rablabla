import React from 'react';
import Event from './Event';

export default function DayView(props) {
  const { name, events, isCurrent, end, start } = props;
  return (
    <div className={`day ${isCurrent ? 'is-current' : ''}`}>
      <h2 className="day--name">{name}</h2>
      <ul className="schedule" style={{ backgroundSize: `100% calc(100% / ${end - start + 0.5})` }}>
        {events.map((el, i) => <Event key={i} data={el} />)}
      </ul>
    </div>
  );
}
