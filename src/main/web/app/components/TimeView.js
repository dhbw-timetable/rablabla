import React from 'react';

export default function TimeView(props) {
  const numbers = [];

  for (var i = props.start; i <= props.end; i++) {
    numbers.push(<li key={i}>{i}</li>);
  }

  return (
    <div>
      <ul>
        {numbers}
      </ul>
    </div>
  );
}
