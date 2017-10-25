import React from 'react';

export default function TimeView(props) {
  // TODO Can we have a short cheat for this (e.g. with Coffee?)
  const numbers = [];
  for (let timeKey = props.start; timeKey <= props.end; timeKey++) {
    numbers.push(timeKey);
  }

  return (
    <div className="day time">
      <h2 className="day--name"></h2>
      <ul className="schedule">
        {numbers.map(k => <li className="time-name" key={k}>{k}</li>)}
      </ul>
    </div>
  );
}
