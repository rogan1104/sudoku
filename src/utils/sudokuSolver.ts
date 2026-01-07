/**
 * Sudoku Solver using Backtracking DFS Algorithm
 * 
 * Time Complexity: O(9^m) where m is the number of empty cells
 * Space Complexity: O(m) for the recursion stack
 * 
 * The backtracking algorithm works by:
 * 1. Finding an empty cell
 * 2. Trying digits 1-9 in that cell
 * 3. Checking if the digit is valid (row, column, 3x3 box)
 * 4. If valid, recursively solve the rest
 * 5. If no solution found, backtrack and try next digit
 */

export type SudokuBoard = number[][];
export type StepCallback = (board: SudokuBoard, row: number, col: number, num: number) => void;

/**
 * Parses a string input into a 9x9 Sudoku board
 * Accepts formats: 81 digits in a row, or multi-line with spaces/dots for empty cells
 */
export function parseBoard(text: string): SudokuBoard {
  // Remove all non-digit characters except 0
  const digits = text.replace(/[^0-9]/g, '');
  
  if (digits.length !== 81) {
    throw new Error('Invalid board format. Expected 81 digits.');
  }

  const board: SudokuBoard = [];
  for (let i = 0; i < 9; i++) {
    board.push([]);
    for (let j = 0; j < 9; j++) {
      board[i].push(parseInt(digits[i * 9 + j]));
    }
  }
  
  return board;
}

/**
 * Checks if placing a number at [row, col] is valid
 */
export function isValid(board: SudokuBoard, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Finds the next empty cell (value 0)
 * Returns [row, col] or null if board is full
 */
export function findEmpty(board: SudokuBoard): [number, number] | null {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null;
}

/**
 * Validates if the current board state is valid (no conflicts)
 */
export function validateBoard(board: SudokuBoard): { valid: boolean; errors: [number, number][] } {
  const errors: [number, number][] = [];

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const num = board[i][j];
      if (num === 0) continue;

      // Temporarily remove the number to check conflicts
      board[i][j] = 0;
      if (!isValid(board, i, j, num)) {
        errors.push([i, j]);
      }
      board[i][j] = num;
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Solves the Sudoku puzzle using backtracking DFS
 * Mutates the board in place
 * @param board - The 9x9 Sudoku board (0 represents empty cells)
 * @param onStep - Optional callback for visualization (called for each attempt)
 * @returns true if solved, false if no solution exists
 */
export function solve(board: SudokuBoard, onStep?: StepCallback): boolean {
  const empty = findEmpty(board);
  
  // Base case: no empty cells, puzzle solved
  if (!empty) {
    return true;
  }

  const [row, col] = empty;

  // Try digits 1-9
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      
      // Call step callback for visualization
      if (onStep) {
        onStep(board, row, col, num);
      }

      // Recursively solve
      if (solve(board, onStep)) {
        return true;
      }

      // Backtrack: undo the choice
      board[row][col] = 0;
      if (onStep) {
        onStep(board, row, col, 0);
      }
    }
  }

  // No valid number found, trigger backtracking
  return false;
}

/**
 * Solves the puzzle with step-by-step visualization
 * Returns an array of steps for animation
 */
export async function solveWithSteps(
  board: SudokuBoard,
  delay: number = 50
): Promise<{ success: boolean; steps: Array<{ board: SudokuBoard; row: number; col: number; num: number }> }> {
  const steps: Array<{ board: SudokuBoard; row: number; col: number; num: number }> = [];
  
  const onStep: StepCallback = (currentBoard, row, col, num) => {
    // Deep copy the board for this step
    const boardCopy = currentBoard.map(row => [...row]);
    steps.push({ board: boardCopy, row, col, num });
  };

  const boardCopy = board.map(row => [...row]);
  const success = solve(boardCopy, onStep);

  return { success, steps };
}

/**
 * Creates an empty Sudoku board
 */
export function createEmptyBoard(): SudokuBoard {
  return Array(9).fill(0).map(() => Array(9).fill(0));
}

/**
 * Deep copies a board
 */
export function copyBoard(board: SudokuBoard): SudokuBoard {
  return board.map(row => [...row]);
}

/**
 * Formats board as a string for export
 */
export function boardToString(board: SudokuBoard): string {
  return board.map(row => row.join('')).join('');
}
