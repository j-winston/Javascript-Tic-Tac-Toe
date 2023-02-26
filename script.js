// Gameboard draws itself and keeps track of where 'X' and 'O' tokens are placed.
// It also stores state if there is a winner or tie.
const gameBoard = (() => {
  // Private properties and methods
  const _gameArray = Array(3);
  // Returns true if space remains

  const _currentState = {
    winningToken: false,
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
  const checkForWinner = () => {
    // Check for L->R diagonal match
    if (token != "*") {
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
        _currentState.winningToken = token;
      }
    }

    // check for 3 way match vertically, starting at beginning of each column
    for (let i = 0; i < _gameArray.length; i++) {
      const token = _gameArray[i][0];
      if (token != "*") {
        // Check next two tokens underneath to see if they match
        if (_gameArray[i][1] === token) {
          if (_gameArray[i][2] === token) {
            // Return winning token
            _currentState.winningToken = token;
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
            _currentState.winningToken = token;
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
    }
  };

  // Public properties and methods
  const getGameState = () => {
    if (_currentState.tie) {
      return 'tie'; 
    }

    if (_currentState.winningToken) {
      return _currentState.winningToken;
    }
  };

  const clearArray = () => {
    _intializeArray();
  };

  // Inserts player token into array and returns true if tie or winner,
  // false if space is empty.
  const insert = (markedCell) => {
    const col = markedCell.col;
    const row = markedCell.row;
    const token = markedCell.token;
    const player = markedCell.player;

    // Check for tie
    if (_isFull()) {
      _updateState("tie");
    }

    // Check for space and insert
    if (_gameArray[col][row] === "*") {
      _gameArray[col][row] = token;
    } else return false;
  };

  const printBoard = () => {
    for (let i = 0; i < _gameArray.length; i++) {
      for (let j = 0; j < _gameArray.length; j++) {
        process.stdout.write(_gameArray[j][i]);
      }
      console.log();
    }
  };

  return { insert, clearArray, getGameState, checkForWinner };
})();

// Player factory
const makePlayer = (name, token, playerNum) => {
  return { name, token, playerNum };
};

// Draws stuff to screen
const displayController = (() => {
  const drawMark = (pos, token) => {
    // draw token to screen
  };

  const print = (mesg) => {
    // print message to screen
  };
  return {
    drawMark,
    print,
  };
})();

const gameController = (() => {
  // Start gameController()
  const _getCoordinate = (gridNode) => {
    const col = gridNode.getAttribute("data-pos").split(",")[0];
    const row = gridNode.getAttribute("data-pos").split(",")[1];

    return { col, row };
  };

  const markGrid = (gridNode) => {
    const pos = _getCoordinate(gridNode);
    const markedCell = {
      col: pos.col,
      row: pos.row,
      player: state.currentPlayer,
      token: state.currentPlayer.token,
    };
    gameBoard.insert(markedCell);
  };

  const getWinner = () => {
      if(gameBoard.getGameState){



      }
  };

  const state = {
    currentPlayer: "",
    playAgain: false,
    stillPlaying: true,
  };

  const turnOnGridEvents = () =>
    document.querySelectorAll(".grid-cell").forEach((gridNode) => {
      gridNode.addEventListener("click", () => {
        markGrid(gridNode);
          getWinner();
      });
    });

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

  const _setCurPlayer = (player) => {
    state.currentPlayer = player;
  };

  const startGame = (player1, player2) => {
    gameBoard.clearArray();
    turnOnGridEvents();
    _setCurPlayer(player1);
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
    const pos = displayController.getLastInput();
    return pos;
  };

  return {
    startGame,
    stillPlaying,
  };
})(gameBoard, displayController); //End gameController()

// MAIN

const player1 = makePlayer("James", "X", 1);
const player2 = makePlayer("Orin", "O", 2);
// Start game

gameController.startGame(player1, player2);
