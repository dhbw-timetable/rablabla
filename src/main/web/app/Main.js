import { MuiThemeProvider } from 'material-ui/styles';
import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
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
import NavigationBar from './components/NavigationBar';
import Calendar from './components/Calendar';
import {
  slidingTransition,
  theme,
  ajaxTarget,
  getAppointments,
  getICSLink,
} from './utilities';

export default class Main extends Component {

  icsLink = null;
  icsInput = null;

  raplaLinkInput = null;
  raplaLinkValue = null;

  constructor(props) {
    super(props);
    this.raplaLinkValue = localStorage.getItem('raplaLink') || window.location.href.split('#')[1];
    const today = moment();
    const data = localStorage.getItem(`${today.year()} ${today.isoWeek()}`);
    const onboardingNeeded = !this.raplaLinkValue;
    this.state = {
      dailyEvents: data ? this.makeDays(this.parseDates(JSON.parse(data)))
        : [[], [], [], [], [], [], []],
      date: today,
      chat: [],
      extCalendarOpen: false,
      onboardingOpen: onboardingNeeded,
      onboardingMsg: '',
    };

    if (onboardingNeeded) {
      window.addEventListener('keypress', this.handleOnboardingKeypress);
    } else {
      console.log(getAppointments(
        this.raplaLinkValue,
        today, (response) => {
          this.onAjaxSuccess(response, today);
          this.setState({ onboardingOpen: false });
        }, this.onAjaxError, () => {},
      ));
    }
  }

  /* Preload event data before ajax */
  onAjaxPre = (date) => {
    const localData = localStorage.getItem(`${date.year()} ${date.isoWeek()}`);
    this.setState({
      dailyEvents: localData ? this.makeDays(this.parseDates(JSON.parse(localData)))
        : [[], [], [], [], [], [], []],
      date,
    });
  };

