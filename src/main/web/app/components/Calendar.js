import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import TimeView from './TimeView';
import Day from './Day';

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = { backdrop: false, backdropTargetHandler: () => {} };
  }

  hideBackdrop = () => {
    this.state.backdropTargetHandler(false);
    this.setState({ backdrop: false, backdropTargetHandler: () => {} });
  };

  showBackdrop = (selectionHandler) => {
    selectionHandler(true);
    this.setState({ backdrop: true, backdropTargetHandler: selectionHandler });
  }

  render() {
    const today = moment();
    const { weekEvents, date, start, end } = this.props;
    return (
      <container>
        <div className={`calendar ${this.state.backdrop ? 'has-backdrop' : ''}`}>
          <TimeView start={start} end={end} />
          {new Array(weekEvents.length).fill().map((_, i) => {
            return (<Day
              key={i}
              eventData={weekEvents[i]}
              name={name}
              start={start}
              end={end}
              date={moment(date).day(0).add(i, 'days')}
              showBackdrop={this.showBackdrop}
              isCurrent={i === today.day()
                && today.week() === date.week()
                && today.year() === date.year()}
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
