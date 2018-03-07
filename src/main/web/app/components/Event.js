import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Event extends Component {
  constructor(props) {
    super(props);
    this.state = { classList: 'normal not-selected', style: { height: props.data.height, top: props.data.top } }; // '' is large (default), other values: 'medium', 'small', 'tiny'
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

  handleClick = () => {
    const classList = this.state.classList.split(' ');
    const style = this.state.style;
    if (classList[1].indexOf('not-selected') !== -1) {
      classList[1] = 'selected';
      style.height = 'auto';
      style.top = 0;
    } else {
      classList[1] = 'not-selected';
      style.height = this.props.data.height;
      style.top = this.props.data.top;
    }
    this.setState({ classList: classList.join(' '), style });
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
        className={`event ${this.state.classList}`}
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
};
