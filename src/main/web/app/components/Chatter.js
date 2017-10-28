import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';

let messageInput = null;
let chatContainer = null;

export default function Chatter(props) {
  const submitMessage = () => {
    if (messageInput.value.trim().length > 0) {
      props.onMessageSent(messageInput.value);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    messageInput.value = '';
  };

  window.onkeyup = (e) => { // eslint-disable-line no-undef
    const key = e.keyCode ? e.keyCode : e.which;
    // Enter
    if (key === 13 && messageInput) {
      submitMessage();
    }
  };
  return (
    <Paper style={{ width: 400, height: 300, padding: 15 }}>
      <Typography type="title" component="h3" align="left">
      Watson Chat
      </Typography>
      <div
        ref={el => chatContainer = el}
        style={{ maxHeight: 250, overflowY: 'scroll' }}
      >
        {props.chat.map((msg, i) => {
          return (
            <Typography
              type="body1"
              color={msg.watson ? 'primary' : 'default'}
              component="p"
              align={msg.watson ? 'left' : 'right'}
              key={i}
            >
              {msg.text}
            </Typography>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', width: '100%', bottom: 0 }}>
        <TextField
          placeholder="Enter a message..."
          inputRef={el => messageInput = el}
          fullWidth
          style={{ height: 30 }}
          margin="normal"
          autoFocus
        />
        <IconButton
          style={{ marginRight: 15 }}
          onClick={submitMessage}
        >
          send
        </IconButton>
      </div>
    </Paper>
  );
}

Chatter.propTypes = {
  onMessageSent: PropTypes.func.isRequired,
  chat: PropTypes.arrayOf(PropTypes.object),
};


Chatter.defaultProps = {
  chat: [],
};
