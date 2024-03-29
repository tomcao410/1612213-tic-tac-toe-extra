import React from 'react';
import logo from './logo.svg';
import './Game.css';
import Board from './components/Board.js';
const boardSize = 20; // Board.js also contain this parameter

// -------------GAME-------------
class Game extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(boardSize * boardSize).fill(null),
        pastCol: null,
        pastRow: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      currentClick: null,
      isDescending: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    const squares = current.squares.slice();
    if (calculateWinner(this.state.currentClick, squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        pastCol: (i % 20) + 1,
        pastRow: Math.floor(i / 20) + 1,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      currentClick: i,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  sortHistory() {
    this.setState({
      isDescending: !this.state.isDescending
    });
  }

  render()
  {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(this.state.currentClick, current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to #' + move + "- (col: " + history[move].pastCol + ", row: " + history[move].pastRow + ")" :
        'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{move === this.state.stepNumber ? <b>{desc}</b> : desc}</button>
          </li>
        )
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="App">

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Welcome to <strong>Tic-Tac-Toe</strong> Vietnamese version!
          </p>
          <div className="line">
            <strong>RULE: </strong>
            Who hits 5 without being block at the 2 ends first is the WINNER!
            <div className="line"></div>
          </div>
        </header>

        <body className="App-body">
          <div>{status}</div>
          <table>
            <td >
            <Board
              winningSquares={winner ? winner.line : []}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
            </td>
            <button onClick={() => this.sortHistory()}>
              Sort by: {this.state.isDescending ? "Descending" : "Ascending"}
            </button>
            <td>
            Scrolling menu:
              <div className="vertical-menu">{this.state.isDescending ? moves : moves.reverse()}</div>
            </td>
          </table>
        </body>

      </div>
    );
  }
}

//----------------------------------------------------

export default Game;

//----------------------------------------------------

// Caculate who is the winner
function calculateWinner(currentSquare, squares)
{
  if (horizontalLine(currentSquare, squares))
  {
    return horizontalLine(currentSquare, squares);
  }
  else if (verticalLine(currentSquare, squares))
  {
    return verticalLine(currentSquare, squares);
  }
  else if (slashLine(currentSquare, squares))
  {
    return slashLine(currentSquare, squares);
  }
  else if (backSlashLine(currentSquare, squares))
  {
    return backSlashLine(currentSquare, squares);
  }
  else {
    return false;
  }
}

// Horizontal line (left + right)
function horizontalLine(currentSquare, squares)
{
  const lines = [
    [squares[currentSquare], squares[currentSquare + 1],
      squares[currentSquare + 2], squares[currentSquare + 3],
      squares[currentSquare + 4], squares[currentSquare + 5], squares[currentSquare - 1]],
    [squares[currentSquare], squares[currentSquare - 1],
      squares[currentSquare - 2], squares[currentSquare - 3],
      squares[currentSquare - 4], squares[currentSquare - 5], squares[currentSquare + 1]]
  ]

  for (let i = 0; i < lines.length; i++)
  {
    const [a, b, c, d, e, f, g] = lines[i];
    if (a
      && a === b
      && a === c
      && a === d
      && a === e
      && ((a === f || f === null) || (a === g || g === null)))
      {
        return {player: a, line: [a, b, c, d, e]};
      }
  }
  return false;
}

// Vertical line (up + down)
function verticalLine(currentSquare, squares)
{
  const lines = [
    [squares[currentSquare], squares[currentSquare + boardSize],
      squares[currentSquare + boardSize * 2], squares[currentSquare + boardSize * 3],
      squares[currentSquare + boardSize * 4], squares[currentSquare + boardSize * 5], squares[currentSquare - boardSize]],
    [squares[currentSquare], squares[currentSquare - boardSize],
      squares[currentSquare - boardSize * 2], squares[currentSquare - boardSize * 3],
      squares[currentSquare - boardSize * 4], squares[currentSquare - boardSize * 5], squares[currentSquare + boardSize]]
  ]

  for (let i = 0; i < lines.length; i++)
  {
    const [a, b, c, d, e, f, g] = lines[i];
    if (a
      && a === b
      && a === c
      && a === d
      && a === e
      && ((a === f || f === null) || (a === g || g === null)))
      {
        return {player: a, line: [a, b, c, d, e]};
      }
  }
  return false;
}

// Slash line
function slashLine(currentSquare, squares)
{
  const lines = [
    [squares[currentSquare], squares[currentSquare + boardSize + 1],
      squares[currentSquare + (boardSize * 2) + 2], squares[currentSquare + (boardSize * 3) + 3],
      squares[currentSquare + (boardSize * 4) + 4], squares[currentSquare + (boardSize * 5) + 5], squares[currentSquare - boardSize - 1]],
    [squares[currentSquare], squares[currentSquare - boardSize - 1],
      squares[currentSquare - (boardSize * 2) - 2], squares[currentSquare - (boardSize * 3) - 3],
      squares[currentSquare - (boardSize * 4) - 4], squares[currentSquare - (boardSize * 5) - 5], squares[currentSquare + boardSize + 1]]
  ]

  for (let i = 0; i < lines.length; i++)
  {
    const [a, b, c, d, e, f, g] = lines[i];
    if (a
      && a === b
      && a === c
      && a === d
      && a === e
      && ((a === f || f === null) || (a === g || g === null)))
      {
        return {player: a, line: [a, b, c, d, e]};
      }
  }
  return false;
}

// Backslash line
function backSlashLine(currentSquare, squares)
{
  const lines = [
    [squares[currentSquare], squares[currentSquare + boardSize - 1],
      squares[currentSquare + (boardSize * 2) - 2], squares[currentSquare + (boardSize * 3) - 3],
      squares[currentSquare + (boardSize * 4) - 4], squares[currentSquare + (boardSize * 5) - 5], squares[currentSquare - boardSize + 1],
      squares[currentSquare - boardSize + 1]],
    [squares[currentSquare], squares[currentSquare - boardSize + 1],
      squares[currentSquare - (boardSize * 2) + 2], squares[currentSquare - (boardSize * 3) + 3],
      squares[currentSquare - (boardSize * 4) + 4], squares[currentSquare - (boardSize * 5) + 5], squares[currentSquare + boardSize - 1],
      squares[currentSquare + boardSize - 1]]
  ]

  for (let i = 0; i < lines.length; i++)
  {
    const [a, b, c, d, e, f, g] = lines[i];
    if (a
      && a === b
      && a === c
      && a === d
      && a === e
      && ((a === f || f === null) || (a === g || g === null)))
      {
        return {player: a, line: [a, b, c, d, e]};
      }
  }
  return false;
}
