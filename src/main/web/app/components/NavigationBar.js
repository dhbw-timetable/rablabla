// @flow weak
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import SvgIcon from 'material-ui/SvgIcon';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
});

function NavigationBar(props) {
  const { icons, iconColor, iconSize, title, classes } = props;
  return (
      <div className={classes.root}>
        <AppBar
          style={props.style}
          position="fixed"
          color="primary"
        >
          <Toolbar>
            <Typography type="title" color="accent">
              {title}
            </Typography>
            <div className="nav-icon-container">
              {icons && icons.map(icon => (
                <a href={icon.href} key={icon.href} >
                  <SvgIcon
                    color={iconColor}
                    viewBox={icon.viewBox}
                    style={{ width: iconSize, height: iconSize }}
                  >
                    {icon.paths.map(p => <path key={p} className="cls-1" d={p} />)}
                  </SvgIcon>
                </a>
              ))}
            </div>
          </Toolbar>
        </AppBar>
      </div>
  );
}

NavigationBar.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  iconSize: PropTypes.string,
  iconColor: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.object),
};

NavigationBar.defaultProps = {
  iconSize: '48px',
  iconColor: '#ffffff',
  icons: [],
};

export default withStyles(styles)(NavigationBar);
