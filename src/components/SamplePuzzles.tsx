import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { samplePuzzles } from "@/utils/samplePuzzles";
import { Sparkles } from "lucide-react";

interface SamplePuzzlesProps {
  onSelectPuzzle: (board: string) => void;
}

export const SamplePuzzles = ({ onSelectPuzzle }: SamplePuzzlesProps) => {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    hard: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <CardTitle>Sample Puzzles</CardTitle>
        </div>
        <CardDescription>
          Try these curated puzzles to see the solver in action
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {samplePuzzles.map((puzzle, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{puzzle.name}</h4>
                  <Badge
                    variant="outline"
                    className={difficultyColors[puzzle.difficulty]}
                  >
                    {puzzle.difficulty}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{puzzle.description}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectPuzzle(puzzle.board)}
                className="ml-4"
              >
                Load
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
