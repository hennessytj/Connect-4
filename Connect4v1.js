/*********************************************************************
* Connect is a simulation of two players playing connect 4.  This is
* the initial development stage.  This will provide, a set of 
* features and simple API that can grow to support other features.
* 
* Dependencies: None, just uses node.js and console
*
* Execution: Uses node.js -> .load Connect.js
**********************************************************************/
var game = [
			['E', 'E', 'E', 'E', 'E', 'E', 'E'],
			['E', 'E', 'E', 'E', 'E', 'E', 'E'],
			['E', 'E', 'E', 'E', 'E', 'E', 'E'],
			['E', 'E', 'E', 'E', 'E', 'E', 'E'],
			['E', 'E', 'E', 'E', 'E', 'E', 'E'],
			['E', 'E', 'E', 'E', 'E', 'E', 'E'],
		   ];
var nextRowMove = [5, 5, 5, 5, 5, 5, 5];
var totalMovesRemaining = 42; // Total possible moves 6 * 7 = 42
var currentPlayersTurn = 'R'; // Red goes first

// printGame
function printGame() {
	console.log("   0   1   2   3   4   5   6");
	for (var i = 0; i < 6; i++) {
		console.log("-------------------------------");
		for (var j = 0; j < 7; j++) {
			var ch = game[i][j];
			if (ch === 'E') ch = " ";
			if (j === 0) process.stdout.write(' | ');
			process.stdout.write(ch + ' | ');
		}
		console.log();
	}
	console.log("-------------------------------");
	console.log();
}

function nextPlayersTurn() {
	if (currentPlayersTurn === 'R') currentPlayersTurn = 'B';
	else currentPlayersTurn = 'R';
}

function columnWin() {
	var cellValue, prevValue, redcnt, blackcnt;

	for (var i = 0; i < 7; i++) {
		// Set (or reset) values for column
		redcnt = 0;  
		blackcnt = 0;
		prevValue = 'E';
		for (var j = 0; j < 6; j++) {
			cellValue = game[j][i]; 
			if (cellValue === 'R') { 
				if (prevValue === 'R' || prevValue === 'E') redcnt++;
				else redcnt--;
			}
			else if (cellValue === 'B') {
				if (prevValue === 'B' || prevValue === 'E') blackcnt++;
				else blackcnt--;
			}
			prevValue = cellValue;
		}
		if (redcnt === 4) {
			console.log("Red won!");
			return true;
		}
		else if (blackcnt === 4) {
			console.log("Black won!");
			return true;
		}
	}
	return false; // No column winners
}

// aka goal state test
function winner() {
	if (columnWin()) return true;
	// TODO: See below
	// check rows
	// check diagonals
	// print who won and return true
	// else just return false
}

function canMakeChoice() {
	// No moves left, either draw or victory
	if (totalMovesRemaining === 0) return true;
	// Moves remaining, no victory, ensure 
	// a column exists which will allow move
	// redudant but what the heck...
	for (var i = 0; i < 7; i++)
		if (nextRowMove[i] >= 0)   return false; 
}

function isColumnFull(index) {
	return nextRowMove[index] === -1;
}

function simulateChoice() {
	if (canMakeChoice()) return -1;
	var column;
	column = Math.floor(Math.random() * 7);
	while (isColumnFull(column)) {
		// Should never be an infinite loop
		// because we already checked to make
		// sure a move is possible, but it might
		// be the case we need to find a non-full
		// column to make move
		column = Math.floor(Math.random() * 7);
	}
	return column;
}

function whoseTurn() {
	if (currentPlayersTurn === 'R') return 'Red';
	else return 'Black';
}

function makeMove() {
	printGame();
	console.log(whoseTurn() + "'s turn.");
	var choice = simulateChoice(); // What column to play?
	if (choice === -1) {
		console.log("Game over.");
		process.exit(0);
	}
	var row = nextRowMove[choice];   // Piece will fall into
									 // this row
	nextRowMove[choice]--;           // Space is now occupied
	game[row][choice] = currentPlayersTurn; // Marks space
	totalMovesRemaining--; 			
	nextPlayersTurn();
	if (winner()) {
		printGame();
		process.exit(0);
	}
}

// isGoalState 4 vertical, horizontal, or diagonal


// TODO: stop work here on this version, switch
// representation of game to 1D array

console.log("Connect 4!");

while (true) {
	makeMove();
}


