import React from 'react';
import Event from './Event';

export default function DayView(props) {
  const { name, events } = props;
  return (
    <div className={`day ${props.isCurrent ? 'is-current' : ''}`}>
      <h2 className="day--name">{name}</h2>
      <ul className="schedule" style={{ backgroundSize: `100% calc(100% / ${props.end - props.start + 0.5})` }}>
        {events.map((el, i) => <Event key={i} data={el} />)}
      </ul>
    </div>
  );
}
