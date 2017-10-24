import React from 'react';
import TimeView from './TimeView';
import Day from './Day';

export default function CalendarView() {
  const dayNodes = [];
  const dayNames = [
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ];

  var i = 0;
  dayNames.forEach((el) => {
    dayNodes.push(
      <Day key={el + i++} name={el} />
    )
  });

  return (
    <div>
      <TimeView start={8} end={18} />
      {dayNodes}
    </div>
  );
}
