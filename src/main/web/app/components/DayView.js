import React from 'react';
import Event from './Event';

export default function DayView() {
  const events = [];

  return (
    <div>
      <h2>{this.props.name}</h2>
        <ul>
          {events}
        </ul>
    </div>
  );
}
