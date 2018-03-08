import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeView from './TimeView';
import Day from './Day';

// ISO 8601
export function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // week end on sunday
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return Math.ceil((((d - new Date(Date.UTC(d.getUTCFullYear(), 0, 1))) / 86400000) + 1) / 7);
}

function normalize(d) {
  const nd = new Date(d.getTime());
  nd.setDate(nd.getDate() - nd.getDay() + 1);
  return nd;
}

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = { backdrop: false, backdropTargetHandler: () => {} };
  }

  hideBackdrop = () => {
    console.log('Clicked on backdrop');
    this.state.backdropTargetHandler(false);
    this.setState({ backdrop: false, backdropTargetHandler: () => {} });
  };

  showBackdrop = (selectionHandler) => {
    console.log('Clicked on an event');
    selectionHandler(true);
    this.setState({ backdrop: true, backdropTargetHandler: selectionHandler });
  }

  render() {
    const currentDay = new Date();
    const { weekEvents, date, start, end } = this.props;
    const normDate = normalize(date);
    return (
      <container>
        <div className={`calendar ${this.state.backdrop ? 'has-backdrop' : ''}`}>
          <TimeView start={start} end={end} />
          {new Array(6).fill().map((_, i) => {
            const day = new Date(normDate.getTime());
            day.setDate(day.getDate() + i); // shift
            return (<Day
              key={i}
              eventData={weekEvents[i]}
              name={name}
              start={start}
              end={end}
              date={day}
              showBackdrop={this.showBackdrop}
              isCurrent={i === (currentDay.getDay() - 1)
                && getWeekNumber(currentDay) === getWeekNumber(date)
                && currentDay.getFullYear() === date.getFullYear()}
            />);
          })}
          <div
            className={`calendar--backdrop ${this.state.backdrop ? 'is-visible' : ''}`}
            onClick={this.hideBackdrop}
          />
        </div>
      </container>
    );
  }
}

Calendar.propTypes = {
  weekEvents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  date: PropTypes.object.isRequired,
  start: PropTypes.number,
  end: PropTypes.number,
};

Calendar.defaultProps = {
  start: 8,
  end: 18,
};
