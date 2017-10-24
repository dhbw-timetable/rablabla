import React from 'react';
import TimeView from './TimeView';
import Day from './Day';

export default function CalendarView(props) {
  const dayNames = [
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ];
  const dailyEventData = props.dailyEventData;
  const dayNodes = [];

  for (var i = 0; i < 6; i++) {
    dayNodes.push(
      <Day key={i} eventData={dailyEventData[i]} name={dayNames[i]} />
    );
  }

  return (
    <div>
      <TimeView start={8} end={18} />
      {dayNodes}
    </div>
  );
}
