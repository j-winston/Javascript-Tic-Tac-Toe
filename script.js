// Gameboard draws itself and keeps track of where 'X' and 'O' tokens are placed.
// It also stores state if there is a winner or tie.

const gameBoard = (() => {
  const _gameArray = Array(3);
  const _currentState = {
    winner: "",
    tie: false,
  };

  const _checkWinner = () => {
    // Check along each of the 3 columns for a vertical match
    for (let i = 0; i < _gameArray.length; i++) {
      const token = _gameArray[i][0];
      if (token != "*") {
        if (_gameArray[i][1] === token) {
          if (_gameArray[i][2] === token) {
            _currentState.winner = token;
          }
        }
      }
    }

    // Check along each of the rows
    // for (let i = 0; i < _gameArray.length; i++) {
    //   const token = _gameArray[i][i+1];
    //   if (_gameArray[1][i] === token) {
    //     if (_gameArray[2][i] === token) {
    //       _currentState.winner = token;
    //     }
    //   }
    // }
  };

  const gameState = () => {
    if (_currentState.tie) {
      return "Tie";
    }

    if (_currentState.winner) {
      return 'The winner is ' + _currentState.winner;
    }
  };

  // Create a 3x3 array to store values.
  // Later we will write this to UI
  const _intializeArray = () => {
    for (let i = 0; i < _gameArray.length; i++) {
      _gameArray[i] = Array(3);
    }

    for (let i = 0; i < _gameArray.length; i++) {
      for (let j = 0; j < _gameArray.length; j++) {
        _gameArray[i][j] = "*";
      }
    }
  };

  const drawBoard = () => {
    _intializeArray();
  };

  const insert = (positionMarker) => {
    const col = positionMarker.col;
    const row = positionMarker.row;
    const token = positionMarker.token;

    //switch this around!
    _gameArray[col][row] = token;
      _checkWinner();
  };

  const printBoard = () => {
    for (let i = 0; i < _gameArray.length; i++) {
      for (let j = 0; j < _gameArray.length; j++) {
        process.stdout.write(_gameArray[j][i]);
      }
      console.log();
    }
  };

  return { insert, drawBoard, printBoard, gameState };
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
const player1 = player("james", "O"); // Get player input

gameBoard.insert(player1.markPos(0, 0));
gameBoard.insert(player1.markPos(0, 1));
gameBoard.insert(player1.markPos(0, 2));

gameBoard.printBoard();
console.log(gameBoard.gameState());
