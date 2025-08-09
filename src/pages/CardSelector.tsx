import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BingoCard from "@/components/Game/BingoCard";
import { generateBingoCard } from "@/lib/bingo";
import { gameEngine } from "@/services/gameEngine";

const CardSelector = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const grid = useMemo(() => (selected ? generateBingoCard(selected) : null), [selected]);

  useEffect(() => {
    document.title = "Select Card | Betegna Bingo";
  }, []);

  const confirm = () => {
    if (!roomId || !selected) return;
    gameEngine.selectCard(roomId as any, selected);
    navigate(`/rooms/${roomId}/lobby`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold">Select Your Card</h1>
        <p className="text-muted-foreground">Pick a number 1–100. Each number maps to a unique card.</p>
      </header>

      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setSelected(n)}
            className="h-10 rounded-md border text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {n}
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Card #{selected}</DialogTitle>
          </DialogHeader>
          {grid && (
            <div className="flex justify-center">
              <BingoCard
                gameId={String(roomId)}
                cardNumber={selected!}
                numbers={grid}
                markedNumbers={[]}
                status="waiting"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button className="betegna-gradient-primary" onClick={confirm}>Use this card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardSelector;
