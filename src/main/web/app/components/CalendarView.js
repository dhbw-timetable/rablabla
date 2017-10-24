import React from 'react';
import TimeView from './TimeView';
import Day from './Day';

export default function CalendarView() {
  const dayNodes = [];
  return (
    <div>
      <TimeView />
      {dayNodes}
    </div>
  );
}
