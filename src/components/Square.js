import React from 'react';



// -------------SQUARE-------------
function Square(props) {
  return (
    <button
      className={"square " + (props.isWinning ? "square--winning" : null)}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

export default Square;
