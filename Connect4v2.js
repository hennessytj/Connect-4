/*********************************************************************
* Connect is a simulation of two players playing connect 4.  This is
* the initial development stage.  This will provide, a set of 
* features and simple API that can grow to support other features.
*
* This version will utilize a 1D array to assist with developing,
* a successor function which can more easily make use of
* javascript's array map.
* 
* Dependencies: None, just uses node.js and console
*
* Execution: Uses node.js -> .load Connect.js
**********************************************************************/

/*********************** GLOBAL VARIABLES *****************************/
var ROWS = 6;
var COLUMNS = 7;
// 6 rows x 7 columns = 42 spaces; decremented by one for each turn
var TOTAL_MOVES_REMAINING = 42;
// R = Red, B = Black; Red goes first.
var CURRENT_PLAYERS_TURN = 'R';
// Keeps track of the next available position for a disc
// within a given row.  5,4,3,2,1,0 (valid range)
var NEXT_ROW_SPACE = [5, 5, 5, 5, 5, 5, 5]; 
// 1D board representation/abstraction initial configuration
var GAME = [ 'E', 'E', 'E', 'E', 'E', 'E', 'E',
	         'E', 'E', 'E', 'E', 'E', 'E', 'E',
			 'E', 'E', 'E', 'E', 'E', 'E', 'E',
			 'E', 'E', 'E', 'E', 'E', 'E', 'E',
			 'E', 'E', 'E', 'E', 'E', 'E', 'E',
             'E', 'E', 'E', 'E', 'E', 'E', 'E' ];

function printGame() {
	console.log("   0   1   2   3   4   5   6");
	for (var i = 0; i < COLUMNS * ROWS; i++) {
		if (i % COLUMNS === 0) {
			if (i > 0) console.log();
			console.log("-------------------------------");
			process.stdout.write(' | ');
		}
		var ch = GAME[i];
		if (ch === 'E') ch = " ";
		process.stdout.write(ch + ' | ');
	}
	console.log();
	console.log("-------------------------------");
	console.log();
}

function nextPlayersTurn() {
	if (CURRENT_PLAYERS_TURN === 'R') CURRENT_PLAYERS_TURN = 'B';
	else CURRENT_PLAYERS_TURN = 'R';
}

function columnWin() {
	var cellValue, prevValue, redcnt, blackcnt;
	var position = 0;
	for (var i = 0; i < COLUMNS; i++) {
		// Set (or reset) values for column
		redcnt = 0;  
		blackcnt = 0;
		prevValue = 'E';
		for (var j = 0; j < ROWS; j++) {
			// compute 2D position in 1D array
			position = j * COLUMNS + i;
			cellValue = GAME[position];
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
			console.log("Red won, column win!");
			return true;
		}
		else if (blackcnt === 4) {
			console.log("Black won!, column win!");
			return true;
		}
	}
	return false; // no column winners
}

function rowWin() {
	// 24 different possible row wins
	var redcnt, blackcnt;
	for (var i = 0; i < ROWS; i++) {
		// Row index
		for (var j = 0; j < 4; j++) {
			// Index j controls starting
			// posn for a 4-block of cells
			// Reset counts for next poss
			// 4 in a row win.
			redcnt = 0;
			blackcnt = 0;
			for (var k = 0; k < 4; k++) {
				// K advances index along a 4 block
				// to look at each contiguous block of
				// 4 within a row.
				var position = i * COLUMNS + j + k;
				// Tally counts
				if (GAME[position] === 'R') redcnt++;
				else if (GAME[position] === 'B') blackcnt++;
				// Check for winner
				if (redcnt === 4) {
					console.log("Red won, row win!");
					return true;
				}
				else if (blackcnt === 4) {
					console.log("Black won, row win!");
					return true;
				}
			}
		}
	}
	return false; // no row winners
}

function downwardDiagonalWin(startPosition) {
	var redcnt = 0, blackcnt = 0;
	var position = startPosition;
	for (var i = 0; i < 4; i++) {
		if (GAME[position] === 'R') redcnt++;
		else if (GAME[position] === 'B') blackcnt++;
		position += 8;
	}
	// Check tallies for winner
	if (redcnt === 4) {
		console.log("Red won, diagonal win!");
		return true;
	} else if (blackcnt === 4) {
		console.log("Black won, diagonal win!");
		return true;
	}
	// no downward diagonal winners
	return false;
}

function upwardDiagonalWin(startPosition) {
	var redcnt = 0, blackcnt = 0;
	var position = startPosition;
	for (var i = 0; i < 4; i++) {
		if (GAME[position] === 'R') redcnt++;
		else if (GAME[position] === 'B') blackcnt++;
		position -= 6;
	}
	// Check tallies for winner
	if (redcnt === 4) {
		console.log("Red won, diagonal win!");
		return true;
	} else if (blackcnt === 4) {
		console.log("Black won, diagonal win!");
		return true;
	}
	// no downward diagonal winners
	return false;
}

function diagonalWin() {
	var start = 0;
	// downward diagonal
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 4; j++) {
			start = i * COLUMNS + j;
			if (downwardDiagonalWin(start)) return true;
		}
	} 
	// upward diagonal
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 4; j++) {
			start = 21 + i * COLUMNS + j;
			if (upwardDiagonalWin(start)) return true;
		}
	}
	// no diagonal winners
	return false;
}

// aka goal state test
function winner() {
	if (columnWin()) return true;
	if (rowWin()) return true;
	if (diagonalWin()) return true;
	return false;
}

function movesRemaining() {
	return TOTAL_MOVES_REMAINING > 0;
}

function columnIsFull(index) {
	return NEXT_ROW_SPACE[index] <= -1;
}

function simulateChoice() {
	if (!movesRemaining()) return -1;
	var cnt = 0;
	var column = Math.floor(Math.random() * 7);
	while (columnIsFull(column)) {
		// Should never be an infinite loop
		// because we already checked to make
		// sure a move is possible, but it might
		// be the case we need to find a non-full
		// column to make move
		column = Math.floor(Math.random() * 7);
		if (++cnt > 1000) {
			// infinite loop safe guard
			console.log("Error: simulateChoice infinite loop occurred!");
			process.exit(0);
		}
	}
	return column;
}

function whoseTurn() {
	if (CURRENT_PLAYERS_TURN === 'R') return 'Red';
	else return 'Black';
}

function makeMove() {
	printGame();
	console.log(whoseTurn() + "'s turn.");
	var choice = simulateChoice(); // What column to play?
	if (choice === -1) {
		console.log("Tie!");
		process.exit(0);
	}
	var row = NEXT_ROW_SPACE[choice];   // Piece will fall into
								        // this space in row.
	NEXT_ROW_SPACE[choice]--;           // Space is now occupied.
	// Use arithmetic to simulate 2D game representation.
	var position = COLUMNS * row + choice;
	GAME[position] = CURRENT_PLAYERS_TURN; // Marks space
	TOTAL_MOVES_REMAINING--; 	 // 1 less move available now		
	nextPlayersTurn();
	if (winner()) {
		printGame();
		process.exit(0);
	}
}

console.log("Connect 4!");

while (true) {
	makeMove();
}
