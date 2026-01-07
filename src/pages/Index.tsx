import { useState, useCallback, useEffect } from "react";
import { SudokuGrid } from "@/components/SudokuGrid";
import { ControlPanel } from "@/components/ControlPanel";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { SamplePuzzles } from "@/components/SamplePuzzles";
import {
  createEmptyBoard,
  parseBoard,
  solve,
  copyBoard,
  validateBoard,
  solveWithSteps,
  type SudokuBoard
} from "@/utils/sudokuSolver";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

const Index = () => {
  const [board, setBoard] = useState<SudokuBoard>(createEmptyBoard());
  const [givenCells, setGivenCells] = useState<boolean[][]>(
    Array(9).fill(false).map(() => Array(9).fill(false))
  );
  const [highlightCell, setHighlightCell] = useState<{ row: number; col: number } | undefined>();
  const [errorCells, setErrorCells] = useState<[number, number][]>([]);
  const [isSolving, setIsSolving] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  const handleCellChange = useCallback((row: number, col: number, value: number) => {
    setBoard(prev => {
      const newBoard = copyBoard(prev);
      newBoard[row][col] = value;
      return newBoard;
    });
    setErrorCells([]);
  }, []);

  const handleSolve = useCallback(() => {
    const boardCopy = copyBoard(board);
    const success = solve(boardCopy);

    if (success) {
      setBoard(boardCopy);
      toast({
        title: "Puzzle solved! 🎉",
        description: "The backtracking algorithm found a solution.",
      });
    } else {
      toast({
        title: "No solution exists",
        description: "This puzzle cannot be solved. Check for errors.",
        variant: "destructive"
      });
    }
  }, [board, toast]);

  const handleSolveAnimated = useCallback(async () => {
    setIsSolving(true);
    setIsPaused(false);
    setErrorCells([]);

    const { success, steps } = await solveWithSteps(copyBoard(board), 50);

    if (!success) {
      toast({
        title: "No solution exists",
        description: "This puzzle cannot be solved.",
        variant: "destructive"
      });
      setIsSolving(false);
      return;
    }

    // Animate the steps
    for (let i = 0; i < steps.length; i++) {
      if (isPaused) break;

      const step = steps[i];
      setBoard(step.board);
      setHighlightCell({ row: step.row, col: step.col });

      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, 30));
    }

    setHighlightCell(undefined);
    setIsSolving(false);

    if (!isPaused) {
      toast({
        title: "Puzzle solved! 🎉",
        description: `Completed in ${steps.length} steps using backtracking.`,
      });
    }
  }, [board, toast, isPaused]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
    setIsSolving(false);
  }, []);

  const handleValidate = useCallback(() => {
    const result = validateBoard(board);
    
    if (result.valid) {
      toast({
        title: "Board is valid! ✓",
        description: "No conflicts detected in the current state.",
      });
      setErrorCells([]);
    } else {
      toast({
        title: "Invalid board",
        description: `Found ${result.errors.length} conflicting cell(s).`,
        variant: "destructive"
      });
      setErrorCells(result.errors);
    }
  }, [board, toast]);

  const handleClear = useCallback(() => {
    setBoard(createEmptyBoard());
    setGivenCells(Array(9).fill(false).map(() => Array(9).fill(false)));
    setErrorCells([]);
    setHighlightCell(undefined);
  }, []);

  const handleLoadPuzzle = useCallback((puzzleString: string) => {
    try {
      const newBoard = parseBoard(puzzleString);
      setBoard(newBoard);
      
      // Mark given cells
      const newGivenCells = newBoard.map(row => row.map(cell => cell !== 0));
      setGivenCells(newGivenCells);
      setErrorCells([]);
      
      toast({
        title: "Puzzle loaded",
        description: "Ready to solve! Watch the backtracking algorithm in action.",
      });
    } catch (error) {
      toast({
        title: "Invalid format",
        description: "Please enter 81 digits (use 0 for empty cells).",
        variant: "destructive"
      });
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sudoku Backtracking Solver
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch the backtracking DFS algorithm solve puzzles step-by-step. 
            An educational exploration of constraint satisfaction and recursive problem solving.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Grid and Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Puzzle Grid</CardTitle>
                <CardDescription>
                  Click cells to enter numbers, or load a sample puzzle below
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                <SudokuGrid
                  board={board}
                  givenCells={givenCells}
                  onCellChange={handleCellChange}
                  highlightCell={highlightCell}
                  errorCells={errorCells}
                  readOnly={isSolving}
                />

                <ControlPanel
                  onSolve={handleSolve}
                  onSolveAnimated={handleSolveAnimated}
                  onValidate={handleValidate}
                  onClear={handleClear}
                  onPause={handlePause}
                  isSolving={isSolving}
                  isPaused={isPaused}
                />
              </CardContent>
            </Card>

            <SamplePuzzles onSelectPuzzle={handleLoadPuzzle} />

            <Card>
              <CardHeader>
                <CardTitle>Import Puzzle</CardTitle>
                <CardDescription>
                  Paste 81 digits (use 0 or . for empty cells)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="import">Puzzle String</Label>
                  <Textarea
                    id="import"
                    placeholder="530070000600195000098000060..."
                    className="font-mono text-sm"
                    rows={4}
                    onChange={(e) => {
                      if (e.target.value.replace(/[^0-9.]/g, '').length === 81) {
                        handleLoadPuzzle(e.target.value);
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Explanation */}
          <div>
            <ExplanationPanel />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Built with TypeScript, React, and backtracking DFS algorithm.
            Try different puzzles to see how the algorithm explores the solution space!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
