// Gameboard draws itself and keeps track of where 'X' and 'O' tokens are placed.
// It also stores state if there is a winner or tie.

const gameBoard = (() => {
  const _gameArray = Array(3);
  const _currentState = {
    winner: "",
    tie: false,
  };

  // Create a 3x3 array to store values.
  // Later we will write this to UI
  const _intializeArray = () => {
    for (let i = 0; i < _gameArray.length; i++) {
      _gameArray[i] = Array(3);
    }

    for (let i = 0; i < _gameArray.length; i++) {
      for (let j = 0; j < _gameArray.length; j++) {
        _gameArray[i][j] = 'O'; 
      }
    }
  };

  const insert = (positionMarker) => {
    const col = positionMarker.col;
    const row = positionMarker.row;
    const token = positionMarker.token;

      _gameArray[col][row] = token;
  };

  const drawBoard = () => {
    _intializeArray();
  };

  const printBoard = () => {
    for (let i = 0; i < _gameArray.length; i++) {
      for (let j = 0; j < _gameArray.length; j++) {
      }
        console.log(_gameArray[i])
    }

  };

  return { insert, drawBoard, printBoard };
})();

// Player logic
const player = (name, token) => {
  const _name = name;
  const _token = token;

  const markPos = (col, row) => {
    const tokenPosition = {
      col,
      row,
      token: _token,
    };
    return tokenPosition;
  };

  return { markPos };
};

// Main game loop

gameBoard.drawBoard();

const player1 = player("james", "X");

gameBoard.insert(player1.markPos(0, 0));
gameBoard.printBoard();
