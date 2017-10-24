import React from 'react';

export default function Event(props) {
  const data = props.data;

  return (
    <li className="event">
        <p className="event--time">{data.startTime + ' : ' + data.endTime}</p>
        <h3 className="event--header">{data.course}</h3>
        <p className="event--body">{data.persons}</p>
        <p className="event--footer">{data.resources}</p>
    </li>
  );
}
