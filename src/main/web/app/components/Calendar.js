import React, { Component } from 'react';
import CalendarView from './CalendarView';

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    var events = [
      { date: '24.10.2017', persons: 'Petrasch, Dennis Alexander,', course: 'Web-Engineering 2', resources: 'RB41-1.14,STG-TINF16C', startTime: '08:00', endTime: '13:00' },
      { date: '27.10.2017', persons: 'Ewertz, Christian,,Rentschler, Markus,', course: 'Grundlagen des Software-Engineering', resources: 'STG-TINF16C,RB41-1.14', startTime: '08:00', endTime: '16:30' },
      { date: '25.10.2017', persons: 'Schwinn, Bernd, Dr.', course: 'Formale Sprachen und Automaten 1', resources: 'RB41-1.14,STG-TINF16C', startTime: '08:30', endTime: '12:00' },
      { date: '26.10.2017', persons: 'Kick, Thomas H., Dr.', course: 'Angewandte Mathematik', resources: 'STG-TINF16C,RB41-1.14', startTime: '08:30', endTime: '11:45' },
      { date: '23.10.2017', persons: 'Reichardt, Dirk, Dr.', course: 'Grundlagen der Datenbanken', resources: 'STG-TINF16C,RB41-1.14', startTime: '09:00', endTime: '12:30' },
      { date: '25.10.2017', persons: 'Schwarze, Heinz,', course: 'Netztechnik 1', resources: 'STG-TINF16C,RB41-1.14', startTime: '13:30', endTime: '16:30' },
      { date: '24.10.2017', persons: 'Hebold, Ronny,', course: 'Rechnerarchitekturen 1', resources: 'RB41-1.14,STG-TINF16C', startTime: '14:00', endTime: '17:00' },
    ];
    this.parseDates(events);
    const dailyEvents = this.makeDays(events);
    this.state = { dailyEvents: dailyEvents };
    console.log(dailyEvents);
  }

  parseDates(events) {
    const parsed = [];
    events.forEach((el) => {
      const curDate = el.date.split('.');
      const startTime = el.startTime.split(':');
      el.Date = new Date(curDate[2], curDate[1] - 1, curDate[0], startTime[0], startTime[1]);
      parsed.push(el);
    });
  }

  makeDays(events) {
    const dailyEvents = [[], [], [], [], [], []];
    events.forEach((el) => {
      const index = el.Date.getDay() - 1;
      dailyEvents[index].push(el);
    });
    return dailyEvents;
  }

  render() {
    return (
      <CalendarView
        dailyEvents={this.state.dailyEvents}
      />
    );
  }
}
