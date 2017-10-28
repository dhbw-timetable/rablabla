import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import React, { Component } from 'react';
import yellow from 'material-ui/colors/yellow';
import $ from 'jquery';
import NavigationBar from './components/NavigationBar';
import Calendar from './components/Calendar';

const getParams = (args) => {
  const params = {};
  const pStrings = args.split('&');
  Object.keys(pStrings).forEach((param) => {
    const kvStrings = pStrings[param].split('=');
    params[kvStrings[0]] = kvStrings[1];
  });
  return params;
};

const getICSLink = (url, success, error) => {
  const deSuffix = '.de/rapla?';
  const params = getParams(url.substring(url.indexOf(deSuffix) + deSuffix.length));
  if (params.key) {
    $.ajax({
      url: `Rablabla?url=${url}`,
      type: 'POST',
      success,
      error,
    });
    return 'Accessing calendar file...';
  } else if (params.user && params.file) {
    success(`${url}&page=ical`);
  } else {
    console.error(`Yearly calendar not supported for url: ${url}`);
  }
  return 'Reqeust denied.';
};

const getAppointments = (url, date, success, error) => {
  $.ajax({
    url: `Rablabla?url=${encodeURIComponent(url)}&day=${date.getDate()}&month=${date.getMonth + 1}&year=${date.getFullYear()}`,
    type: 'GET',
    success,
    error,
  });
  return 'Accessing appointments...';
};

const dhbwtimetablepalette = {
  50: '#f7e7e7',
  100: '#eac3c3',
  200: '#dd9c9c',
  300: '#cf7474',
  400: '#c45656',
  500: '#ba3838',
  600: '#b33232',
  700: '#ab2b2b',
  800: '#a32424',
  900: '#941717',
  A100: '#ffc9c9',
  A200: '#ff9696',
  A400: '#ff6363',
  A700: '#ff4a4a',
  contrastDefaultColor: 'light',
};

const theme = createMuiTheme({
  palette: {
    primary: dhbwtimetablepalette,
    secondary: {
      ...dhbwtimetablepalette,
      A400: 'white', // Accent color
    },
    error: yellow,
  },
});

export default class Main extends Component {
  constructor() {
    super();
    this.state = { dailyEvents: [[], [], [], [], [], []], date: new Date(), chat: [] };
    const date = this.state.date;
    console.log(getAppointments(
      'https://rapla.dhbw-stuttgart.de/rapla?key=txB1FOi5xd1wUJBWuX8lJhGDUgtMSFmnKLgAG_NVMhA_bi91ugPaHvrpxD-lcejo',
      date, this.onAjaxSuccess, this.onAjaxError,
    ));
  }

  onAjaxSuccess = (response) => {
    const data = JSON.parse(response);
    this.setState({ dailyEvents: this.makeDays(this.parseDates(data)) });
    // TODO What should happen when we receive new appointments?
    console.log(data);
  };

  onAjaxError = (error) => {
    // TODO What should happen on error?
    console.error(error);
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

  sendMessage = (msg) => {
    const { chat } = this.state;
    chat.push({ text: msg, watson: false });
    this.setState({ chat });
    console.log(`Sending '${msg}' to backend...`);
    // TODO Send to backend HERE
  };

  render() {
    const { chat, date } = this.state;
    return (
    <MuiThemeProvider theme={theme}>
      <div>
        <NavigationBar
          title="Rablabla"
          chat={chat}
          onMessageSent={this.sendMessage}
          menuItems={[
            {
              text: 'Refresh',
              onClick: () => {
                console.log(getAppointments(
                  'https://rapla.dhbw-stuttgart.de/rapla?key=txB1FOi5xd1wUJBWuX8lJhGDUgtMSFmnKLgAG_NVMhA_bi91ugPaHvrpxD-lcejo',
                  date,
                  (resp) => {
                    this.onAjaxSuccess(resp);
                    // TODO Implement snackbar HERE
                  },
                  this.onAjaxError,
                  ));
              },
            },
            {
              text: 'Get external calendar',
              onClick: () => {
                getICSLink('https://rapla.dhbw-stuttgart.de/rapla?key=txB1FOi5xd1wUJBWuX8lJhGDUgtMSFmnKLgAG_NVMhA_bi91ugPaHvrpxD-lcejo',
                (response) => {
                  alert(response); // eslint-disable-line no-undef
                }, (err) => { console.error(err); });
              },
            },
            {
              text: 'Switch timetable',
              onClick: () => {
                // TODO Implement
              },
            },
          ]}
          onDateChange={(d) => {
            this.setState({ d });
            console.log(getAppointments(
              'https://rapla.dhbw-stuttgart.de/rapla?key=txB1FOi5xd1wUJBWuX8lJhGDUgtMSFmnKLgAG_NVMhA_bi91ugPaHvrpxD-lcejo',
              d, this.onAjaxSuccess,
              this.onAjaxError,
              ));
          }}
        />
        <Calendar dailyEvents={this.state.dailyEvents} />
      </div>
    </MuiThemeProvider>
    );
  }
}
