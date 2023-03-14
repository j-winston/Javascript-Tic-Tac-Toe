// Look at why the variables are holding their value
// :
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

// Draws stuff to screen

const displayController = (() => {
  const elements = {
    playAgainDisplay: document.querySelector(".play-again-display"),
    playerNamePrompt: document.querySelector("[for=fname]"),
    gameGrid: document.querySelector(".game-grid"),
    messageBoard: document.querySelector(".message-board"),
    playerNameForm: document.getElementById("form"),
    restartGameLink: document.querySelector(".restart-link"),
    quitLink: document.querySelector(".quit-link"),
  };

  const turnOnFormEvents = (onSubmit) => {
    elements.playerNameForm.addEventListener("submit", () => {
      let playerName;
      const formData = new FormData(form);
      for (const [key, value] of formData) {
        playerName = value;
      }
      onSubmit(playerName);
    });
  };

  const clearMessageBoard = () => {
    elements.messageBoard.textContent = "";
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
    showEl.style.display = "";
  };

  const getFormData = (callBack) => {
    //
  };

  const resetForm = () => {
    document.getElementById("form").reset();
  };

  const drawMark = (cell) => {
    const tokenPos = `"${cell.col},${cell.row}"`;
    const tokenSymbol = cell.token;
    const gridSquareEL = document.querySelector("[data-pos=" + tokenPos + "]");
    const tokenTextEl = document.createElement("p");
    tokenTextEl.textContent = tokenSymbol;

    tokenTextEl.classList.add("fade-in");
    gridSquareEL.appendChild(tokenTextEl);
  };

  const displayMessage = (el, mesg) => {
    // show element
    // displayMessage message to screen
    el.textContent = mesg;
  };

  const cleardisplayMessage = () => {
    elements.messageBoard.classList.remove("fade-in");
  };

  const clearGameBoard = () => {
    document.querySelectorAll(".grid-cell").forEach((cell) => {
      cell.textContent = "";
    });
  };

  const fadeOut = (el) => {
    el.classList.add("fade-out");
    el.style.display = "none";
  };

  const showNamePrompt = (mesg) => {
    if (!mesg) {
      displayController.showNamePrompt;
      displayController.hide(displayController.elements.playerNameForm);
      displayController.hide(displayController.elements.playerNamePrompt);
    } else {
      displayController.show(displayController.elements.playerNameForm);
      displayController.show(displayController.elements.playerNamePrompt);
      displayController.displayMessage(
        displayController.elements.playerNamePrompt,
        mesg
      );
    }
  };

  const showGameGrid = (show = true) => {
    if (!show) {
      displayController.hide(displayController.elements.gameGrid);
    } else {
      displayController.show(displayController.elements.gameGrid);
    }
  };

  const showMessageDisplay = (show = true) => {
    if (!show) {
      displayController.hide(elements.messageBoard);
    } else {
      displayController.show(elements.messageBoard);
    }
  };

  const showQuitMessage = (show = true) => {
    if (!show) {
      displayController.hide(elements.playAgainDisplay);
      displayController.hide(elements.restartGameLink);
      displayController.hide(elements.quitLink);
    } else {
      displayController.show(elements.playAgainDisplay);
      displayController.show(elements.restartGameLink);
      displayController.show(elements.quitLink);
    }
  };

  const turnOnEndEvents = (playerName) => {
    document.querySelector(".quit-link").addEventListener("click", () => {
      displayController.hide("all");
      displayController.clearGameBoard();
      gameBoard.clearArray();
      displayController.clearMessageBoard();
      playerController.resetPlayers();

      displayController.showNamePrompt("Player 1, enter your name:");
    });
    document.querySelector(".restart-link").addEventListener("click", () => {
      displayController.hide("all");
      displayController.clearGameBoard();
      gameBoard.clearArray();
      displayController.show(displayController.elements.gameGrid);
      displayController.clearMessageBoard();
      displayController.show(displayController.elements.messageBoard);
      displayController.displayMessage(
        displayController.elements.messageBoard,
        playerName + " 's turn"
      );
    });
  };

  const displayMessageWinner = (winner) => {
    show(elements.messageBoard);
    displayMessage(elements.messageBoard, winner + " wins!");
  };

  return {
    hide,
    show,
    turnOnFormEvents,
    elements,
    drawMark,
    displayMessage,
    cleardisplayMessage,
    clearGameBoard,
    fadeOut,
    clearMessageBoard,
    showNamePrompt,
    resetForm,
    showGameGrid,
    showMessageDisplay,
    showQuitMessage,
    displayMessageWinner,
    turnOnEndEvents,
  };
})();

