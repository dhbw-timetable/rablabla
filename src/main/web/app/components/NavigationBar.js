// @flow weak
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/Input';
import ReactModal from 'react-modal';
import InfiniteCalendar from 'react-infinite-calendar';
import NavigationMenu from './NavigationMenu';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
});

class NavigationBar extends Component {
  constructor() {
    super();
    this.state = {
      showDatePicker: false,
      chatAnchorEl: undefined,
      chatOpen: false,
    };
  }

  handleOpenDatePicker = () => {
    this.setState({ showDatePicker: true });
  }

  handleCloseDatePicker = () => {
    this.setState({ showDatePicker: false });
  }

  handleOpenChat = () => {
    this.setState({ chatOpen: true, chatAnchorEl: findDOMNode(this.chatButton) });
  }

  handleCloseChat = () => {
    this.setState({ chatOpen: false });
  }

  chatButton = null;

  render() {
    const { icons, title, classes, style, iconColor,
      iconStyle, menuItems, onDateChange } = this.props;
    return (
        <div className={classes.root}>
          <AppBar
            style={style}
            position="fixed"
            color="primary"
          >
            <Toolbar>
              <div className="nav-container-left">
                <Typography type="title" color="accent">
                  {title}
                </Typography>
              </div>
              <div className="nav-container-right">
                <IconButton
                  color={iconColor}
                  style={iconStyle}
                  onClick={this.handleOpenDatePicker}
                >
                  date_range
                </IconButton>
                <IconButton
                  color={iconColor}
                  style={iconStyle}
                  ref={el => this.chatButton = el}
                  onClick={this.handleOpenChat}
                >
                  question_answer
                </IconButton>
                <ReactModal
                  isOpen={this.state.showDatePicker}
                  contentLabel="DatePicker"
                  style={{
                    overlay: {
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      zIndex: 2,
                    },
                    content: {
                      width: 360,
                      height: 350,
                      top: 100,
                      left: 0,
                      right: 0,
                      border: 0,
                      display: 'inline-block',
                      margin: 'auto',
                      padding: 0,
                    },
                  }}
                  onRequestClose={this.handleCloseDatePicker}
                  shouldCloseOnOverlayClick
                >
                  <InfiniteCalendar
                    width={360}
                    height={350}
                    locale={{
                      locale: require('date-fns/locale/de'),   // eslint-disable-line global-require
                      headerFormat: 'dddd, D MMM',
                      weekdays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                      blank: 'Datum wählen',
                      todayLabel: {
                        long: 'Heute',
                        short: 'Heute',
                      },
                      weekStartsOn: 1,
                    }}
                    theme={{
                      selectionColor: '#ba3838',
                      textColor: {
                        default: '#333',
                        active: '#FFF',
                      },
                      weekdayColor: '#ba3838',
                      headerColor: '#ba3838',
                      floatingNav: {
                        background: '#ba3838',
                        color: '#FFF',
                        chevron: '#FFA726',
                      },
                    }}
                    onSelect={onDateChange}
                  />
                </ReactModal>
                <Popover
                  open={this.state.chatOpen}
                  anchorEl={this.state.chatAnchorEl}
                  onRequestClose={this.handleCloseChat}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <Paper style={{ width: '400px', height: '300px', padding: 15 }}>
                    <Typography type="body1" component="p" align="right">
                      Hello there!
                    </Typography>
                    <Typography type="body1" component="p" color="primary" align="left">
                      Watson: Hi, how can I help you?
                    </Typography>
                    <Typography type="body1" component="p" align="right">
                      Whats the plan for tomorrow?
                    </Typography>
                    <Typography type="body1" color="primary" component="p" align="left">
                      Watson: Nothing! Lets party!!!
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', width: '100%', bottom: 0 }}>
                      <TextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder="Enter a message..."
                        fullWidth
                        style={{ height: 30 }}
                        margin="normal"
                      />
                      <IconButton style={{ marginRight: 15 }}>send</IconButton>
                    </div>
                  </Paper>
                </Popover>
                {icons.map((el, i) => {
                  return (
                    <IconButton
                      key={i}
                      color={iconColor}
                      style={iconStyle}
                      onClick={el.onClick}
                    >
                      {el.icon}
                    </IconButton>
                  );
                })}
                <NavigationMenu
                  iconColor={iconColor}
                  menuItems={menuItems}
                  onDateChange={onDateChange}
                />
              </div>
            </Toolbar>
          </AppBar>
        </div>
    );
  }
}

NavigationBar.propTypes = {
  style: PropTypes.object,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  menuItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  iconColor: PropTypes.string,
  iconStyle: PropTypes.object,
  icons: PropTypes.arrayOf(PropTypes.object),
  onDateChange: PropTypes.func.isRequired,
};

NavigationBar.defaultProps = {
  icons: [],
  iconColor: 'contrast',
  iconStyle: { fontSize: 25 },
  style: {},
  title: '',
};

export default withStyles(styles)(NavigationBar);
