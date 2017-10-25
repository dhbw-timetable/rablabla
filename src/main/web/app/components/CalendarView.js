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
  return (
    <container>
      <div className="calendar">
        <TimeView start={8} end={18} />
        {dayNames.map((name, i) => {
          return <Day key={i} eventData={props.dailyEvents[i]} name={name} />;
        })}
      </div>
    </container>
  );
}
