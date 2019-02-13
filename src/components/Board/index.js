import React, { Component } from "react";
import "./Board.css";

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
    this.includedAtLast = this.includedAtLast.bind(this);
    this.includedAtFirst = this.includedAtFirst.bind(this);
    this.vertical = this.vertical.bind(this);
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
          elementClass: "spot ",
          selected: "",
          index: counter,
          column: j,
          row: i
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

  includedAtLast(arr) {
    // Checks if 'forbidden' numbers appear except last index of an array
    const forbidden = [];
    this.state.board.forEach((element, index, arr) => {
      forbidden.push(index * arr[index].length + arr.length);
    });

    let flag = false;

    arr.forEach((x, index) => {
      if (index !== arr.length - 1 && forbidden.indexOf(x) !== -1) {
        flag = true;
      }
    });

    return flag;
  }

  includedAtFirst(arr) {
    console.log('given array: '+arr)
    // Checks if 'forbidden' numbers appear except first index of an array
    const forbidden = [];
    this.state.board.forEach((element, index) => {
      forbidden.push(index * element.length);
    });

    let flag = false;

    arr.forEach((x, index) => {
      if (index !== arr.length -1 && forbidden.indexOf(x) !== -1) {
        flag = true;
      }
    });

    return flag;
  }

  vertical(arr) {
    const rowLength = this.state.board[0].length;
    let found = false;

    arr.forEach((num, index) => {
      let gap = 0;
      let sequenceLength = 0;
      let root = index;

      if (arr.length - index > 3)
        while (gap <= rowLength) {
          gap = arr[index + 1] - arr[root];
          if (gap == rowLength) {
            sequenceLength++;
            root = index + 1;
          }
          index++;
        }
      if (sequenceLength == 3) found = true;
    });

    return found;
  }

  horizontal(arr) {
    let found = false;

    arr.forEach((num, index) => {
      let sequence = [num];
      let gap = arr[index + 1] - num;

      while (gap == 1) {
        if (gap == 1) {
          sequence.push(arr[index + 1]);
          index++;
          num++;
        }
        gap = arr[index + 1] - num;
      }

      if (sequence.length == 4 && !this.includedAtLast(sequence)) found = true;
    });
    return found;
  }

  diagonal(arr) {
    const bigGap = this.state.board[0].length + 1;
    const smallGap = this.state.board[0].length - 1;
    let found = false;

    arr.forEach((num, index) => {
      let gap = 0;
      let sequence = [num];
      let root = index;

      if (arr.length - index > 3)
        while (gap <= bigGap) {
          gap = arr[index + 1] - arr[root];
          if (gap == bigGap) {
            sequence.push(arr[index + 1]);
            root = index + 1;
          }
          index++;
        }
      if (sequence.length == 4 && !this.includedAtLast(sequence)) found = true;
    });

    arr.forEach((num, index) => {
      let gap = 0;
      let sequence = [num];
      let root = index;

      if (arr.length - index > 3)
        while (gap <= smallGap) {
          gap = arr[index + 1] - arr[root];
          if (gap == smallGap) {
            sequence.push(arr[index + 1]);
            root = index + 1;
          }
          index++;
        }
      if (sequence.length == 4 && !this.includedAtFirst(sequence)) found = true;
    });

    return found;
  }

  checkWinner() {
    let sequence = [];

    this.state.board.forEach((el, row) => {
      el.forEach((x, column) => {
        if (x.selected === this.state.turn) sequence.push(x.index);
      });
    });

    console.log(sequence);
    if (
      sequence.length > 3 &&
      (this.vertical(sequence) ||
        this.horizontal(sequence) ||
        this.diagonal(sequence))
    )
      this.props.declare(this.state.turn);
  }

  changeColor(column) {
    const rowToPlace = this.lastAvailableRow(column);
    if (rowToPlace !== -1) {
      let counter = -1;
      const board = this.state.board.map((element, index) => {
        if (index !== rowToPlace) return element;
        let newRow = element.map(el => {
          counter++;
          if (el.column !== column) return el;

          return {
            elementClass: "spot insert " + this.state.turn,
            selected: this.state.turn,
            index: this.state.board[rowToPlace][column].index,
            column: column,
            row: rowToPlace
          };
        });

        return newRow;
      });

      console.log(this.state.board);

      console.log(board);

      this.setState({ board });
      setTimeout(() => {
        this.checkWinner();
        this.nextTurn();
      }, 100);
    }
  }

  getSpots() {
    // creates divs from 'board' array to dispaly as game board
    let arr = [];
    this.state.board.forEach((element, column) => {
      element.forEach(el => {
        arr.push(
          <td onClick={() => this.changeColor(el.column)}>
            <div className={el.elementClass} key={el.index} />
          </td>
        );
      });
    });

    return arr;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  render() {
    // // const arr = [0,7,14,21,28,35]
    // const arr = [0,2,4,6,8]    
    // console.log(arr);
    // console.log(this.includedAtFirst(arr));

    const spots = this.getSpots();
    const turn = this.capitalizeFirstLetter(this.state.turn)

    return [
      <div className="turn">{turn}'s turn</div>,
      <table className="board">{spots}</table>
    ];
  }
}

export default Board;
