import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, TrendingUp } from "lucide-react";

export const ExplanationPanel = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <CardTitle>How Backtracking Works</CardTitle>
          </div>
          <CardDescription>
            Understanding the DFS algorithm behind Sudoku solving
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">1</span>
              Find Empty Cell
            </h4>
            <p className="text-sm text-muted-foreground pl-8">
              Scan the grid to find the next empty cell (represented by 0).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">2</span>
              Try Digits 1-9
            </h4>
            <p className="text-sm text-muted-foreground pl-8">
              For each digit, check if it's valid in that position (no conflicts in row, column, or 3×3 box).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">3</span>
              Recurse Forward
            </h4>
            <p className="text-sm text-muted-foreground pl-8">
              If valid, place the digit and recursively solve the rest of the puzzle.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs">4</span>
              Backtrack if Needed
            </h4>
            <p className="text-sm text-muted-foreground pl-8">
              If no solution is found, undo the last choice and try the next digit. This is the "backtracking" step!
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <CardTitle>Complexity Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Badge variant="outline" className="mb-2">Time Complexity</Badge>
            <p className="text-sm text-muted-foreground">
              <strong>O(9^m)</strong> where m is the number of empty cells. In the worst case, we try 9 digits for each empty cell.
            </p>
          </div>
          <div>
            <Badge variant="outline" className="mb-2">Space Complexity</Badge>
            <p className="text-sm text-muted-foreground">
              <strong>O(m)</strong> for the recursion call stack, where m is the depth of recursion (number of empty cells).
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            <CardTitle>Why It Works</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Backtracking is a brute-force algorithmic technique that systematically searches for a solution by building candidates incrementally and abandoning candidates ("backtracking") as soon as it determines they cannot lead to a valid solution. It's guaranteed to find a solution if one exists, making it perfect for constraint-satisfaction problems like Sudoku!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
