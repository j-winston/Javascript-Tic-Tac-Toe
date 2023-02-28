// Gameboard draws itself and keeps track of where 'X' and 'O' tokens are placed.
// It also stores state if there is a winner or tie.
const gameBoard = (() => {
  // Private properties and methods
  const _gameArray = Array(3);
  // Returns true if space remains
  const freeSpaceMarker = "*";

  const _currentState = {
    win: false,
    tie: false,
    lastMarkedCell: "",
    /*col: pos.col,
      row: pos.row,
      player: state.currentPlayer,
      playerToken: state.currentPlayer.token,
      */
  };

  const _isFreeSpace = (arr) => {
    if (arr === freeSpaceMarker) {
      return true;
    }
    return false;
  };

  // Create a 3x3 array to store values.
  // Later we will write this to UI
  const _intializeArray = () => {
    for (let i = 0; i < _gameArray.length; i++) {
      _gameArray[i] = Array(3);
    }

    for (let i = 0; i < _gameArray.length; i++) {
      for (let j = 0; j < _gameArray.length; j++) {
        _gameArray[i][j] = freeSpaceMarker;
      }
    }
  };

  const _isFull = () => {
    for (let i = 0; i < _gameArray.length; i++) {
      for (let j = 0; j < _gameArray.length; i++) {
        if (_gameArray[i][j] === freeSpaceMarker) {
          return false;
        }
      }
    }
    return true;
  };
  const _setLastMarkedCell = (markedCell) => {
    _currentState.lastMarkedCell = markedCell;
  };
  // Return winning token if one exists
  const checkForWinner = () => {
    // Check for L->R diagonal match
    if (
      (_gameArray[0][0] != freeSpaceMarker &&
        _gameArray[0][0] === _gameArray[1][1] &&
        _gameArray[1][1] === _gameArray[2][2]) ||
      (_gameArray[2][0] != freeSpaceMarker &&
        // Check for R->L diagonal match
        _gameArray[2][0] === _gameArray[1][1] &&
        _gameArray[1][1] === _gameArray[0][2])
    ) {
      _currentState.win = true;
      return true;
    }

    // check for 3 way match vertically, starting at beginning of each column
    for (let i = 0; i < _gameArray.length; i++) {
      const token = _gameArray[i][0];
      if (token != freeSpaceMarker) {
        // Check next two tokens underneath to see if they match
        if (_gameArray[i][1] === token) {
          if (_gameArray[i][2] === token) {
            _currentState.win = true;
            return true;
          }
        }
      }
    }

    //  check for 3 way match horizontally, starting at beginning of each row
    for (let i = 0; i < _gameArray.length; i++) {
      // Grab first token of each row for each iteration
      const token = _gameArray[0][i];
      if (token != freeSpaceMarker) {
        // Check next two adjacent tokens to see if match
        if (_gameArray[1][i] === token) {
          if (_gameArray[2][i] === token) {
            _currentState.win = true;
            return true;
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
      return "tie";
    }

    if (_currentState.winningToken) {
      return _currentState.winningToken;
    }
  };

  const returnCurrentState = () => {
    return _currentState;
  };

  const clearArray = () => {
    _intializeArray();
  };

  // Inserts player token into array and returns true if tie or winner,
  // false if space is empty.
  const insert = (cell) => {
    const col = cell.col;
    const row = cell.row;
    const token = cell.token;

    // Check for tie, check for space and then insert
    if (_isFreeSpace(_gameArray[col][row])) {
      _gameArray[col][row] = token;
      _setLastMarkedCell(cell);
      return true;
    }
    return false;
  };

  const getLastMarkedCell = () => {
    return _currentState.lastMarkedCell;
  };

  const printBoard = () => {
    for (let i = 0; i < _gameArray.length; i++) {
      for (let j = 0; j < _gameArray.length; j++) {
        process.stdout.write(_gameArray[j][i]);
      }
      console.log();
    }
  };

  return {
    insert,
    clearArray,
    getGameState,
    checkForWinner,
    getLastMarkedCell,
    returnCurrentState,
  };
})();

// Player factory
const makePlayer = (name, token, playerNum) => {
  return { name, token, playerNum };
};

// Draws stuff to screen
const displayController = (() => {
  const drawMark = (clickedCell) => {
    const clickedCellPos = `"${clickedCell.col},${clickedCell.row}"`;
    const playerToken = clickedCell.token;

    alert(clickedCellPos);

    document.querySelector("[data-pos=" + clickedCellPos + "]").textContent =
      playerToken;
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
  const _getColRowPos = (gridNode) => {
    const col = gridNode.getAttribute("data-pos").split(",")[0];
    const row = gridNode.getAttribute("data-pos").split(",")[1];

    return { col, row };
  };

  const makeCellObj = (clickedCell) => {
    const pos = _getColRowPos(clickedCell);
    const player = gameControllerState.currentPlayer;

    const cell = {
      col: pos.col,
      row: pos.row,
      player: player,
      token: player.token,
    };
    return cell;
  };

  const gameControllerState = {
    currentPlayer: "",
    playAgain: false,
    stillPlaying: true,
  };

  const turnOnGridEvents = () => {
    document.querySelectorAll(".grid-cell").forEach((gridEl) => {
      gridEl.addEventListener("click", function mainGameLoop() {
        const clickedCell = makeCellObj(gridEl);
        if (gameBoard.insert(clickedCell)) {
          displayController.drawMark(gameBoard.getLastMarkedCell());
          if (gameBoard.checkForWinner()) {
            alert("winner" + clickedCell.player.name);
          } else {
            _switchTurns();
          }
        }
      });
    });
  };

  const _switchTurns = () => {
    if (gameControllerState.currentPlayer === player1) {
      gameControllerState.currentPlayer = player2;
    } else {
      gameControllerState.currentPlayer = player1;
    }
  };

  const currentPlayer = () => {
    return gameControllerState.currentPlayer;
  };

  const _setCurPlayer = (player) => {
    gameControllerState.currentPlayer = player;
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
