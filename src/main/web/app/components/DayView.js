import React from 'react';
import Event from './Event';

export default function DayView(props) {
  const events = [];

  return (
    <div>
      <h2>{props.name}</h2>
        <ul>
          <Event />
        </ul>
    </div>
  );
}
