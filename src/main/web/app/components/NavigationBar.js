// @flow weak
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from './NavigationMenu';
import Chatter from './Chatter';
import MUIDatePicker from './MUIDatePicker';

const styles = () => ({
  root: {
    marginTop: 0,
    width: '100%',
  },
});

function NavigationBar(props) {
  const { icons, chat, title, classes, onMessageSent,
    style, iconColor, iconStyle, menuItems, onDateChange } = props;
  return (
    <div className={classes.root}>
      <AppBar
        style={style}
        className="nav-bar"
        position="fixed"
        color="primary"
      >
        <Toolbar className="test">
            <div className="nav-bar-content">
              <div className="nav-container-left">
                <Typography type="title" color="accent">
                  {title}
                </Typography>
              </div>
              <div className="nav-container-right">
                <MUIDatePicker
                  onDateSelected={onDateChange}
                />
                <Chatter
                  iconColor={iconColor}
                  iconStyle={iconStyle}
                  chat={chat}
                  onMessageSent={onMessageSent}
                />
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
              {props.children}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
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
  children: PropTypes.node,
};

NavigationBar.defaultProps = {
  icons: [],
  iconColor: 'contrast',
  iconStyle: { fontSize: 25 },
  style: {},
  title: '',
  chat: [],
  children: '',
};

export default withStyles(styles)(NavigationBar);
