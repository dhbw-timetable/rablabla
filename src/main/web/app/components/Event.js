import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Event extends Component {
  constructor(props) {
    super(props);
    this.state = { isSmall: this.calculateSmall(this.props.data.duration) };
  }

  calculateSmall = (duration) => {
    return duration < (-0.1 * window.innerHeight) + 80;
  };

  update = () => {
    this.setState({ isSmall: this.calculateSmall(this.props.data.duration) });
  }

  componentDidMount() {
    window.addEventListener('resize', this.update);
  }

  render() {
    const { height, top, duration, startTime, endTime, course, persons, resources }
      = this.props.data;
    return (
      <li style={{ height, top }} className={`event ${this.state.isSmall ? 'is-small' : ''}`}>
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
};
