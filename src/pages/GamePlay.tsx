import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BingoCard from "@/components/Game/BingoCard";
import { gameEngine, RoomId, RoomState } from "@/services/gameEngine";
import { generateBingoCard, getMarkedFromDrawn } from "@/lib/bingo";
import { useToast } from "@/hooks/use-toast";

const GamePlay = () => {
  const { roomId } = useParams<{ roomId: RoomId }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState<RoomState | undefined>(() => (roomId ? gameEngine.getRoom(roomId) : undefined));
  const [last, setLast] = useState<number | null>(null);

  useEffect(() => {
    if (!roomId) return;
    document.title = `Game | ${roomId}`;
    const offs = [
      gameEngine.on("numberDrawn", (e: any) => { if (e.roomId === roomId) { setLast(e.number); setRoom(gameEngine.getRoom(roomId)); } }),
      gameEngine.on("roomUpdated", (e: any) => { if (e.roomId === roomId) setRoom({ ...e.room }); }),
      gameEngine.on("gameEnded", (e: any) => {
        if (e.roomId === roomId) {
          if (e.winnerId === gameEngine.currentUser.id) {
            toast({ title: "You won!", description: `Pattern: ${e.pattern}` });
          } else {
            toast({ title: "Game ended", description: e.winnerId ? "Another player won" : "No winner" });
          }
          setTimeout(() => navigate(`/rooms/${roomId}/lobby`), 2000);
        }
      })
    ];
    return () => { offs.forEach((fn) => fn()); };
  }, [roomId, navigate, toast]);

  if (!room || !room.game) return (
    <div className="container mx-auto py-8 px-4">
      <p className="text-muted-foreground">Game not started. Returning to lobby...</p>
    </div>
  );

  const me = room.players.find((p) => p.id === gameEngine.currentUser.id);
  const myCardId = me?.cardId || 1;
  const grid = useMemo(() => generateBingoCard(myCardId), [myCardId]);
  const marked = useMemo(() => getMarkedFromDrawn(grid, room.game!.drawnNumbers), [grid, room.game?.drawnNumbers]);

  const claim = () => {
    const res = gameEngine.claimBingo(room.id);
    if (!res.ok) {
      toast({ title: "No bingo yet", description: "Keep playing!", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Caller / History */}
        <Card className="betegna-card order-2 lg:order-1">
          <CardHeader>
            <CardTitle>Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-sm">Last number: <span className="font-semibold text-primary">{last ?? '-'}</span></div>
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 75 }, (_, i) => i + 1).map((n) => {
                const drawn = room.game!.drawnNumbers.includes(n);
                return (
                  <div key={n} className={`h-7 text-xs rounded flex items-center justify-center border ${drawn ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>{n}</div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Card */}
        <Card className="betegna-card order-1 lg:order-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Card #{myCardId}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <BingoCard
              gameId={room.id}
              cardNumber={myCardId}
              numbers={grid}
              markedNumbers={marked}
              status="playing"
            />
          </CardContent>
          <div className="p-4 flex justify-center">
            <Button size="lg" className="betegna-gradient-primary" onClick={claim}>Bingo!</Button>
          </div>
        </Card>

        {/* Players / Pool */}
        <Card className="betegna-card order-3 lg:order-3">
          <CardHeader>
            <CardTitle>Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {room.players.map((p) => (
                <div key={p.id} className="flex items-center justify-between border rounded px-2 py-1">
                  <span className="truncate">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.cardId ? `Card ${p.cardId}` : '-'}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm">Prize Pool ~ <span className="font-semibold">{Math.round(room.prizePoolEstimate)} ETB</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamePlay;
