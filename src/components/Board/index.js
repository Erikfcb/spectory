import React, { Component } from "react";
import "./Board.css";

// This is a new-changes branch
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [],
      turn: "light"
    };

    this.newGame = this.newGame.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.nextTurn = this.nextTurn.bind(this);
    this.lastAvailableRow = this.lastAvailableRow.bind(this);
    this.checkWinner = this.checkWinner.bind(this);
  }

  componentDidMount() {
    this.newGame();
  }

  newGame() {
    const newBoard = [];
    let counter = 0;

    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        row.push({
          element: (
            <td onClick={() => this.changeColor(j)}>
              <div className="spot" key={counter}>
                {counter}
              </div>
            </td>
          ),
          selected: ""
        });
        counter++;
      }
      newBoard.push(row);
    }
    this.setState({
      board: newBoard
    });
  }

  nextTurn() {
    if (this.state.turn === "light") this.setState({ turn: "dark" });
    else this.setState({ turn: "light" });
  }

  lastAvailableRow(column) {
    // returns the last available index of column
    let lastRow = -1;
    this.state.board.forEach((element, index) => {
      if (element[column].selected === "") lastRow = index;
    });

    return lastRow;
  }

  vertical(arr) {}
  horizontal(arr) {}
  diagonal(arr) {}

  checkWinner() {
    let sequence = [];

    this.state.board.forEach((el, row) => {
      el.forEach((x, column) => {
        if (x.selected === this.state.turn) sequence.push({ row, column });
      });
    });

    if (
      sequence.length < 3 &&
      (this.vertical(sequence) ||
        this.horizontal(sequence) ||
        this.diagonal(sequence))
    )
      this.props.declare(this.state.turn);
  }

  changeColor(column) {
    const rowToPlace = this.lastAvailableRow(column);
    console.log("row: " + rowToPlace + "col: " + column);
    if (rowToPlace !== -1) {
      this.state.board[rowToPlace][column].element = (
        <td onClick={() => this.changeColor(column)}>
          <div
            className={"spot insert " + this.state.turn}
            key={rowToPlace * column}
          />
        </td>
      );

      this.state.board[rowToPlace][column].selected = this.state.turn;
      this.checkWinner();
      this.nextTurn();
    }
  }

  getSpots() {
    // returns all divs from 'board' array to dispaly as game board
    let arr = [];
    this.state.board.forEach((element, column) => {
      element.forEach(el => {
        arr.push(el.element);
      });
    });

    return arr;
  }

  render() {
    const spots = this.getSpots();

    return <table className="board">{spots}</table>;
  }
}

export default Board;
