import { cn } from "@/lib/utils";

interface SudokuGridProps {
  board: number[][];
  givenCells: boolean[][];
  onCellChange: (row: number, col: number, value: number) => void;
  highlightCell?: { row: number; col: number };
  errorCells?: [number, number][];
  readOnly?: boolean;
}

export const SudokuGrid = ({
  board,
  givenCells,
  onCellChange,
  highlightCell,
  errorCells = [],
  readOnly = false
}: SudokuGridProps) => {
  const handleInput = (row: number, col: number, value: string) => {
    if (givenCells[row][col] || readOnly) return;

    const numValue = value === '' ? 0 : parseInt(value);
    if (numValue >= 0 && numValue <= 9) {
      onCellChange(row, col, numValue);
    }
  };

  const isError = (row: number, col: number) => {
    return errorCells.some(([r, c]) => r === row && c === col);
  };

  const isHighlighted = (row: number, col: number) => {
    return highlightCell?.row === row && highlightCell?.col === col;
  };

  return (
    <div className="inline-block p-2 bg-card rounded-lg shadow-lg">
      <div className="grid grid-cols-9 gap-0">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isRightEdge = (colIndex + 1) % 3 === 0 && colIndex < 8;
            const isBottomEdge = (rowIndex + 1) % 3 === 0 && rowIndex < 8;
            const isGiven = givenCells[rowIndex][colIndex];
            const hasError = isError(rowIndex, colIndex);
            const highlighted = isHighlighted(rowIndex, colIndex);

            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={cell === 0 ? '' : cell}
                onChange={(e) => handleInput(rowIndex, colIndex, e.target.value)}
                readOnly={isGiven || readOnly}
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 text-center text-lg md:text-xl font-semibold",
                  "border border-sudoku-border-thin",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:z-10",
                  isGiven && "bg-sudoku-cell-given text-foreground cursor-not-allowed",
                  !isGiven && cell !== 0 && "bg-sudoku-cell-filled text-primary",
                  !isGiven && cell === 0 && "bg-sudoku-cell hover:bg-muted",
                  hasError && "bg-sudoku-cell-error text-destructive ring-2 ring-destructive",
                  highlighted && "bg-sudoku-cell-solving scale-105 ring-2 ring-accent z-20",
                  isRightEdge && "border-r-2 border-r-sudoku-border-thick",
                  isBottomEdge && "border-b-2 border-b-sudoku-border-thick"
                )}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
