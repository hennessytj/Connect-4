// TODO: write detailed documentation for functions which
// use any form of arithmetic to simulate a 2D array


/************************************************************
* Minimax.js
*
* Description: This program contains functions to support
* the minimax algorithm for connect 4.  These functions 
* provide the essential functionality required.  Additionally,
* these functions correspond nicely to AIMA functions to 
* provide some semblance of convention.
**************************************************************/

var COLUMNS = 7;
var ROWS = 6;
var CURRENT_PLAYERS_TURN = 'R';
// Last used to test goal_state
var GAME = [ 'B', 'E', 'E', 'E', 'B', 'B', 'B',
	         'B', 'B', 'B', 'E', 'E', 'E', 'E',
			 'B', 'E', 'E', 'E', 'E', 'E', 'E',
			 'R', 'R', 'E', 'E', 'E', 'E', 'E',
			 'E', 'E', 'B', 'E', 'E', 'E', 'E',
             'E', 'E', 'E', 'B', 'E', 'E', 'E' ];
/*
var GAME = [ 'E', 'E', 'E', 'E', 'E', 'E', 'E',
	         'E', 'E', 'E', 'E', 'E', 'E', 'E',
			 'E', 'E', 'E', 'E', 'E', 'E', 'E',
			 'E', 'E', 'E', 'E', 'E', 'E', 'E',
			 'E', 'E', 'E', 'E', 'E', 'E', 'E',
             'E', 'E', 'E', 'E', 'E', 'E', 'E' ];
*/
			 
var NEXT_ROW_SPACE = [5, 5, 5, 5, 5, 5, 5]; 

// minimax function

/****************** auxiliary functions *****************/
/////////////////////////////////////////////////////////
//------------ goal/terminal_state aux functions ////////
function checkColumns() {
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
			//console.log("Red won, column win!");
			return true;
		}
		else if (blackcnt === 4) {
			//console.log("Black won!, column win!");
			return true;
		}
	}
	return false; // no column winners
}

function checkRows() {
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
					//console.log("Red won, row win!");
					return true;
				}
				else if (blackcnt === 4) {
					//console.log("Black won, row win!");
					return true;
				}
			}
		}
	}
	return false; // no row winners
}

function checkDownwardDiagonals(startPosition) {
	var redcnt = 0, blackcnt = 0;
	var position = startPosition;
	for (var i = 0; i < 4; i++) {
		if (GAME[position] === 'R') redcnt++;
		else if (GAME[position] === 'B') blackcnt++;
		position += 8;
	}
	// Check tallies for winner
	if (redcnt === 4) {
		//console.log("Red won, diagonal win!");
		return true;
	} else if (blackcnt === 4) {
		//console.log("Black won, diagonal win!");
		return true;
	}
	// no downward diagonal winners
	return false;
}

function checkUpwardDiagonals(startPosition) {
	var redcnt = 0, blackcnt = 0;
	var position = startPosition;
	for (var i = 0; i < 4; i++) {
		if (GAME[position] === 'R') redcnt++;
		else if (GAME[position] === 'B') blackcnt++;
		position -= 6;
	}
	// Check tallies for winner
	if (redcnt === 4) {
		//console.log("Red won, diagonal win!");
		return true;
	} else if (blackcnt === 4) {
		//console.log("Black won, diagonal win!");
		return true;
	}
	// no downward diagonal winners
	return false;
}

function checkDiagonals() {
	var start = 0;
	// downward diagonal
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 4; j++) {
			start = i * COLUMNS + j;
			if (checkDownwardDiagonals(start)) return true;
		}
	} 
	// upward diagonal
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 4; j++) {
			start = 21 + i * COLUMNS + j;
			if (checkUpwardDiagonals(start)) return true;
		}
	}
	// no diagonal winners
	return false;
}

function tie() {
	for (var i = 0; i < COLUMNS * ROWS; i++)
		if (GAME[i] === 'E') return false;
	return true;
}
//-------- end of goal/terminal_state aux functions /////

//----------- evaluation aux functions /////////////////
function possColumnWins(board, player) {
	var cells = []; // will contain elements from column
	var playercnt, overallcnt = 0;
	var position = 0;
	for (var i = 0; i < COLUMNS; i++) {
		// fill cells array
		for (var j = 0; j < ROWS; j++) {
			// compute 2D position from 1D array
			position = j * COLUMNS + i;
			cells[j] = board[position];
		}
		// tally column score
		for (var k = 0; k < ROWS; k++) {
			// check each column 4-block
			playercnt = 0;
			for (var z = 0; z < 4; z++) {
				if (cells[k + z] === player ||
				    cells[k + z] === 'E') {
				    	playercnt++;
				    }
			}
			if (playercnt === 4) overallcnt++;
		}
	}
	return overallcnt;
}

