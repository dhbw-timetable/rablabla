import React from 'react';

export default function TimeView(props) {
  const numbers = [];

  for (var i = props.start; i <= props.end; i++) {
    numbers.push(<li className="time-name" key={i}>{i}</li>);
  }

  return (
    <div className="day time">
      <h2 className="day--name"></h2>
      <ul className="schedule">
        {numbers}
      </ul>
    </div>
  );
}
