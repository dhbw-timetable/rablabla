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
import NavigationMenu from './NavigationMenu';
import Chatter from './Chatter';
import DatePickerModal from './DatePickerModal';

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
    const { icons, chat, title, classes, onMessageSent, style, iconColor,
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
                <DatePickerModal
                  open={this.state.showDatePicker}
                  onSelect={this.props.onDateChange}
                  onRequestClose={this.handleCloseDatePicker}
                />
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
                  <Chatter
                    chat={chat}
                    onMessageSent={onMessageSent}
                  />
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
  chat: PropTypes.arrayOf(PropTypes.object),
  onMessageSent: PropTypes.func.isRequired,
};

NavigationBar.defaultProps = {
  icons: [],
  iconColor: 'contrast',
  iconStyle: { fontSize: 25 },
  style: {},
  title: '',
  chat: [],
};

export default withStyles(styles)(NavigationBar);
