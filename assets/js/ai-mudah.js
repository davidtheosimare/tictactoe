let BoardGame;
const Manusia = 'o';
const Robot    = 'x';

const FormulaWin = [ //formula kemenangan
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

function onStartGame () {

  document.querySelector('.end-game').style.display = 'none'; //sembunyikan alert hasil
  BoardGame = Array.from(Array(9).keys()); //jumlah action
  for(let i=0; i< cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', onTurnClick, false)
  }
};

function onTurnClick (e) {
  const { id:squareId } = e.target;
  if (typeof BoardGame[squareId] === 'number') {
    onTurn(squareId, Manusia);
    if (!onCheckGameTie()) {
      onTurn(botPicksSpot(), Robot)
    }
  } else {
    const message = 'Kamu tidak bisa memilih tempat yang sama ';
    alert(message);
  }
}

function onTurn (squareId, player) {
  BoardGame[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let TheWinner = onCheckWin(BoardGame, player);
  
  if (TheWinner) {
    onGameOver(TheWinner);
  }
}

function onCheckWin (board, player) {
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

function onGameOver ({ index, player }) {
  for (let i of FormulaWin[index]) {
    const color = (player === Manusia) ? 'blue' : 'red';
    document.getElementById(i).style.backgroundColor = color;
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', onTurnClick, false)
  }

  const result = (player === Manusia) ? 'Kamu Menang, Yeah!' : 'Kamu Kalah :(';
  onDeclareWinner(result);
}

function onDeclareWinner (who) {
  // console.log('Result: ', who);
  document.querySelector('.end-game').style.display = 'block';
  document.querySelector('.end-game .text').innerText = `Hasil: ${who}`;
}
 


function onCheckGameTie () {
  if (emptySquares().length === 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = 'green';
      cells[i].removeEventListener('click', onTurnClick, false)
    }
    onDeclareWinner('Draw');
    return true;
  } else {
    return false;
  }
}

function emptySquares () {
  return BoardGame.filter(item => typeof item === 'number');
}

function botPicksSpot () {
  return emptySquares()[0];
}