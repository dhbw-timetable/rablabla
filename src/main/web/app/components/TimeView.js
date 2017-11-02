import React from 'react';
import PropTypes from 'prop-types';

export default function TimeView(props) {
  return (
    <div className="day time">
      <h2 className="day--name" />
      <ul className="schedule">
        {Array((props.end - props.start) + 1).fill().map((_, i) => {
          return (<li className="time-name" style={{ height: `calc(100% / ${props.end - props.start + 0.5})` }} key={i}>{i + props.start}</li>);
        })}
      </ul>
    </div>
  );
}

TimeView.propTypes = {
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
};
