// @flow weak
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
});

function NavigationBar(props) {
  const { icons, title, classes, style, iconColor, iconStyle } = props;
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
            <div className="nav-container-center">
            <a href="">
              <Icon color={iconColor} style={iconStyle}>keyboard_arrow_left</Icon>
            </a>
            <a href="">
              <Icon color={iconColor} style={iconStyle}>date_range</Icon>
            </a>
            <a href="">
              <Icon color={iconColor} style={iconStyle}>keyboard_arrow_right</Icon>
            </a>
            </div>
            <div className="nav-container-right">
              {icons && icons.map((icon, i) => (
                <a href={icon.href} key={i} >
                  <Icon color={iconColor} style={iconStyle}>{icon.name}</Icon>
                </a>
              ))}
            </div>
          </Toolbar>
        </AppBar>
      </div>
  );
}

NavigationBar.propTypes = {
  style: PropTypes.object,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  iconColor: PropTypes.string,
  iconStyle: PropTypes.object,
  icons: PropTypes.arrayOf(PropTypes.object),
};

NavigationBar.defaultProps = {
  iconSize: '48px',
  iconColor: '#ffffff',
  icons: [],
  iconStyle: {},
  style: {},
};

export default withStyles(styles)(NavigationBar);
