// @flow weak
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from './NavigationMenu';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 8,
    width: '100%',
  },
});

function NavigationBar(props) {
  const { icons, title, classes, style, iconColor, iconStyle, menuItems } = props;
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
              />
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
};

NavigationBar.defaultProps = {
  icons: [],
  iconColor: 'contrast',
  iconStyle: { fontSize: 25 },
  style: {},
  title: '',
};

export default withStyles(styles)(NavigationBar);
