const rs = require('readline-sync');
const math = require('mathjs');

const grid = [
    'A1', 'A2', 'A3', 
    'B1', 'B2', 'B3',
    'C1', 'C2', 'C3'
];

class BattleshipGame {
  constructor() {
    this.boardSize = 3;
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
    while (this.ships.length < 2) {
      let position = grid[math.floor(math.random() * grid.length)];

      if (!this.ships.includes(position)) {
        this.ships.push(position);
      }
    }
  }

  gameLoop() {
    while (this.ships.length > 0) {
      let guess;
      let isValidInput = false;
  
      while (!isValidInput) {
        console.log("Enter a location to strike ie 'A2'");
        guess = rs.question().toUpperCase();
  
        if (!grid.includes(guess)) {
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

      if (this.ships.includes(guess)) {
        console.log(`Hit. You have sunk a battleship. ${this.ships.length - 1} ship remaining.`);
        this.ships = this.ships.filter(ship => ship !== guess);
      } else {
        console.log("You have missed!");
      }
    }

   
    if (rs.keyInYNStrict('You have destroyed all battleships. Would you like to play again?')){
        this.resetGame();
        this.startGame();
    } else {
        console.log('Thank you so much for playing, have a great day!');
    }

  }

  resetGame() {
    this.ships = [];
    this.guesses.clear();
  }
}

const game = new BattleshipGame();
game.startGame();