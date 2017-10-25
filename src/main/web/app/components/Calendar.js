import React, { Component } from 'react';
import CalendarView from './CalendarView';

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    console.log(props.getAppointments(
      'https://rapla.dhbw-stuttgart.de/rapla?key=txB1FOi5xd1wUJBWuX8lJhGDUgtMSFmnKLgAG_NVMhA_bi91ugPaHvrpxD-lcejo&day=6&month=3&year=2017&next=%3E%3E',
      25, 10, 2017, this.onAjaxSuccess, this.onAjaxError,
    ));
    this.state = { dailyEvents: [[], [], [], [], [], []] };
  }

  onAjaxSuccess = (response) => {
    const data = JSON.parse(response);
    this.setState({ dailyEvents: this.makeDays(this.parseDates(data)) });
    // TODO What should happen when we receive new appointments?
    console.log(data);
  };

  onAjaxError = (error) => {
  // TODO What should happen on error?
    console.log(error);
  }

  parseDates = (events) => {
    events.forEach((el) => {
      const curDate = el.date.split('.');
      const startTime = el.startTime.split(':');
      el.Date = new Date(curDate[2], curDate[1] - 1, curDate[0], startTime[0], startTime[1]);
    });
    return events;
  }

  makeDays = (events) => {
    const dailyEvents = [[], [], [], [], [], []];
    events.forEach((el) => {
      const index = el.Date.getDay() - 1;
      dailyEvents[index].push(el);
    });
    return dailyEvents;
  }

  render() {
    return (
      <CalendarView dailyEvents={this.state.dailyEvents} />
    );
  }
}
