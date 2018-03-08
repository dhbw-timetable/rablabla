import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Event extends Component {
  constructor(props) {
    super(props);
    this.state = { classList: 'normal', selected: false, style: { height: props.data.height, top: props.data.top } }; // '' is large (default), other values: 'medium', 'small', 'tiny'
  }

  update = () => {
    const height = this.liElement.clientHeight;
    const classList = this.state.classList.split(' ');
    let size = '';
    if (height < 70) {
      size = 'tiny';
    } else if (height < 160) {
      size = 'small';
    } else if (height < 190) {
      size = 'medium';
    } else {
      size = 'normal';
    }
    classList[0] = size;
    this.setState({ classList: classList.join(' ') });
  }

  setSelection = (val) => {
    console.log(`Visibility set to ' + ${val}`);
    this.setState({ selected: val });
  };

  handleClick = () => {
    this.props.showBackdrop(this.setSelection);
  }

  componentDidMount() {
    this.update();
    window.addEventListener('resize', this.update);
  }

  render() {
    const { startTime, endTime, course, persons, resources }
      = this.props.data;
    return (
      <li
        style={this.state.style}
        className={`event ${this.state.classList} ${this.state.selected ? 'selected' : ''}`}
        ref={liElement => this.liElement = liElement}
        onClick={this.handleClick}
      >
        <p className="event--time">{`${startTime} - ${endTime}`}</p>
        <h3 className="event--header">{course}</h3>
        <p className="event--body">{persons}</p>
        <p className="event--footer">{resources}</p>
      </li>
    );
  }
}

Event.propTypes = {
  data: PropTypes.object.isRequired,
  showBackdrop: PropTypes.func.isRequired,
};
