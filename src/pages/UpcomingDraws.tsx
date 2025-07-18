import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, Trophy, Play, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UpcomingDraws = () => {
  const { toast } = useToast();
  const [isAuthenticated] = useState(() => localStorage.getItem("isAuthenticated") === "true");

  // Mock data for draws
  const upcomingDraws = [
    {
      id: "DRAW001",
      name: "Daily Jackpot",
      date: "2024-01-20",
      time: "18:00",
      status: "Open",
      entryFee: 25,
      jackpot: 15000,
      playersJoined: 247,
      maxPlayers: 500,
      cardsAvailable: 253
    },
    {
      id: "DRAW002", 
      name: "Weekend Special",
      date: "2024-01-21",
      time: "20:00",
      status: "Open",
      entryFee: 50,
      jackpot: 35000,
      playersJoined: 189,
      maxPlayers: 300,
      cardsAvailable: 111
    },
    {
      id: "DRAW003",
      name: "Mega Monday",
      date: "2024-01-22",
      time: "19:30",
      status: "Open",
      entryFee: 100,
      jackpot: 75000,
      playersJoined: 98,
      maxPlayers: 200,
      cardsAvailable: 102
    }
  ];

  const liveDraws = [
    {
      id: "LIVE001",
      name: "Flash Round",
      status: "In Progress",
      entryFee: 15,
      jackpot: 8500,
      playersJoined: 156,
      nextNumber: 42,
      numbersLeft: 23
    }
  ];

  const completedDraws = [
    {
      id: "COMP001",
      name: "Morning Special",
      date: "2024-01-19",
      time: "10:00",
      status: "Completed",
      winner: "Player123",
      finalJackpot: 12500,
      totalPlayers: 198
    },
    {
      id: "COMP002",
      name: "Evening Draw",
      date: "2024-01-18",
      time: "20:00", 
      status: "Completed",
      winner: "WinnerABC",
      finalJackpot: 28000,
      totalPlayers: 245
    }
  ];

  const handleJoinGame = (drawId: string, entryFee: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to join games.",
        variant: "destructive"
      });
      return;
    }

    const currentBalance = parseInt(localStorage.getItem("userBalance") || "0");
    if (currentBalance < entryFee) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${entryFee} ETB to join this game.`,
        variant: "destructive"
      });
      return;
    }

    // Deduct entry fee and redirect to cards
    localStorage.setItem("userBalance", (currentBalance - entryFee).toString());
    toast({
      title: "Game Joined!",
      description: `Successfully joined ${drawId}. Good luck!`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge className="bg-green-500 hover:bg-green-600">Open</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-500 hover:bg-blue-600 animate-pulse">Live</Badge>;
      case "Completed":
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Bingo <span className="text-primary">Draws</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Join live games, check upcoming draws, and view results
          </p>
        </div>

        {/* Tabs for different draw categories */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upcoming">Upcoming Draws</TabsTrigger>
            <TabsTrigger value="live">Live Games</TabsTrigger>
            <TabsTrigger value="completed">Results</TabsTrigger>
          </TabsList>

          {/* Upcoming Draws */}
          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingDraws.map((draw) => (
                <Card key={draw.id} className="betegna-card">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{draw.name}</CardTitle>
                      {getStatusBadge(draw.status)}
                    </div>
                    <CardDescription>Game ID: {draw.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {draw.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        {draw.time}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                        {draw.playersJoined}/{draw.maxPlayers}
                      </div>
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-2 text-muted-foreground" />
                        {draw.jackpot.toLocaleString()} ETB
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-muted-foreground">Entry Fee</span>
                        <span className="font-semibold">{draw.entryFee} ETB</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-muted-foreground">Cards Available</span>
                        <span className="font-semibold text-primary">{draw.cardsAvailable}</span>
                      </div>
                      
                      <Button 
                        className="w-full betegna-gradient-primary"
                        onClick={() => handleJoinGame(draw.id, draw.entryFee)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Join Game
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live Games */}
          <TabsContent value="live" className="space-y-6">
            {liveDraws.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveDraws.map((draw) => (
                  <Card key={draw.id} className="betegna-card border-primary/50">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg">{draw.name}</CardTitle>
                        {getStatusBadge(draw.status)}
                      </div>
                      <CardDescription>Game ID: {draw.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                          {draw.playersJoined} Players
                        </div>
                        <div className="flex items-center">
                          <Trophy className="w-4 h-4 mr-2 text-muted-foreground" />
                          {draw.jackpot.toLocaleString()} ETB
                        </div>
                      </div>

                      <div className="bg-primary/10 p-4 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary mb-1">
                            {draw.nextNumber}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Next Number • {draw.numbersLeft} left
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Watch Live
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Live Games</h3>
                <p className="text-muted-foreground">Check back soon for live bingo action!</p>
              </div>
            )}
          </TabsContent>

          {/* Completed Draws */}
          <TabsContent value="completed" className="space-y-6">
            <div className="space-y-4">
              {completedDraws.map((draw) => (
                <Card key={draw.id} className="betegna-card">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{draw.name}</h3>
                          {getStatusBadge(draw.status)}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {draw.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {draw.time}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {draw.totalPlayers} Players
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:text-right">
                        <div className="text-lg font-bold text-primary">
                          {draw.finalJackpot.toLocaleString()} ETB
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Winner: {draw.winner}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="mt-12 text-center">
            <Card className="betegna-card max-w-lg mx-auto">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Ready to Join the Action?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create your account and start playing today!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="betegna-gradient-primary">
                    <Link to="/register">Create Account</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingDraws;