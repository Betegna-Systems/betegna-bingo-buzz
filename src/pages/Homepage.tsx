import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Trophy, Users, Clock, Star, CheckCircle } from "lucide-react";

const Homepage = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const featuredGames = [
    {
      id: "BG001",
      name: "Evening Jackpot",
      status: "waiting",
      players: 45,
      maxPlayers: 100,
      entryFee: 25,
      prize: 2500,
      startTime: "8:00 PM",
    },
    {
      id: "BG002", 
      name: "Quick Play",
      status: "playing",
      players: 23,
      maxPlayers: 50,
      entryFee: 10,
      prize: 500,
      startTime: "Now",
    },
    {
      id: "BG003",
      name: "Weekend Special",
      status: "waiting",
      players: 78,
      maxPlayers: 200,
      entryFee: 50,
      prize: 10000,
      startTime: "Sat 7:00 PM",
    },
  ];

  const features = [
    {
      icon: <Trophy className="w-8 h-8 text-secondary" />,
      title: "Big Prizes",
      description: "Win up to 10,000 ETB in our daily games",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Community",
      description: "Play with thousands of Ethiopian players",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-success" />,
      title: "Fair Play",
      description: "Transparent and secure gaming platform",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Sign Up",
      description: "Create your free Betegna account",
    },
    {
      step: 2,
      title: "Choose Game",
      description: "Browse available games and entry fees",
    },
    {
      step: 3,
      title: "Get Cards",
      description: "Purchase bingo cards for the game",
    },
    {
      step: 4,
      title: "Play & Win",
      description: "Mark numbers and compete for prizes",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="betegna-hero py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Play Bingo & Win Big!
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Join thousands of Ethiopian players in exciting bingo games. 
              <br className="hidden md:block" />
              <span className="font-semibold">Play. Win. Celebrate!</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link to="/lobby">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4">
                    <Play className="w-5 h-5 mr-2" />
                    Play Now
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4">
                      <Play className="w-5 h-5 mr-2" />
                      Start Playing
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary text-lg px-8 py-4">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Live Games
            </h2>
            <p className="text-lg text-muted-foreground">
              Join these exciting games happening right now
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGames.map((game) => (
              <Card key={game.id} className="betegna-card hover:shadow-[var(--shadow-game)] transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{game.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        game.status === "waiting"
                          ? "game-status-waiting"
                          : game.status === "playing"
                          ? "game-status-playing"
                          : "game-status-finished"
                      }
                    >
                      {game.status === "waiting" ? "Starting Soon" : game.status === "playing" ? "Live" : "Finished"}
                    </Badge>
                  </div>
                  <CardDescription>Game ID: {game.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Entry Fee</p>
                      <p className="font-semibold text-lg">{game.entryFee} ETB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Prize Pool</p>
                      <p className="font-semibold text-lg text-primary">{game.prize} ETB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Players</p>
                      <p className="font-semibold">{game.players}/{game.maxPlayers}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Start Time</p>
                      <p className="font-semibold">{game.startTime}</p>
                    </div>
                  </div>
                  <Link to={isAuthenticated ? "/lobby" : "/register"}>
                    <Button className="w-full betegna-gradient-primary">
                      {game.status === "waiting" ? "Join Game" : "View Game"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Betegna?
            </h2>
            <p className="text-lg text-muted-foreground">
              The premier bingo platform designed for Ethiopian players
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 betegna-gradient-primary">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Start Winning?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of players and start your winning journey today!
            </p>
            {!isAuthenticated && (
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4">
                  <Star className="w-5 h-5 mr-2" />
                  Create Free Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;