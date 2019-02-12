import React, { Component } from "react";
import Board from "../Board";
import Winner from "../Winner";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: ""
    };
    this.declareWinner = this.declareWinner.bind(this);
  }

  declareWinner(winner) {
    this.setState({ winner });
  }

  render() {
    const view =
      this.state.winner === "" ? (
        <Board declare={this.declareWinner} />
      ) : (
        <Winner name={this.state.winner} declare={this.declareWinner} />
      );

    return <div className="container">{view}</div>;
  }
}

export default Home;
