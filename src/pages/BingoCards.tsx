import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BingoCard from "@/components/Game/BingoCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Trophy, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserCard {
  id: string;
  gameId: string;
  gameName: string;
  cardNumber: number;
  numbers: number[][];
  markedNumbers: number[];
  status: "waiting" | "playing" | "won" | "lost";
  entryFee: number;
  potentialWin: number;
  joinedAt: string;
  gameStart?: string;
}

const BingoCards = () => {
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userBalance = parseInt(localStorage.getItem("userBalance") || "0");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Generate sample bingo cards
    const generateBingoNumbers = (): number[][] => {
      const ranges = [
        [1, 15],   // B
        [16, 30],  // I
        [31, 45],  // N
        [46, 60],  // G
        [61, 75],  // O
      ];

      const grid: number[][] = [];
      for (let row = 0; row < 5; row++) {
        const rowNumbers: number[] = [];
        for (let col = 0; col < 5; col++) {
          if (row === 2 && col === 2) {
            rowNumbers.push(0); // FREE space
          } else {
            const [min, max] = ranges[col];
            let num;
            do {
              num = Math.floor(Math.random() * (max - min + 1)) + min;
            } while (rowNumbers.includes(num));
            rowNumbers.push(num);
          }
        }
        grid.push(rowNumbers);
      }
      return grid;
    };

    const mockCards: UserCard[] = [
      {
        id: "UC001",
        gameId: "BG001",
        gameName: "Evening Jackpot",
        cardNumber: 1,
        numbers: generateBingoNumbers(),
        markedNumbers: [5, 17, 32, 47, 63],
        status: "playing",
        entryFee: 25,
        potentialWin: 2500,
        joinedAt: "2024-01-20 19:45",
        gameStart: "2024-01-20 20:00",
      },
      {
        id: "UC002",
        gameId: "BG002",
        gameName: "Quick Play",
        cardNumber: 1,
        numbers: generateBingoNumbers(),
        markedNumbers: [3, 19, 34, 52, 68, 12, 27],
        status: "playing",
        entryFee: 10,
        potentialWin: 500,
        joinedAt: "2024-01-20 19:25",
        gameStart: "2024-01-20 19:30",
      },
      {
        id: "UC003",
        gameId: "BG003",
        gameName: "Weekend Special",
        cardNumber: 1,
        numbers: generateBingoNumbers(),
        markedNumbers: [],
        status: "waiting",
        entryFee: 50,
        potentialWin: 10000,
        joinedAt: "2024-01-20 18:30",
        gameStart: "2024-01-21 19:00",
      },
      {
        id: "UC004",
        gameId: "BG005",
        gameName: "Daily Regular",
        cardNumber: 1,
        numbers: generateBingoNumbers(),
        markedNumbers: [7, 22, 36, 51, 64, 14, 28, 43, 59, 71],
        status: "lost",
        entryFee: 15,
        potentialWin: 750,
        joinedAt: "2024-01-20 17:45",
      },
      {
        id: "UC005",
        gameId: "BG004",
        gameName: "Morning Win",
        cardNumber: 2,
        numbers: generateBingoNumbers(),
        markedNumbers: [2, 18, 33, 49, 66, 11, 25, 41, 57, 72, 8, 23, 38, 54, 69],
        status: "won",
        entryFee: 20,
        potentialWin: 800,
        joinedAt: "2024-01-20 09:15",
      },
    ];

    setTimeout(() => {
      setUserCards(mockCards);
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, navigate]);

  const handleNumberClick = (cardId: string, number: number) => {
    setUserCards(prev => prev.map(card => {
      if (card.id === cardId) {
        const isMarked = card.markedNumbers.includes(number);
        const newMarkedNumbers = isMarked 
          ? card.markedNumbers.filter(n => n !== number)
          : [...card.markedNumbers, number];
        
        return { ...card, markedNumbers: newMarkedNumbers };
      }
      return card;
    }));
  };

  const activeCards = userCards.filter(card => card.status === "playing" || card.status === "waiting");
  const completedCards = userCards.filter(card => card.status === "won" || card.status === "lost");

  const stats = {
    totalCards: userCards.length,
    activeGames: activeCards.length,
    totalWins: userCards.filter(card => card.status === "won").length,
    totalSpent: userCards.reduce((sum, card) => sum + card.entryFee, 0),
    potentialWinnings: activeCards.reduce((sum, card) => sum + card.potentialWin, 0),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-muted rounded-lg"></div>
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
            <h1 className="text-3xl font-bold text-foreground">My Bingo Cards</h1>
            <p className="text-muted-foreground">Track your active and completed bingo games</p>
          </div>
          <div className="flex items-center space-x-2 bg-muted px-4 py-2 rounded-full">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="font-semibold">Balance: {userBalance} ETB</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="betegna-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.totalCards}</div>
              <div className="text-sm text-muted-foreground">Total Cards</div>
            </CardContent>
          </Card>
          <Card className="betegna-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.activeGames}</div>
              <div className="text-sm text-muted-foreground">Active Games</div>
            </CardContent>
          </Card>
          <Card className="betegna-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">{stats.totalWins}</div>
              <div className="text-sm text-muted-foreground">Total Wins</div>
            </CardContent>
          </Card>
          <Card className="betegna-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-muted-foreground">{stats.totalSpent}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </CardContent>
          </Card>
          <Card className="betegna-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{stats.potentialWinnings}</div>
              <div className="text-sm text-muted-foreground">Potential Win</div>
            </CardContent>
          </Card>
        </div>

        {/* Cards Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="active">Active Games ({activeCards.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedCards.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCards.map((card) => (
                  <div key={card.id} className="space-y-4">
                    <BingoCard
                      gameId={card.gameId}
                      cardNumber={card.cardNumber}
                      numbers={card.numbers}
                      markedNumbers={card.markedNumbers}
                      status={card.status}
                      isInteractive={card.status === "playing"}
                      onNumberClick={(number) => handleNumberClick(card.id, number)}
                    />
                    
                    {/* Game Info */}
                    <Card className="betegna-card">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Entry Fee:</span>
                            <span className="font-semibold">{card.entryFee} ETB</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Potential Win:</span>
                            <span className="font-semibold text-primary">{card.potentialWin} ETB</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Joined:</span>
                            <span className="text-sm">{new Date(card.joinedAt).toLocaleString()}</span>
                          </div>
                          {card.gameStart && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Game Start:</span>
                              <span className="text-sm">{new Date(card.gameStart).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Active Games</h3>
                <p className="text-muted-foreground mb-4">You don't have any active bingo cards</p>
                <Button onClick={() => navigate("/lobby")} className="betegna-gradient-primary">
                  Join a Game
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCards.map((card) => (
                  <div key={card.id} className="space-y-4">
                    <BingoCard
                      gameId={card.gameId}
                      cardNumber={card.cardNumber}
                      numbers={card.numbers}
                      markedNumbers={card.markedNumbers}
                      status={card.status}
                      isInteractive={false}
                    />
                    
                    {/* Game Result */}
                    <Card className="betegna-card">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Entry Fee:</span>
                            <span className="font-semibold">{card.entryFee} ETB</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Result:</span>
                            <Badge variant="outline" className={
                              card.status === "won" 
                                ? "bg-success text-success-foreground border-success"
                                : "game-status-finished"
                            }>
                              {card.status === "won" ? `Won ${card.potentialWin} ETB` : "Lost"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Played:</span>
                            <span className="text-sm">{new Date(card.joinedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Completed Games</h3>
                <p className="text-muted-foreground">Your completed games will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BingoCards;