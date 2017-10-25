import React from 'react';

export default function Event(props) {
  const { height, top, startTime, endTime, course, persons, resources } = props.data;
  return (
    <li style={{ height, top }} className="event">
      <p className="event--time">{`${startTime} - ${endTime}`}</p>
      <h3 className="event--header">{course}</h3>
      <p className="event--body">{persons}</p>
      <p className="event--footer">{resources}</p>
    </li>
  );
}
