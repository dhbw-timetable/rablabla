import React from 'react';
import PropTypes from 'prop-types';
import Event from './Event';

export default function DayView(props) {
  const { name, events, isCurrent, end, start, lineY, showBackdrop } = props;
  return (
    <div className={`day ${isCurrent ? 'is-current' : ''}`}>
      <h2 className="day--name">{name}</h2>
      <ul className="schedule" style={{ backgroundSize: `100% calc(100% / ${end - start + 0.5})` }}>
        {events.map((el, i) => <Event key={i} data={el} showBackdrop={showBackdrop} />)}
        <li className="day--line" style={{ top: lineY ? `${lineY}%` : '' }} />
      </ul>
    </div>
  );
}

DayView.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  showBackdrop: PropTypes.func.isRequired,
  lineY: PropTypes.number,
  isCurrent: PropTypes.bool,
};

DayView.defaultProps = { isCurrent: false, lineY: undefined };
