import React from "react";
import "./Winner.css";

const Winner = props => {
  if (props.name !== "")
    return (
      <div className="wrap">
        <div className="winner">Winner: {props.name}</div>
        <button className="myButton" onClick={() => props.declare("")}>
          Try again
        </button>
      </div>
    );
  return null;
};

export default Winner;
