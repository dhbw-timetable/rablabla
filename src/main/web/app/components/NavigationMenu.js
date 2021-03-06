import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import PropTypes from 'prop-types';

export default class NavigationMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      open: false,
    };
  }

  handleRequestOpen = (event) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = (event, el) => {
    this.setState({ open: false });
    if (el) el.onClick(event);
  };

  render() {
    const { iconColor, iconStyle, menuItems } = this.props;
    const { open, anchorEl } = this.state;
    return (
      <div>
        <IconButton
          aria-owns={open ? 'nav-menu' : null}
          aria-haspopup="true"
          color={iconColor}
          style={iconStyle}
          onClick={this.handleRequestOpen}
        >
          more_horiz
        </IconButton>
        <Menu
          id="nav-menu"
          anchorEl={anchorEl}
          open={open}
          onRequestClose={this.handleRequestClose}
        >
          {menuItems.map((el, i) => {
            const opt = {};
            // Decide if it is either link or button
            if (el.href) {
              opt.href = el.href;
              opt.target = '_blank';
              opt.component = 'a';
            } else if (el.onClick) {
              opt.onClick = event => this.handleRequestClose(event, el);
            }
            return (
              <MenuItem key={i} {...opt}>
                {el.text}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    );
  }
}

NavigationMenu.propTypes = {
  menuItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  iconColor: PropTypes.string,
  iconStyle: PropTypes.object,
};

NavigationMenu.defaultProps = {
  iconColor: 'contrast',
  iconStyle: {},
};
