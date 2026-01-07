import { Button } from "@/components/ui/button";
import { Play, RotateCcw, CheckCircle, Zap, Pause } from "lucide-react";

interface ControlPanelProps {
  onSolve: () => void;
  onSolveAnimated: () => void;
  onValidate: () => void;
  onClear: () => void;
  onPause?: () => void;
  isSolving: boolean;
  isPaused?: boolean;
}

export const ControlPanel = ({
  onSolve,
  onSolveAnimated,
  onValidate,
  onClear,
  onPause,
  isSolving,
  isPaused = false
}: ControlPanelProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={onSolveAnimated}
        disabled={isSolving && !isPaused}
        size="lg"
        className="flex items-center gap-2"
      >
        <Play className="w-4 h-4" />
        Animate Solve
      </Button>

      <Button
        onClick={onSolve}
        disabled={isSolving}
        variant="secondary"
        size="lg"
        className="flex items-center gap-2"
      >
        <Zap className="w-4 h-4" />
        Instant Solve
      </Button>

      {isSolving && !isPaused && onPause && (
        <Button
          onClick={onPause}
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <Pause className="w-4 h-4" />
          Pause
        </Button>
      )}

      <Button
        onClick={onValidate}
        disabled={isSolving}
        variant="outline"
        size="lg"
        className="flex items-center gap-2"
      >
        <CheckCircle className="w-4 h-4" />
        Validate
      </Button>

      <Button
        onClick={onClear}
        disabled={isSolving}
        variant="outline"
        size="lg"
        className="flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Clear
      </Button>
    </div>
  );
};
