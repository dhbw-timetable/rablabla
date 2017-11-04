import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';

export default class Chatter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: undefined,
      open: false,
    };
    window.onkeyup = (e) => { // eslint-disable-line no-undef
      const key = e.keyCode ? e.keyCode : e.which;
      // Enter
      if (key === 13 && this.messageInput) {
        this.submitMessage();
      }
    };
  }

  handleOpenChat = () => {
    this.setState({ open: true, anchorEl: findDOMNode(this.chatButton) });
  }

  handleCloseChat = () => {
    this.setState({ open: false });
  }

  submitMessage = () => {
    const { messageInput, chatContainer } = this;
    if (messageInput.value.trim().length > 0) {
      this.props.onMessageSent(messageInput.value);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    messageInput.value = '';
  };

  messageInput = null;
  chatContainer = null;
  chatButton = null;

  render() {
    const { iconColor, iconStyle, chat } = this.props;
    const { open, anchorEl } = this.state;
    return (
      <div>
        <IconButton
          color={iconColor}
          style={iconStyle}
          ref={el => this.chatButton = el}
          onClick={this.handleOpenChat}
        >
          question_answer
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
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
          <Paper classes={{ root: 'chat-window' }}>
            <Typography type="title" component="h3" align="left">
            Watson Chat
            </Typography>
            <div
              ref={el => this.chatContainer = el}
              className="message-container"
            >
              {chat.map((msg, i) => {
                return (
                  <Typography
                    type="body1"
                    color={msg.watson ? 'primary' : 'default'}
                    component="p"
                    align={msg.watson ? 'left' : 'right'}
                    classes={msg.watson ? { body1: 'message message--left' } : { body1: 'message message--right' }}
                    key={i}
                  >
                    {msg.text}
                  </Typography>
                );
              })}
            </div>
            <div className="input-container">
              <TextField
                inputProps={{ maxLength: 70 }}
                placeholder="Enter a message..."
                inputRef={el => this.messageInput = el}
                fullWidth
                style={{ height: 30 }}
                margin="normal"
                autoFocus
              />
              <IconButton
                style={{ marginRight: 15 }}
                onClick={this.submitMessage}
              >
                send
              </IconButton>
            </div>
          </Paper>
        </Popover>
      </div>
    );
  }
}

Chatter.propTypes = {
  onMessageSent: PropTypes.func.isRequired,
  chat: PropTypes.arrayOf(PropTypes.object),
  iconColor: PropTypes.string,
  iconStyle: PropTypes.object,
};

Chatter.defaultProps = {
  chat: [],
  iconStyle: {},
  iconColor: 'contrast',
};
