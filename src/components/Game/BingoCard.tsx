import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BingoCardProps {
  gameId: string;
  cardNumber: number;
  numbers: number[][];
  markedNumbers: number[];
  status: "waiting" | "playing" | "won" | "lost";
  isInteractive?: boolean;
  onNumberClick?: (number: number) => void;
}

const BingoCard = ({
  gameId,
  cardNumber,
  numbers,
  markedNumbers,
  status,
  isInteractive = false,
  onNumberClick,
}: BingoCardProps) => {
  const [hoveredNumber, setHoveredNumber] = useState<number | null>(null);

  const getStatusBadge = () => {
    switch (status) {
      case "waiting":
        return <Badge variant="outline" className="game-status-waiting">Waiting</Badge>;
      case "playing":
        return <Badge variant="outline" className="game-status-playing">Playing</Badge>;
      case "won":
        return <Badge variant="outline" className="bg-success text-success-foreground border-success">Won!</Badge>;
      case "lost":
        return <Badge variant="outline" className="game-status-finished">Finished</Badge>;
      default:
        return null;
    }
  };

  const handleCellClick = (number: number) => {
    if (isInteractive && status === "playing" && onNumberClick) {
      onNumberClick(number);
    }
  };

  return (
    <div className="betegna-card p-4 space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Card #{cardNumber}</h3>
          <p className="text-sm text-muted-foreground">Game {gameId}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Bingo Grid Header */}
      <div className="grid grid-cols-5 gap-1 mb-2">
        {["B", "I", "N", "G", "O"].map((letter) => (
          <div
            key={letter}
            className="w-12 h-8 flex items-center justify-center text-sm font-bold text-primary bg-primary/10 rounded"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Bingo Grid */}
      <div className="bingo-card">
        {numbers.flat().map((number, index) => {
          const row = Math.floor(index / 5);
          const col = index % 5;
          const isCenter = row === 2 && col === 2;
          const isMarked = markedNumbers.includes(number);
          const isHovered = hoveredNumber === number;

          return (
            <div
              key={`${row}-${col}`}
              className={cn(
                "bingo-cell",
                isCenter && !number && "bingo-cell center",
                isMarked && "marked",
                isInteractive && status === "playing" && "cursor-pointer hover:scale-105",
                isHovered && "ring-2 ring-primary",
                !isInteractive && "cursor-default"
              )}
              onClick={() => number && handleCellClick(number)}
              onMouseEnter={() => setHoveredNumber(number)}
              onMouseLeave={() => setHoveredNumber(null)}
            >
              {isCenter && !number ? "FREE" : number}
            </div>
          );
        })}
      </div>

      {/* Card Status */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {markedNumbers.length} numbers marked
        </p>
        {status === "playing" && isInteractive && (
          <p className="text-xs text-primary mt-1">
            Click numbers as they're called!
          </p>
        )}
      </div>
    </div>
  );
};

export default BingoCard;