import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Clock, Trophy, Search, Filter, Play, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Game {
  id: string;
  name: string;
  status: "waiting" | "playing" | "finished";
  players: number;
  maxPlayers: number;
  entryFee: number;
  prizePool: number;
  startTime: string;
  endTime?: string;
  description: string;
  gameType: "quick" | "regular" | "premium";
}

const GameLobby = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userBalance = parseInt(localStorage.getItem("userBalance") || "0");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Simulate loading games
    const mockGames: Game[] = [
      {
        id: "BG001",
        name: "Evening Jackpot",
        status: "waiting",
        players: 45,
        maxPlayers: 100,
        entryFee: 25,
        prizePool: 2500,
        startTime: "2024-01-20 20:00",
        description: "Big prize pool evening game",
        gameType: "premium",
      },
      {
        id: "BG002",
        name: "Quick Play",
        status: "playing",
        players: 23,
        maxPlayers: 50,
        entryFee: 10,
        prizePool: 500,
        startTime: "2024-01-20 19:30",
        description: "Fast-paced 15-minute game",
        gameType: "quick",
      },
      {
        id: "BG003",
        name: "Weekend Special",
        status: "waiting",
        players: 78,
        maxPlayers: 200,
        entryFee: 50,
        prizePool: 10000,
        startTime: "2024-01-21 19:00",
        description: "Mega jackpot weekend event",
        gameType: "premium",
      },
      {
        id: "BG004",
        name: "Lunch Break",
        status: "waiting",
        players: 12,
        maxPlayers: 30,
        entryFee: 5,
        prizePool: 150,
        startTime: "2024-01-20 12:30",
        description: "Quick midday game",
        gameType: "quick",
      },
      {
        id: "BG005",
        name: "Daily Regular",
        status: "finished",
        players: 35,
        maxPlayers: 50,
        entryFee: 15,
        prizePool: 750,
        startTime: "2024-01-20 18:00",
        endTime: "2024-01-20 18:45",
        description: "Standard daily bingo game",
        gameType: "regular",
      },
    ];

    setTimeout(() => {
      setGames(mockGames);
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, navigate]);

  const handleJoinGame = (game: Game) => {
    if (userBalance < game.entryFee) {
      toast({
        title: "Insufficient balance",
        description: `You need ${game.entryFee} ETB to join this game. Your balance: ${userBalance} ETB`,
        variant: "destructive",
      });
      return;
    }

    // Update balance
    const newBalance = userBalance - game.entryFee;
    localStorage.setItem("userBalance", newBalance.toString());

    toast({
      title: "Joined game successfully!",
      description: `You've joined ${game.name}. Entry fee: ${game.entryFee} ETB`,
    });

    // Navigate to bingo cards page
    navigate("/cards");
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || game.status === statusFilter;
    
    const matchesPrice = priceFilter === "all" || 
                        (priceFilter === "free" && game.entryFee === 0) ||
                        (priceFilter === "low" && game.entryFee > 0 && game.entryFee <= 10) ||
                        (priceFilter === "medium" && game.entryFee > 10 && game.entryFee <= 30) ||
                        (priceFilter === "high" && game.entryFee > 30);

    return matchesSearch && matchesStatus && matchesPrice;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return <Badge variant="outline" className="game-status-waiting">Waiting</Badge>;
      case "playing":
        return <Badge variant="outline" className="game-status-playing animate-pulse">Live</Badge>;
      case "finished":
        return <Badge variant="outline" className="game-status-finished">Finished</Badge>;
      default:
        return null;
    }
  };

  const getGameTypeIcon = (gameType: string) => {
    switch (gameType) {
      case "quick":
        return <Clock className="w-4 h-4" />;
      case "premium":
        return <Trophy className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Game Lobby</h1>
            <p className="text-muted-foreground">Choose a bingo game to join and start playing</p>
          </div>
          <div className="flex items-center space-x-2 bg-muted px-4 py-2 rounded-full">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="font-semibold">Balance: {userBalance} ETB</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search games by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="playing">Playing</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="low">1-10 ETB</SelectItem>
                <SelectItem value="medium">11-30 ETB</SelectItem>
                <SelectItem value="high">30+ ETB</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <Card key={game.id} className="betegna-card hover:shadow-[var(--shadow-game)] transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getGameTypeIcon(game.gameType)}
                    <CardTitle className="text-lg">{game.name}</CardTitle>
                  </div>
                  {getStatusBadge(game.status)}
                </div>
                <CardDescription>{game.description}</CardDescription>
                <div className="text-xs text-muted-foreground">Game ID: {game.id}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Entry Fee</p>
                    <p className="font-semibold text-lg">{game.entryFee} ETB</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Prize Pool</p>
                    <p className="font-semibold text-lg text-primary">{game.prizePool} ETB</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{game.players}/{game.maxPlayers}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(game.startTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Progress bar for players */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Players</span>
                    <span>{Math.round((game.players / game.maxPlayers) * 100)}% full</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${(game.players / game.maxPlayers) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <Button
                  onClick={() => handleJoinGame(game)}
                  disabled={game.status === "finished" || game.players >= game.maxPlayers || userBalance < game.entryFee}
                  className="w-full betegna-gradient-primary"
                >
                  {game.status === "finished" 
                    ? "Game Finished" 
                    : game.players >= game.maxPlayers 
                    ? "Game Full" 
                    : game.status === "playing"
                    ? "Join Live Game"
                    : `Join Game - ${game.entryFee} ETB`
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold">No games found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameLobby;