import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import React, { Component } from 'react';
import yellow from 'material-ui/colors/yellow';
import $ from 'jquery';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import AppBar from 'material-ui/AppBar';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
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
  const baseURL = url.substring(0, url.indexOf(deSuffix) + deSuffix.length);
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
    console.log(baseURL);
    success(`${baseURL}page=ical&user=${params.user}&file=${params.file}`);
  } else {
    console.error(`Yearly calendar not supported for url: ${url}`);
  }
  return 'Reqeust denied.';
};

const getAppointments = (url, date, success, error) => {
  $.ajax({
    url: `Rablabla?url=${encodeURIComponent(url)}&day=${date.getDate()}&month=${date.getMonth() + 1}&year=${date.getFullYear()}`,
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

const slidingTransition = props => <Slide direction="up" {...props} />;

export default class Main extends Component {
  constructor() {
    super();
    this.raplaTitleValue = localStorage.getItem('raplaTitle');
    this.raplaLinkValue = localStorage.getItem('raplaLink');
    const onboardingNecessary = !localStorage.getItem('raplaLink');
    this.state = {
      dailyEvents: [[], [], [], [], [], []],
      date: new Date(),
      chat: [],
      extCalendarOpen: false,
      onboardingOpen: onboardingNecessary,
    };

    if (!onboardingNecessary) {
      console.log(getAppointments(
        this.raplaLinkValue,
        this.state.date, (response) => {
          this.onAjaxSuccess(response);
          this.setState({ onboardingOpen: false });
        }, this.onAjaxError,
      ));
    }
  }

  onAjaxSuccess = (response) => {
    const data = JSON.parse(response);
    this.setState({ dailyEvents: this.makeDays(this.parseDates(data)) });
    console.log(data);
  };

  onAjaxError = (error) => {
    console.error(error);
  }

  handleExtCalClose = () => {
    this.setState({ extCalendarOpen: false });
  };

  handleExtCalOpen = (response) => {
    this.icsLink = response;
    this.setState({ extCalendarOpen: true });
  };

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
    document.querySelector('.messages-bottom').scrollIntoView({ behavior: 'smooth' });
    // Send to backend and handle answer
    $.ajax({
      url: `ChatBot?url=${encodeURIComponent(this.raplaLinkValue)}&text=${msg}`,
      type: 'POST',
      success: (response) => {
        chat.push({ text: response, watson: true });
        this.setState({ chat });
        document.querySelector('.messages-bottom').scrollIntoView({ behavior: 'smooth' });
      },
      error: (err) => { console.error(err); },
    });
  };

  handleOnboardingDone = () => {
    this.raplaTitleValue = this.raplaTitleInput.value;
    this.raplaLinkValue = this.raplaLinkInput.value;
    localStorage.setItem('raplaTitle', this.raplaTitleValue);
    localStorage.setItem('raplaLink', this.raplaLinkValue);

    // If seems valid
    if (this.raplaLinkValue.length > 10 && this.raplaLinkValue.startsWith('https://rapla.dhbw')) {
      console.log('Url was valid, onboarding succeeded');
      const date = this.state.date;
      console.log(getAppointments(
        this.raplaLinkValue,
        date, (response) => {
          this.onAjaxSuccess(response);
          this.setState({ onboardingOpen: false });
        }, this.onAjaxError,
      ));
    } else {
      alert(`The entered link '${this.raplaLinkValue}' was invalid. Please enter a correct rapla link.`);
      console.error(`The link ${this.raplaLinkValue} is invalid! Onboarding denied.`);
    }
  };

  componentDidMount() {
    const currDay = document.querySelector('.is-current');
    if (currDay) currDay.scrollIntoView({ behavior: 'smooth' });
  }

  icsLink = null;
  icsInput = null;

  raplaLinkInput = null;
  raplaLinkValue = null;

  raplaTitleInput = null;
  raplaTitleValue = null;

  render() {
    const { chat, date, dailyEvents, extCalendarOpen, onboardingOpen } = this.state;
    return (
    <MuiThemeProvider theme={theme}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <NavigationBar
          title={this.raplaTitleValue}
          chat={chat}
          onMessageSent={this.sendMessage}
          menuItems={[
            {
              text: 'Refresh',
              onClick: () => {
                console.log(getAppointments(
                  this.raplaLinkValue,
                  date,
                  (resp) => {
                    this.onAjaxSuccess(resp);
                  },
                  this.onAjaxError,
                  ));
              },
            },
            {
              text: 'Get external calendar',
              onClick: () => {
                getICSLink(this.raplaLinkValue, this.handleExtCalOpen, this.handleExtCalOpen);
              },
            },
            {
              text: 'Switch timetable',
              onClick: () => {
                this.setState({ onboardingOpen: true });
              },
            },
            {
              text: 'More',
              href: 'https://dhbw-timetable.github.io/infopage/',
            },
          ]}
          onDateChange={(d) => {
            this.setState({ d });
            console.log(getAppointments(
              this.raplaLinkValue,
              d, this.onAjaxSuccess,
              this.onAjaxError,
              ));
          }}
        >
          <Dialog
            open={extCalendarOpen}
            onRequestClose={this.handleExtCalClose}
            fullWidth
            transition={slidingTransition}
          >
            <DialogTitle>Your calendar link</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Insert the link to your chosen calendar application and it will sync automatically.
              </DialogContentText>
              <TextField
                autoFocus
                inputRef={el => this.icsInput = el}
                label="URL"
                value={this.icsLink}
                margin="normal"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  $(this.icsInput).select();
                  document.execCommand('copy');
                }}
                color="primary"
              >
                Copy
              </Button>
              <Button onClick={this.handleExtCalClose} color="primary" autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={onboardingOpen}
            onRequestClose={() => {}}
            fullScreen
            transition={slidingTransition}
          >
            <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <Typography type="title" color="inherit" style={{ flex: 1 }}>
                  Rablabla Onboarding
                </Typography>
                <Button color="contrast" onClick={this.handleOnboardingDone}>
                  done
                </Button>
              </Toolbar>
            </AppBar>
            <DialogContent style={{ textAlign: 'center' }}>
              <DialogTitle>
                Enter your rapla link
              </DialogTitle>
              <DialogContentText>
                To use this webapp, please enter your rapla link address here.
                We will connect our services with it and store it.
                You also have to specify a course title.
              </DialogContentText>
              <TextField
                required
                autoFocus
                inputRef={el => this.raplaTitleInput = el}
                margin="normal"
                label="Enter your course title"
                type="text"
                style={{ width: '60%', minWidth: '250px' }}
                inputProps={{ maxLength: 10 }}
              />
              <TextField
                required
                inputRef={el => this.raplaLinkInput = el}
                margin="normal"
                label="Enter your link"
                type="text"
                style={{ width: '60%', minWidth: '250px' }}
              />
            </DialogContent>
          </Dialog>
        </NavigationBar>
        <Calendar dailyEvents={dailyEvents} />
      </div>
    </MuiThemeProvider>
    );
  }
}
