import React from 'react';

export default function Event() {
  const data = {
    time: '13:00',
    title: 'Example Lecture',
    name: 'Prof. X',
    ressource: 'STGT-EXA',
  };

  return (
    <li>
        <p>{data.time}</p>
        <h3>{data.title}</h3>
        <p>{data.name}</p>
        <p>{data.ressource}</p>
    </li>
  );
}
