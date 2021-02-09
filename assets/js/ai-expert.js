let GameBoard;
const Manusia = 'o';
const Robot = 'x';

const FormulaWin = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6]
];

const cells = document.getElementsByClassName('cell');
onStartGame();

function onStartGame() {
  document.querySelector('.end-game').style.display = 'none';
  GameBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', onTurnClick, false)
  }
};

function onTurnClick(e) {
  const { id: squareId } = e.target;
  if (typeof GameBoard[squareId] === 'number') {
    onTurn(squareId, Manusia);
    if (!onCheckGameTie()) {
      onTurn(botPicksSpot(), Robot)
    }
  } else {
    const message = 'Kamu tidak bisa memilih tempat yang sama';
    alert(message);
  }
}

function onTurn(squareId, player) {
  GameBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let TheWinner = onCheckWin(GameBoard, player);
  if (TheWinner) {
    onGameOver(TheWinner);
  }
}

function onCheckWin(board, player) {
  let plays = board.reduce((a, e, i) => {
    return (e === player) ? a.concat(i) : a;
  }, []);
  let gameWon = false;
  for (let [index, win] of FormulaWin.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {
        index: index,
        player: player
      };
      break;
    }
  }
  return gameWon;
}

function onGameOver({ index, player }) {
  for (let i of FormulaWin[index]) {
    const color = (player === Manusia) ? '#2196f3' : '#f44336';
    document.getElementById(i).style.backgroundColor = color;
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', onTurnClick, false)
  }

  const result = (player === Manusia) ? 'Kamu Menang, Yeah!' : 'Kamu Kalah :(';
  onDeclareWinner(result);
}

function onDeclareWinner(who) {
  // console.log('Result: ', who);
  document.querySelector('.end-game').style.display = 'block';
  document.querySelector('.end-game .text').innerText = `Hasil: ${who}`;
}

/**
 * Bot moves
 */

function onCheckGameTie() {
  if (emptySquares().length === 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = '#8bc34a';
      cells[i].removeEventListener('click', onTurnClick, false)
    }
    onDeclareWinner('A Tie');
    return true;
  } else {
    return false;
  }
}

function emptySquares() {
  return GameBoard.filter(item => typeof item === 'number');
}

function botPicksSpot() {
  return minimax(GameBoard, Robot).index;
}

function minimax(newBoard, player) {
  let availableSpots = emptySquares();

  if (onCheckWin(newBoard, Manusia)) {
    return { score: -10 }
  } else if (onCheckWin(newBoard, Robot)) {
    return { score: 10 }
  } else if (availableSpots.length === 0) {
    return { score: 0 }
  }

  let moves = [];

  for (let i=0; i<availableSpots.length; i++) {
    let move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player === Robot) {
      let result = minimax(newBoard, Manusia);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, Robot);
      move.score = result.score;
    } 
    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  } 

  let bestMove;

  if (player === Robot) {
    let bestScore = -10000;
    for (let i=0; i<moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    } 
  } 
  else {
    let bestScore = 10000;
    for (let i=0; i<moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
} 