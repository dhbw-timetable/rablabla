import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Event extends Component {
  constructor(props) {
    super(props);
    this.state = { sizeClass: '' }; // '' is large (default), other values: 'medium', 'small', 'tiny'
  }

  update = () => {
    const height = this.liElement.clientHeight;
    var size = '';
    if (height < 70) {
      size = 'tiny';
    } else if (height < 160) {
      size = 'small';
    } else if (height < 190) {
      size = 'medium';
    }
    this.setState({ sizeClass: size });
  }

  componentDidMount() {
    this.update();
    window.addEventListener('resize', this.update);
  }

  render() {
    const { height, top, startTime, endTime, course, persons, resources }
      = this.props.data;
    return (
      <li
        style={{ height, top }}
        className={`event ${this.state.sizeClass}`}
        ref={liElement => this.liElement = liElement}
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
};
