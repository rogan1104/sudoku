/**
 * Sample Sudoku puzzles with varying difficulty levels
 * Format: 0 represents empty cells
 */

export interface SamplePuzzle {
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  board: string;
  description: string;
}

export const samplePuzzles: SamplePuzzle[] = [
  {
    name: "Gentle Start",
    difficulty: "easy",
    description: "A friendly puzzle to get started. Few empty cells, straightforward logic.",
    board: `
530070000
600195000
098000060
800060003
400803001
700020006
060000280
000419005
000080079
    `.trim()
  },
  {
    name: "Classic Challenge",
    difficulty: "medium",
    description: "Requires some strategic thinking and pattern recognition.",
    board: `
003020600
900305001
001806400
008102900
700000008
006708200
002609500
800203009
005010300
    `.trim()
  },
  {
    name: "Expert Enigma",
    difficulty: "hard",
    description: "Only 17 given numbers - the theoretical minimum! Demands advanced techniques.",
    board: `
000000000
000003085
001020000
000507000
004000100
090000000
500000073
002010000
000040009
    `.trim()
  },
  {
    name: "Morning Warm-up",
    difficulty: "easy",
    description: "A quick puzzle perfect for starting your day.",
    board: `
200080300
060070084
030500209
000105408
000000000
402706000
301007040
720040060
004010003
    `.trim()
  },
  {
    name: "Brain Teaser",
    difficulty: "medium",
    description: "Tests your logical deduction and elimination skills.",
    board: `
000260701
680070090
190004500
820100040
004602900
050003028
009300074
040050036
703018000
    `.trim()
  }
];
