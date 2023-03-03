// Gameboard draws itself and keeps track of where 'X' and 'O' tokens are placed.



// It also stores state if there is a winner or tie.
const gameBoard = (() => {
  // Private properties and methods
  const _gameArray = Array(3);
  // Returns true if space remains
  const freeSpaceMarker = "*";

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

  const checkForTie = () => {
    for (let i = 0; i < _gameArray.length; i++) {
      for (let j = 0; j < _gameArray.length; j++) {
        if (_gameArray[i][j] === freeSpaceMarker) {
          return false;
        }
      }
    }
    return true;
  };
  //
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
      return true;
    }

    // check for 3 way match vertically, starting at beginning of each column
    for (let i = 0; i < _gameArray.length; i++) {
      const token = _gameArray[i][0];
      if (token != freeSpaceMarker) {
        // Check next two tokens underneath to see if they match
        if (_gameArray[i][1] === token) {
          if (_gameArray[i][2] === token) {
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
            return true;
          }
        }
      }
    }
    // If no winner....
    return false;
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
      return true;
    }
    return false;
  };

  return {
    insert,
    clearArray,
    checkForWinner,
    checkForTie,
  };
})();

// Player factory
const makePlayer = (name, token, playerNum) => {
  return { name, token, playerNum };
};

// Draws stuff to screen
const displayController = (() => {
  const elements = {
    playAgain: document.querySelector(".play-again-display"),
    playerNamePrompt: document.querySelector(".player-name-form"),
    gameGrid: document.querySelector(".game-grid"),
    messageBoard: document.querySelector(".message-board"),
    playerNameForm: document.getElementById("form"),
  };

  const hide = (hideEl) => {
    if (hideEl === "all") {
      for (const el in elements) {
        elements[el].style.display = "none";
      }
    } else {
      hideEl.style.display = "none";
    }
  };

  const show = (showEl) => {
    showEl.style.display = "initial";
  };

  const getFormData = () => {
    const playerData = {};
    elements.playerNameForm.addEventListener("submit", () => {
      const formData = new FormData(form);
      for (const [key, value] of formData) {
        playerData[key] = value;
      }
    });
    return playerData 
  };

  const drawMark = (cell) => {
    const tokenPos = `"${cell.col},${cell.row}"`;
    const playerToken = cell.token;
    document.querySelector("[data-pos=" + tokenPos + "]").textContent =
      playerToken;
  };

  const print = (mesg) => {
    elements.messageBoard.classList.add("fade-in");
    elements.messageBoard.textContent = mesg;
  };

  const clearPrint = () => {
    elements.messageBoard.classList.remove("fade-in");
  };

  const clearBoard = () => {
    elements.gameGrid.classList.add("fade-out");
  };

  return {
    hide,
    show,
    getFormData,
    elements,
    drawMark,
    print,
    clearPrint,
    clearBoard,
  };
})();

const gameController = (() => {
  const gameControllerState = {
    currentPlayer: "",
    playAgain: false,
    stillPlaying: true,

    lastMarkedCell: "",
    win: false,
    tie: false,
  }; // Start gameController()

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

  const Main = (clickedGridEl) => {
    const cell = makeCellObj(clickedGridEl);

    // returns an obj with col, row, player and token used
    // attempt to insert token into the array
    // if its successful, update game state, then display on screen
    if (gameBoard.insert(cell)) {
      displayController.drawMark(cell);
      gameControllerState.lastMarkedCell = cell;

      if (gameBoard.checkForWinner()) {
        const winnerName = gameControllerState.lastMarkedCell.player.name;
        gameControllerState.win = true;
        gameControllerState.winner = winnerName;

        displayController.print(winnerName + " Wins");
        displayController.clearBoard();

        gameBoard.clearArray();
      } else if (gameBoard.checkForTie()) {
        gameControllerState.tie = true;
        displayController.print("Cat's Game");
      } else {
        _switchTurns();
      }
    }
  };

  const turnOnGridEvents = () => {
    document.querySelectorAll(".grid-cell").forEach((clickedGridEl) => {
      clickedGridEl.addEventListener("click", () => {
        Main(clickedGridEl);
      });
    });
  };

  const _switchTurns = () => {
    if (gameControllerState.currentPlayer === player1) {
      gameControllerState.currentPlayer = player2;
    } else {
      gameControllerState.currentPlayer = player1;
    }
    displayController.print(gameControllerState.currentPlayer.name);
  };

  const _setCurPlayer = (player) => {
    gameControllerState.currentPlayer = player;
  };

  const getPlayers = () => {
    displayController.hide("all");
    displayController.hide(displayController.elements.gameGrid);
    displayController.show(displayController.elements.playerNamePrompt);  


  };

  const startGame = (player1, player2) => {
    gameBoard.clearArray();
    getPlayers();
    _setCurPlayer(player1); // no need for private here
    displayController.print(gameControllerState.currentPlayer.name);
    turnOnGridEvents();
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

const player1 = makePlayer("James", ":)", 1);
const player2 = makePlayer("Orin", ":(", 2);
// Start game

gameController.startGame(player1, player2);
