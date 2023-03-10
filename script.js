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
  document.querySelectorAll("token").forEach((token) => {});
  const elements = {
    playAgain: document.querySelector(".play-again-display"),
    playerNamePrompt: document.querySelector("[for=fname]"),
    gameGrid: document.querySelector(".game-grid"),
    messageBoard: document.querySelector(".message-board"),
    playerNameForm: document.getElementById("form"),
    playMoreLink: document.querySelector(".play-link"),
    quitLink: document.querySelector(".restart-link"),
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
    let playerName;

    elements.playerNameForm.addEventListener("submit", () => {
      const formData = new FormData(form);
      for (const [key, value] of formData) {
        playerName = value;
      }
      _resetForm();
      callBack(playerName);
    });
  };

  const _resetForm = () => {
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

  const print = (el, mesg) => {
    // show element
    // Print message to screen
    el.textContent = mesg;
  };

  const clearPrint = () => {
    elements.messageBoard.classList.remove("fade-in");
  };

  const clearBoard = () => {
    elements.gameGrid.classList.add("fade-out");
    document.querySelectorAll(".grid-cell").forEach((cell) => {
      cell.textContent = "";
    });
  };

  const fadeOut = (el) => {
    el.classList.add("fade-out");
    el.style.display = "none";
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
    fadeOut,
  };
})();

const playerController = (() => {
  const allPlayers = [];
  const getPlayers = () => {
    return allPlayers;
  };

  const addPlayer = (playerName) => {
    const tokens = ["X", "O"];
    const player = {};
    player.name = playerName;
    player.token = tokens[allPlayers.length];
    player.number = allPlayers.length + 1;

    allPlayers.push(player);
    return player;
  };

  return {
    addPlayer,
    getPlayers,
  };
})();

const gameController = (() => {
  const gameControllerState = {
    currentPlayer: "",
    playerOne: "",
    playerTwo: "",
    playAgain: false,
    stillPlaying: true,

    lastMarkedCell: "",
    win: false,
    tie: false,
    };

    const resetGameState = () => {
      gameControllerState.currentPlayer = "";
      gameControllerState.playerOne = "";
      gameControllerState.playerTwo = "";
      gameControllerState.lastMarkedCell = "";
  }; // Start gameController()

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

    displayController.print(
      displayController.elements.messageBoard,
      gameControllerState.currentPlayer.name + "'s turn"
    );
  };
  // Main event processor
  const _main = (clickedGridEl) => {
    const cell = _makeCellObj(clickedGridEl);
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

        // Display winner to screen
        displayController.show(displayController.elements.messageBoard);
        displayController.print(
          displayController.elements.messageBoard,
          winnerName + " wins!"
        );

        // Show 'play or quit' prompt again after 3 seconds
        setTimeout(() => {
          displayController.clearBoard();
          displayController.show(displayController.elements.playAgain);
          displayController.show(displayController.elements.quitLink);
          displayController.show(displayController.elements.playMoreLink);

          document
            .querySelector(".restart-link")
            .addEventListener("click", () => {});
            // If user presses play again restart the game
          document.querySelector(".play-link").addEventListener("click", () => {
            displayController.fadeOut(displayController.elements.playAgain);
            displayController.hide("all");
            gameBoard.clearArray();
            resetGameState();
            getNames();
          });
        }, 1000);
      } else if (gameBoard.checkForTie()) {
        gameControllerState.tie = true;
        displayController.print(
          displayController.elements.messageBoard,
          "Cat's Game"
        );
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

  const getNames = () => {
    let nameEntries = 2;

    const callBack = (playerName) => {
      playerController.addPlayer(playerName);

      displayController.print(
        displayController.elements.playerNamePrompt,
        "Player 2 enter your name: "
      );

      displayController.getFormData(callBack);
      nameEntries--;

      // Once names are entered, and both players, and display grid
      // add separate functions here later
      if (nameEntries === 0) {
        const players = playerController.getPlayers();
        gameControllerState.playerOne = players[0];
        gameControllerState.playerTwo = players[1];

        gameControllerState.currentPlayer = players[0];

        displayController.hide(displayController.elements.playerNameForm);
        displayController.hide(displayController.elements.playerNamePrompt);

        displayController.show(displayController.elements.gameGrid);
        displayController.show(displayController.elements.messageBoard);
        displayController.print(
          displayController.elements.messageBoard,
          gameControllerState.currentPlayer.name + "'s turn"
        );
      }
    }; // End callback

    displayController.show(displayController.elements.playerNamePrompt);
    displayController.show(displayController.elements.playerNameForm);
    displayController.print(
      displayController.elements.playerNamePrompt,
      "Player 1 " + " enter your name:"
    );
    displayController.getFormData(callBack);
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
    getNames,
    turnOnGridEvents,
  };
})(playerController, gameBoard, displayController); //End gameController()

// MAIN
gameBoard.clearArray();
displayController.hide("all");
gameController.getNames();
gameController.turnOnGridEvents();