function possRowWins(board, player) {
	// 24 different possible row wins
	var playercnt, overallcnt = 0;
	for (var i = 0; i < ROWS; i++) {
		// Row index
		for (var j = 0; j < 4; j++) {
			// Index j controls starting
			// posn for a 4-block of cells
			// Reset counts for next poss
			// 4 in a row win.
			playercnt = 0;
			for (var k = 0; k < 4; k++) {
				// K advances index along a 4 block
				// to look at each contiguous block of
				// 4 within a row.
				var position = i * COLUMNS + j + k;
				// Tally counts
				if (board[position] === player ||
				    board[position] === 'E') playercnt++;
			}
			if (playercnt === 4) overallcnt++;
		}
	}
	return overallcnt;
}

function possDownwardDiagonalWin(board, startPosition, player) {
	var playercnt = 0, count = 0;
	var position = startPosition;
	for (var i = 0; i < 4; i++) {
		if (board[position] === player ||
		    board[position] === 'E') playercnt++;
		position += 8;
	}
	if (playercnt === 4) count = 1;
	return count;
}

function possUpwardDiagonalWin(board, startPosition, player) {
	var playercnt = 0, count = 0;
	var position = startPosition;
	for (var i = 0; i < 4; i++) {
		if (board[position] === player ||
		    board[position] === 'E') playercnt++;
		position -= 6;
	}
	if (playercnt === 4) count = 1;
	return count;
}

function possDiagonalWins(board, player) {
	var count = 0;
	var start = 0;
	// downward diagonal
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 4; j++) {
			start = i * COLUMNS + j;
			count += possDownwardDiagonalWin(board, start, player);
		}
	} 
	// upward diagonal
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 4; j++) {
			start = 21 + i * COLUMNS + j;
			count += possUpwardDiagonalWin(board, start, player);
		}
	}
	return count;
}
//------------ end of evaluation aux functions ////////////

//------------ connect 4 aux game functions ///////////////
function printGame(board) {
	console.log("   0   1   2   3   4   5   6");
	for (var i = 0; i < COLUMNS * ROWS; i++) {
		if (i % COLUMNS === 0) {
			if (i > 0) console.log();
			console.log("-------------------------------");
			process.stdout.write(' | ');
		}
		var ch = board[i];
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

function placePiece(position) {
	var result = GAME.slice();
	result[position] = player();
	return result;
}

function makeNode(position) {
	if (position === null || position === undefined) {
			console.log("Error: cannot make node."); 
			return;
	}
	var state = placePiece(position);
	return newNode = {
			board : state,
			heuristicValue : evaluationFunction(state),
			position  : position
		};
}

function printSuccessors(list) {
	for (var i = 0; i < list.length; i++) {
		printGame(list[i].board);
		console.log("heuristic value = " + list[i].heuristicValue);
		console.log();
	}
	
}
//--------- end of connect 4 aux game functions ///////////
//////////////////////////////////////////////////////////
/***************** end aux functions ********************/

/********************************************************
* Description: Returns the current player whose turn it
* is.
********************************************************/
function player() {
	return CURRENT_PLAYERS_TURN;
}

/********************************************************
* Description: Determines if a given game state contains
* a winner.  Systematically checks columns, rows, and
* diagonals of games looking for 4 pieces legally 
* connected in a winning pattern.
********************************************************/
function goal_state() {
	if (checkColumns()) return true;
	if (checkRows()) return true;
	if (checkDiagonals()) return true;
	return false;
}

/********************************************************
* Description: Determines if a given game state is a
* final game state.  This occurs when there is a tie (no 
* moves remaining) or when a player has won.
********************************************************/
function terminal_state() {
	if (tie()) return true;
	if (goal_state()) return true;
	return false;
}

/********************************************************
* Description: Returns the value corresponding to a 
* given board state.  Positive values indicate better
* states for max, 0 for tie, and negative values are 
* better for min.
********************************************************/
function evaluationFunction(board) {
	var red = 0, black = 0;
	red   += possColumnWins(board, "R");
	black += possColumnWins(board, "B");
	red   += possRowWins(board, "R");
	black += possRowWins(board, "B");
	red   += possDiagonalWins(board, "R");
	black += possDiagonalWins(board, "B");
	return red - black;
}

/********************************************************
* Description: Generates a possible move for each column
* available to current player.
********************************************************/
function successorFunction() {
	var nodes = [];
	var position, row;
	for (var i = 0; i < COLUMNS; i++) {
		row = NEXT_ROW_SPACE[i];
		position = COLUMNS * row + i;
		nodes[i] = makeNode(position);
	}
	return nodes;
}
