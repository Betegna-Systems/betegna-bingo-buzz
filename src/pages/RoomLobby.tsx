import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock } from "lucide-react";
import { gameEngine, RoomId, RoomState } from "@/services/gameEngine";
import ChatBox from "@/components/Game/ChatBox";

const RoomLobby = () => {
  const { roomId } = useParams<{ roomId: RoomId }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomState | undefined>(() => (roomId ? gameEngine.getRoom(roomId) : undefined));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    document.title = `Room Lobby | ${roomId}`;
    const offs = [
      gameEngine.on("roomUpdated", (e: any) => {
        if (e.roomId === roomId) setRoom({ ...e.room });
      }),
      gameEngine.on("gameStarted", (e: any) => {
        if (e.roomId === roomId) navigate(`/game/${roomId}`);
      }),
      gameEngine.on("chat", (e: any) => {
        if (e.roomId === roomId) setRoom(gameEngine.getRoom(roomId));
      })
    ];
    // ensure joined
    gameEngine.joinRoom(roomId);
    return () => { offs.forEach((fn) => fn()); };
  }, [roomId, navigate]);

  if (!room) return null;

  const toggleReady = () => {
    gameEngine.ready(room.id, !isReady);
    setIsReady(!isReady);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="betegna-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Room {room.entryFee} ETB</CardTitle>
                <Badge>{room.status === 'starting' ? 'Starting' : 'Waiting'}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center"><Users className="w-4 h-4 mr-2" /> {room.players.length} players</div>
              <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> Starts in {room.countdown}s</div>
              <div className="flex gap-2">
                <Button onClick={toggleReady} variant={isReady ? 'secondary' : 'default'}>
                  {isReady ? 'Ready ✔' : 'Ready'}
                </Button>
                <Button variant="outline" onClick={() => navigate(`/rooms/${room.id}/select-card`)}>Change Card</Button>
                <Button variant="ghost" onClick={() => navigate('/rooms')}>Leave</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="betegna-card">
            <CardHeader>
              <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {room.players.map((p) => (
                  <div key={p.id} className="border rounded-md p-2 flex items-center justify-between">
                    <span className="truncate">{p.name}</span>
                    <span className="text-muted-foreground text-xs">{p.cardId ? `Card ${p.cardId}` : 'No card'}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="betegna-card">
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <ChatBox
                messages={room.chat}
                onSend={(t) => gameEngine.sendChat(room.id, t)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomLobby;
