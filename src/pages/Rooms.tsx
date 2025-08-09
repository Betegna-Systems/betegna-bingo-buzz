import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Trophy } from "lucide-react";
import { gameEngine, RoomState } from "@/services/gameEngine";
import { useToast } from "@/hooks/use-toast";

const Rooms = () => {
  const [rooms, setRooms] = useState<RoomState[]>(gameEngine.getRooms());
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Rooms | Betegna Bingo";
    const off = [
      gameEngine.on("roomUpdated", () => setRooms(gameEngine.getRooms())),
    ];
    return () => { off.forEach((fn) => fn()); };
  }, []);

  const join = (roomId: RoomState["id"]) => {
    const ok = gameEngine.joinRoom(roomId);
    if (ok) {
      toast({ title: "Joined Room", description: `Entry fee: ${rooms.find(r=>r.id===roomId)?.entryFee} ETB` });
      navigate(`/rooms/${roomId}/select-card`);
    }
  };

  const statusBadge = (status: RoomState["status"]) => {
    switch (status) {
      case "waiting":
        return <Badge variant="outline">Waiting</Badge>;
      case "starting":
        return <Badge className="animate-pulse">Starting</Badge>;
      case "playing":
        return <Badge>Live</Badge>;
      case "ended":
        return <Badge variant="secondary">Ended</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Choose a Room</h1>
        <p className="text-muted-foreground">Entry fees and prize pools vary by room.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="betegna-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{room.entryFee} ETB</CardTitle>
                {statusBadge(room.status)}
              </div>
              <CardDescription>Min {room.minPlayers} • Max {room.maxPlayers}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                {room.players.length} players
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                Starts in {room.countdown}s
              </div>
              <div className="flex items-center text-sm">
                <Trophy className="w-4 h-4 mr-2 text-muted-foreground" />
                Prize ~ {Math.round(room.prizePoolEstimate)} ETB
              </div>
              <Button className="w-full betegna-gradient-primary" onClick={() => join(room.id)}>Join</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