  // Clear outdated storage entries
  clearStorage = (date, currWeek) => {
    const regex = /\d+ \d+/; // 2018 42
    let i, key, value, year, week;
    for (i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);
      if (regex.test(key)) {
        value = key.split(' ');
        year = parseInt(value[0]);
        week = parseInt(value[1]);
        if (date.year() !== year || !(week + 1 >= currWeek && currWeek >= week - 1)) {
          console.log(`Removing item ${key} because (date || week)=(${date.year() !== year} || ${(week + 1 >= currWeek && currWeek >= week - 1)})`);
          localStorage.removeItem(key);
        }
      }
    }
  }

  /* Received new data from rapla */
  onAjaxSuccess = (response, reqDate) => {
    const data = JSON.parse(response);
    const today = moment();
    const currWeek = today.isoWeek();
    const reqWeek = reqDate.isoWeek();

    this.clearStorage(today, currWeek);
    // Only if it's the the last, current or next week -> cache it
    if (reqWeek === currWeek - 1 || reqWeek === currWeek || reqWeek === currWeek + 1) {
      localStorage.setItem(`${reqDate.year()} ${reqDate.isoWeek()}`, response);
      console.log('Saved received data in cache.');
    }
    this.setState({ dailyEvents: this.makeDays(this.parseDates(data)), date: reqDate });
    console.log(data);
  };

  onAjaxError = () => {
    this.setState({ onboardingOpen: false });
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
      const dateElements = el.date.split('.');
      el.Date = moment().date(dateElements[0]).month(dateElements[1] - 1).year(dateElements[2]);
    });
    return events;
  }

  makeDays = (events) => {
    const dailyEvents = [[], [], [], [], [], [], []];
    events.forEach((el) => {
      dailyEvents[el.Date.day()].push(el);
    });
    return dailyEvents;
  }

  clearListeners = () => {
    window.applicationCache.removeEventListener('updateready', this.onAppCacheUpdate);
    window.applicationCache.removeEventListener('noupdate', this.onAppCacheNoUpdate);
  }

  onAppCacheNoUpdate = () => {
    this.clearListeners();
    // Manifest didn't change. Nothing new to server.
    this.appendMessage('I am already up to date.', true);
  }

  onAppCacheUpdate = () => {
    this.clearListeners();
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      if (confirm('Wuhu! A new version of our site is available and will be applied on next load. Do you want to reload now?')) {
        window.location.reload();
      }
    }
  }

  appendMessage = (text, watson) => {
    const { chat } = this.state;
    chat.push({ text, watson });
    this.setState({ chat });
    const bottomEl = document.querySelector('.messages-bottom');
    if (bottomEl) {
      bottomEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  sendMessage = (msg) => {
    this.appendMessage(msg, false);
    // ;)
    if (msg.toLowerCase().indexOf('give me pizza') !== -1) {
      this.appendMessage('Enjoy!', true);
      document.querySelectorAll('.calendar').forEach((el) => { el.classList.add('pizza'); });
    } else if (msg.toLowerCase().indexOf('upd473') !== -1) {
      this.appendMessage('Searching for update...', true);
      // Trigger app cache update
      // Inspired from https://www.html5rocks.com/en/tutorials/appcache/beginner/
      window.applicationCache.addEventListener('updateready', this.onAppCacheUpdate, false);
      window.applicationCache.addEventListener('noupdate', this.onAppCacheNoUpdate, false);
      window.applicationCache.update();
    } else if (msg.toLowerCase().indexOf('get crazy') !== -1) {
      document.querySelectorAll('li.event').forEach((event) => {
        setTimeout(() => { event.classList.add('get-crazy'); }, Math.random() * 1.2 * 1000);
      });
      for (let i = 0; i < 200; i++) {
        setTimeout(() => {
          this.appendMessage(Math.random() > 0.5 ? 'Lululululu' : 'Trololo', Math.random() < 0.5);
        }, Math.random() * 42 * 1000);
      }
      document.querySelectorAll('li.day--line').forEach((event) => {
        event.classList.add('lululu');
      });
    } else {
      // Send to backend and handle answer
      $.ajax({
        url: `${ajaxTarget}/ChatBot?url=${encodeURIComponent(this.raplaLinkValue)}&text=${msg}`,
        type: 'POST',
        success: this.appendMessage,
        error: (err) => { console.error(err); },
      });
    }
  };

  handleOnboardingDone = () => {
    this.raplaLinkValue = this.raplaLinkInput.value;
    // If seems valid
    if (/(https|HTTPS):\/\/rapla\.dhbw-(stuttgart|karlsruhe|mannheim)\.de\/rapla?(.+=.+)(&.+=.+)*$/.test(this.raplaLinkValue)) {
      console.log('Url was valid, onboarding succeeded');
      const date = this.state.date;
      localStorage.setItem('raplaLink', this.raplaLinkValue);
      // Old data is invalid
      localStorage.setItem(`${date.year()} ${date.isoWeek()}`, '');
      window.removeEventListener('keypress', this.handleOnboardingKeypress);
      console.log(getAppointments(
        this.raplaLinkValue,
        date, (response) => {
          this.onAjaxSuccess(response, date);
          this.setState({ onboardingOpen: false });
        }, this.onAjaxError, this.onAjaxPre,
      ));
    } else {
      alert(`The entered link '${this.raplaLinkValue}' was invalid. Please enter a correct rapla link.`);
      console.error(`The link ${this.raplaLinkValue} is invalid! Onboarding denied.`);
    }
  };

  handleLinkInputChange = () => {
    this.setState({ onboardingMsg: this.raplaLinkInput.value.length > 20
      && this.raplaLinkInput.value.startsWith('https://rapla.dhbw') ? '' : 'Your link is not valid. Please check it again!' });
  };

  handleOnboardingAbort = () => {
    this.setState({ onboardingOpen: false });
    window.removeEventListener('keypress', this.handleOnboardingKeypress);
  };

  handleOnboardingKeypress = (e) => {
    if (e.keyCode === 13) this.handleOnboardingDone();
  }

  componentDidMount() {
    const currDay = document.querySelector('.is-current');
    if (currDay) currDay.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const { chat, date, dailyEvents, extCalendarOpen, onboardingOpen, onboardingMsg } = this.state;
    return (
    <MuiThemeProvider theme={theme}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <NavigationBar
          title={`${date.format('MMMM YYYY')}`}
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
                    this.onAjaxSuccess(resp, date);
                  },
                  this.onAjaxError, this.onAjaxPre,
                  ));
              },
            },
            {
              text: 'External Calendar ICS',
              onClick: () => {
                getICSLink(this.raplaLinkValue, this.handleExtCalOpen, this.handleExtCalOpen);
              },
            },
            {
              text: 'Switch timetable',
              onClick: () => {
                this.setState({ onboardingOpen: true });
                window.addEventListener('keypress', this.handleOnboardingKeypress);
              },
            },
            {
              text: 'Help to <develop />',
              href: 'https://github.com/dhbw-timetable/rablabla',
            },
            {
              text: 'More',
              href: 'https://dhbw-timetable.github.io/infopage/',
            },
          ]}
          onDateChange={(d) => {
            console.log(getAppointments(
              this.raplaLinkValue,
              d, (resp) => {
                this.onAjaxSuccess(resp, d);
              },
              this.onAjaxError, this.onAjaxPre,
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
                Insert the link to your chosen calendar application and it will
                sync automatically.
              </DialogContentText>
              <TextField
                autoFocus
                inputRef={el => this.icsInput = el}
                label="URL"
                value={this.icsLink}
                margin="normal"
                fullWidth
              />
              <Typography type="caption" style={{ fontWeight: 600 }}>
                Note: Currently you will have to request the
                link every few weeks again here on the web interface. This will be fixed
                within future versions.
              </Typography>
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
                <Button
                  color="contrast"
                  onClick={this.handleOnboardingAbort}
                  style={localStorage.getItem('raplaLink') ? {} : { display: 'none' }}
                >
                  abort
                </Button>
                <Button color="contrast" onClick={this.handleOnboardingDone}>
                  done
                </Button>
              </Toolbar>
            </AppBar>
            <DialogContent style={{ textAlign: 'center' }}>
              <DialogTitle>
                Enter your timetable credentials
              </DialogTitle>
              <Typography type="body2" color="secondary" style={{ fontWeight: 400 }}>
                To use this webapp, please enter your rapla link address here. It should look like:
              </Typography>
              <br />
              <Typography type="body2" color="secondary">
                https://rapla.dhbw-stuttgart.de/rapla?key=aBcDeFgHiJkLmNoP...
              </Typography>
              <br />
              <Typography type="body2" color="secondary" style={{ fontWeight: 400 }}>
                We will connect our services with it and store it.
              </Typography>
              <TextField
                required
                style={{ width: '60%', minWidth: '250px' }}
                inputRef={el => this.raplaLinkInput = el}
                onChange={this.handleLinkInputChange}
                helperText={onboardingMsg}
                margin="normal"
                label="Enter your link"
                type="text"
              />
            </DialogContent>
          </Dialog>
        </NavigationBar>
        <Calendar weekEvents={dailyEvents} date={date} />
      </div>
    </MuiThemeProvider>
    );
  }
}
