const rs = require('readline-sync');
const math = require('mathjs');

function buildGrid(size) {
    let grid = [];
    for (let i = 0; i < size; i++) {
        for (let j = 1; j <= size; j++) {
            grid.push(`${String.fromCharCode(65 + i)}${j}`);
        }
    }
    return grid;
}

class BattleshipGame {
  constructor(size) {
    this.grid = buildGrid(size);
    this.boardSize = size;
    this.ships = [];
    this.guesses = new Set();
  }

  startGame() {
    console.log("Press any key to start the game.");
    rs.keyIn();
    this.placeShips();
    this.gameLoop();
  }

  placeShips() {
    this.placeShip(2); // one two-unit ship
    this.placeShip(3); // first three-unit ship
    this.placeShip(3); // second three-unit ship
    this.placeShip(4); // one four-unit ship
    this.placeShip(5); // one five-unit ship
  }

  placeShip(size) {
    let placed = false;
    while (!placed) {
      let orientation = math.random() < 0.5 ? 'H' : 'V';
      let position = this.getRandomPosition(orientation, size);

      if (this.isPlacementValid(position, orientation, size)) {
        for (let i = 0; i < size; i++) {
          let shipPosition = orientation === 'H' ? 
            String.fromCharCode(position.charCodeAt(0) + i) + position.substring(1) : 
            position.charAt(0) + (parseInt(position.substring(1)) + i);
          this.ships.push(shipPosition);
        }
        placed = true;
      }
    }
  }

  getRandomPosition(orientation, size) {
    let x = math.floor(math.random() * this.boardSize);
    let y = math.floor(math.random() * this.boardSize) + 1;
    if (orientation === 'H') {
      x = math.floor(math.random() * (this.boardSize - size));
    } else {
      y = math.floor(math.random() * (this.boardSize - size)) + 1;
    }
    return `${String.fromCharCode(65 + x)}${y}`;
  }

  isPlacementValid(position, orientation, size) {
    for (let i = 0; i < size; i++) {
      let checkPosition = orientation === 'H' ? 
        String.fromCharCode(position.charCodeAt(0) + i) + position.substring(1) : 
        position.charAt(0) + (parseInt(position.substring(1)) + i);

      if (this.ships.includes(checkPosition)) {
        return false;
      }
    }
    return true;
  }

  gameLoop() {
    while (this.ships.length > 0) {
      let guess;
      let isValidInput = false;

      while (!isValidInput) {
        console.log("Enter a location to strike ie 'A1'");
        guess = rs.question().toUpperCase();

        if (!this.grid.includes(guess)) {
          console.log(guess + " is not a valid location, try again.");
        } else {
          isValidInput = true;
        }
      }

      if (this.guesses.has(guess)) {
        console.log("You have already picked this location. Miss!");
        continue;
      }

      this.guesses.add(guess);

      let index = this.ships.indexOf(guess);
      if (index !== -1) {
        console.log("Hit!");
        this.ships.splice(index, 1);
      } else {
        console.log("You have missed!");
      }

      if (this.ships.length === 0) {
        console.log("You have destroyed all battleships. Congratulations!");
        break;
      }
    }

    if (rs.keyInYNStrict('Would you like to play again?')) {
      this.resetGame();
      this.startGame();
    } else {
      console.log('Thank you for playing, have a great day!');
    }
  }

  resetGame() {
    this.ships = [];
    this.guesses.clear();
  }
}

const game = new BattleshipGame(10);
game.startGame();