const playerController = (() => {
  const allPlayers = [];
  const getPlayers = () => {
    return allPlayers;
  };

  const makePlayer = (playerName) => {
    const tokens = ["X", "O"];
    const player = {};
    player.name = playerName;
    player.token = tokens[allPlayers.length];
    player.number = allPlayers.length + 1;

    allPlayers.push(player);
    return player;
  };

  const resetPlayers = () => {
    allPlayers.length = 0;
  };

  return {
    makePlayer,
    getPlayers,
    resetPlayers,
  };
})();

const gameController = (() => {
  const gameControllerState = {
    currentPlayer: "",
    playerOne: "",
    playerTwo: "",
  };

  const _getColRowPos = (gridNode) => {
    const col = gridNode.getAttribute("data-pos").split(",")[0];
    const row = gridNode.getAttribute("data-pos").split(",")[1];

    return { col, row };
  };

  const _makeCellObj = (clickedCell) => {
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

  const _switchTurns = () => {
    if (gameControllerState.currentPlayer.number === 1) {
      gameControllerState.currentPlayer = gameControllerState.playerTwo;
    } else {
      gameControllerState.currentPlayer = gameControllerState.playerOne;
    }

    displayController.displayMessage(
      displayController.elements.messageBoard,
      gameControllerState.currentPlayer.name + "'s turn"
    );
  };

  // Main event processor
  const _main = (clickedGridEl) => {
    const currentPlayersName = gameControllerState.currentPlayer.name;

    const showQuitOrRestart = () => {
      // Wait 1 second and display quit/restart
      setTimeout(() => {
        displayController.showGameGrid(false);
        displayController.showQuitMessage();
        displayController.turnOnEndEvents(currentPlayersName);
      }, 1000);
    };
    // => col, row, token, and player that clicked on grid square
    const cell = _makeCellObj(clickedGridEl);

    if (gameBoard.insert(cell)) {
      displayController.drawMark(cell);

      if (gameBoard.checkForWinner()) {
        displayController.showMessageDisplay();
        displayController.displayMessageWinner(currentPlayersName);
        showQuitOrRestart();
      } else if (gameBoard.checkForTie()) {
        displayController.displayMessage(
          displayController.elements.messageBoard,
          "Cat's Game"
        );
        showQuitOrRestart();
      } else {
        _switchTurns();
      }
    }
  };

  const turnOnGridEvents = () => {
    document.querySelectorAll(".grid-cell").forEach((clickedGridEl) => {
      clickedGridEl.addEventListener("click", () => {
        _main(clickedGridEl);
      });
    });
  };

  const addPlayers = (players) => {
    for (const player of players) {
      if (player.number === 1) {
        gameControllerState.currentPlayer = player;
        gameControllerState.playerOne = player;
      } else if (player.number === 2) {
        gameControllerState.playerTwo = player;
      }
    }
  };

  return {
    turnOnGridEvents,
    addPlayers,
    gameControllerState,
  };
})(playerController, gameBoard, displayController); //End gameController()

const onSubmit = (playerName) => {
  const newPlayer = playerController.makePlayer(playerName);
  displayController.resetForm();

  if (newPlayer.number === 1) {
    displayController.showNamePrompt("Player 2, enter your name:");
  } else if (newPlayer.number === 2) {
    const allPlayers = playerController.getPlayers();
    gameController.addPlayers(allPlayers);

    displayController.showNamePrompt(false);
    displayController.showGameGrid();
    displayController.showMessageDisplay();
    displayController.displayMessage(
      displayController.elements.messageBoard,
      gameController.gameControllerState.currentPlayer.name + " 's turn"
    );
  }
};

// MAIN
gameBoard.clearArray();
displayController.hide("all");
displayController.showNamePrompt("Player 1, enter your name:");

displayController.turnOnFormEvents(onSubmit);
gameController.turnOnGridEvents();
