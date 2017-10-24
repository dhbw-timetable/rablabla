import React from 'react';

export default function Event(props) {
  const data = props.data;

  return (
    <li>
        <p>{data.time}</p>
        <h3>{data.title}</h3>
        <p>{data.name}</p>
        <p>{data.ressource}</p>
    </li>
  );
}
