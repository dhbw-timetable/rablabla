import React from 'react';
import CalendarView from './CalendarView';

export default function Calendar(props) {
  return (
    <CalendarView
      dailyEventData={[
        [
            { time: '13:00', title: 'Vorlesung Montag', name: 'Prof. X', ressource: 'STGT-EXA' },
        ],
        [
            { time: '13:00', title: 'Vorlesung Dienstag', name: 'Prof. X', ressource: 'STGT-EXA' },
        ],
        [
            { time: '13:00', title: 'Vorlesung Mittwoch', name: 'Prof. X', ressource: 'STGT-EXA' },
        ],
        [
            { time: '13:00', title: 'Vorlesung Donnerstag', name: 'Prof. X', ressource: 'STGT-EXA' },
        ],
        [
            { time: '13:00', title: 'Vorlesung Freitag', name: 'Prof. X', ressource: 'STGT-EXA' },
        ],
        [],
      ]}
    />
  );
}
