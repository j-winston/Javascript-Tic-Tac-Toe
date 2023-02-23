// Gameboard draws itself and keeps track of where 'X' and 'O' tokens are placed.
// It also stores state if there is a winner or tie.

const PromptSync = require("prompt-sync");

const gameBoard = (() => {
  // Private properties and methods
  const _gameArray = Array(3);
  // Returns true if space remains

  const _currentState = {
    winner: false,
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
        _gameArray[i][j] = "*";
      }
    }
  };

  const _isFull = () => {
    for (let i = 0; i < _gameArray.length; i++) {
      for (let j = 0; j < _gameArray.length; i++) {
        if (_gameArray[i][j] === "*") {
          return false;
        }
      }
    }
    return true;
  };

  // Return winning token if one exists
  const _checkWinner = () => {
    // Check for L->R diagonal match
    if (
      _gameArray[0][0] === _gameArray[1][1] &&
      _gameArray[1][1] === _gameArray[2][2]
    ) {
      // If diagonals match, return that token as winner
      const token = _gameArray[0][0];
      return token;
    } else if (
      // Check for R->L diagonal match
      _gameArray[2][0] === _gameArray[1][1] &&
      _gameArray[1][1] === _gameArray[0][2]
    ) {
      const token = _gameArray[2][0];
      return token;
    }

    // check for 3 way match vertically, starting at beginning of each column
    for (let i = 0; i < _gameArray.length; i++) {
      const token = _gameArray[i][0];
      if (token != "*") {
        // Check next two tokens underneath to see if they match
        if (_gameArray[i][1] === token) {
          if (_gameArray[i][2] === token) {
            // Return winning token
            return token;
          }
        }
      }
    }

    //  check for 3 way match horizontally, starting at beginning of each row
    for (let i = 0; i < _gameArray.length; i++) {
      // Grab first token of each row for each iteration
      const token = _gameArray[0][i];
      if (token != "*") {
        // Check next two adjacent tokens to see if match
        if (_gameArray[1][i] === token) {
          if (_gameArray[2][i] === token) {
            return token;
          }
        }
      }
    }

    // If no winner....
    return false;
  };

  const _updateState = (state) => {
    if (state === "Tie") {
      _currentState.tie == true;
    } else _currentState.winner = state;
  };

  // Public properties and methods
  const gameState = () => {
    if (_currentState.tie) {
      return "Tie";
    }

    if (_currentState.winner) {
      return "The winner is " + _currentState.winner;
    } else {
      return "Still playing: " + _currentState.playing;
    }
  };

  const clearArray = () => {
    _intializeArray();
  };

  // Inserts player token into array and returns true if tie or winner,
  // false if space is empty.
  const insert = (positionMarker) => {
    const col = positionMarker.col;
    const row = positionMarker.row;
    const token = positionMarker.token;
    // Check for tie
    if (_isFull()) {
      _updateState("tie");
      return true;
    }

    // Check for space and insert
    if (_gameArray[col][row] === "*") {
      _gameArray[col][row] = token;
    } else return false;

    // Check for a winner, update state if necessary
    if (_checkWinner()) {
      _updateState(_checkWinner());
      return true;
    }
  };

  const printBoard = () => {
    for (let i = 0; i < _gameArray.length; i++) {
      for (let j = 0; j < _gameArray.length; j++) {
        process.stdout.write(_gameArray[j][i]);
      }
      console.log();
    }
  };

  return { insert, clearArray, printBoard, gameState };
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

// Manipulates DOM elements

// Main game loop uses gameController for game flow

const gameController = (() => {

  const state = {
    currentPlayer: "",
    playAgain: false,
    stillPlaying: true,
  };

  const _switchTurns = () => {
    if (state.currentPlayer === player1) {
      state.currentPlayer = player2;
    } else {
      state.currentPlayer = player1;
    }
  };

  const currentPlayer = () => {
    return state.currentPlayer;
  };

  const startGame = (player1, player2) => {
    gameBoard.clearArray();
    state.currentPlayer = player1;
  };

  const endGame = () => {
    state.stillPlaying = false;
  };

  const stillPlaying = () => {
    if (state.stillPlaying) {
      return true;
    }
    return false;
  };

  const getInput = () => {
    // Get currentPlayer input from DOM
    // Switch turns
    _switchTurns();
  };

  return {
    startGame,
    endGame,
    stillPlaying,
  };
})(gameBoard);

// Main game loop
const player1 = player("James", "X");
const player2 = player("Orin", "O");
gameController.startGame(player1, player2);

while(gameController.stillPlaying){
    gameController.getInput();

}
// Get input and display to screen
// Check for winner
// If winner display on screen
// If tie display to screen
// Ask to play again
// Get input
// If not, end game
// If yes play again

console.log(gameBoard.gameState());
