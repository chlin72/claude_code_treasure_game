import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { getScores } from '../lib/auth';

interface ScoreHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string | null;
}

// Dialog displaying a signed-in user's game score history, sorted newest-first.
// Input: open (boolean), onOpenChange (fn), username (string | null). Output: JSX element.
export default function ScoreHistory({ open, onOpenChange, username }: ScoreHistoryProps) {
  const scores = username ? getScores(username) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Score History — {username}</DialogTitle>
          <DialogDescription>
            {scores.length === 0
              ? 'No games recorded yet.'
              : `Your last ${scores.length} game${scores.length === 1 ? '' : 's'}`}
          </DialogDescription>
        </DialogHeader>

        {scores.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-6">
            Finish a game to see your score here!
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-3 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-2xl font-bold text-amber-900">{scores.length}</span>
              <span className="text-xs text-amber-700 mt-1">Games</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-green-50 border border-green-200">
              <span className="text-2xl font-bold text-green-700">
                {scores.filter(r => r.result === 'win').length}
              </span>
              <span className="text-xs text-green-700 mt-1">Wins</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-blue-50 border border-blue-200">
              <span className="text-2xl font-bold text-blue-700">
                ${scores.reduce((sum, r) => sum + r.score, 0)}
              </span>
              <span className="text-xs text-blue-700 mt-1">Total</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
