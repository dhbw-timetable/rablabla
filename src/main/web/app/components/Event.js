import React from 'react';

export default function Event(props) {
  const data = props.data;

  return (
    <li className="event">
        <p className="event--time">{data.time}</p>
        <h3 className="event--header">{data.title}</h3>
        <p className="event--body">{data.name}</p>
        <p className="event--footer">{data.ressource}</p>
    </li>
  );
}
