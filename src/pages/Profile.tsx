import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, Wallet, Trophy, History, Edit3, LogOut, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userBalance = parseInt(localStorage.getItem("userBalance") || "0");
  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || "John Doe";

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: userName.split(" ")[0] || "John",
    lastName: userName.split(" ")[1] || "Doe",
    email: userEmail,
    phone: "+251 911 234 567",
  });

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const gameStats = {
    totalGames: 15,
    gamesWon: 4,
    totalSpent: 285,
    totalWinnings: 1250,
    currentStreak: 2,
    bestStreak: 5,
  };

  const recentTransactions = [
    { id: 1, type: "win", amount: 500, game: "Quick Play", date: "2024-01-20" },
    { id: 2, type: "entry", amount: -25, game: "Evening Jackpot", date: "2024-01-20" },
    { id: 3, type: "win", amount: 750, game: "Daily Regular", date: "2024-01-19" },
    { id: 4, type: "entry", amount: -15, game: "Daily Regular", date: "2024-01-19" },
    { id: 5, type: "entry", amount: -10, game: "Quick Play", date: "2024-01-19" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userBalance");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of Betegna.",
    });
    
    navigate("/");
  };

  const handleProfileUpdate = () => {
    // In a real app, this would make an API call
    localStorage.setItem("userName", `${profileData.firstName} ${profileData.lastName}`);
    localStorage.setItem("userEmail", profileData.email);
    
    setIsEditingProfile(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const winRate = gameStats.totalGames > 0 ? (gameStats.gamesWon / gameStats.totalGames * 100).toFixed(1) : 0;
  const netProfit = gameStats.totalWinnings - gameStats.totalSpent;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and view your gaming statistics</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="self-start md:self-center">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Card */}
            <Card className="betegna-card">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{userName}</CardTitle>
                    <CardDescription>{userEmail}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member since</span>
                  <span className="text-sm font-medium">January 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className="bg-success text-success-foreground border-success">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Wallet */}
            <Card className="betegna-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Wallet</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Balance</span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {showBalance ? `${userBalance} ETB` : "••••"}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Available to play</p>
                </div>
                <Button className="w-full betegna-gradient-primary">
                  Add Funds
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Game Statistics */}
                <Card className="betegna-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5" />
                      <span>Gaming Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{gameStats.totalGames}</div>
                        <div className="text-sm text-muted-foreground">Total Games</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">{gameStats.gamesWon}</div>
                        <div className="text-sm text-muted-foreground">Games Won</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{winRate}%</div>
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-muted-foreground">{gameStats.totalSpent}</div>
                        <div className="text-sm text-muted-foreground">Total Spent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">{gameStats.totalWinnings}</div>
                        <div className="text-sm text-muted-foreground">Total Winnings</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {netProfit >= 0 ? '+' : ''}{netProfit}
                        </div>
                        <div className="text-sm text-muted-foreground">Net Profit</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievement Badges */}
                <Card className="betegna-card">
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <Trophy className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-sm font-medium">First Win</div>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                          <User className="w-6 h-6 text-secondary" />
                        </div>
                        <div className="text-sm font-medium">Regular Player</div>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                          <Trophy className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">Streak Master</div>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                          <Trophy className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">High Roller</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="betegna-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Profile Information</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isEditingProfile ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditingProfile ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={profileData.firstName}
                              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={profileData.lastName}
                              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleProfileUpdate} className="betegna-gradient-primary">
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">First Name</Label>
                            <div className="font-medium">{profileData.firstName}</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Last Name</Label>
                            <div className="font-medium">{profileData.lastName}</div>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Email</Label>
                          <div className="font-medium">{profileData.email}</div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Phone Number</Label>
                          <div className="font-medium">{profileData.phone}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <Card className="betegna-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <History className="w-5 h-5" />
                      <span>Recent Transactions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.map((transaction, index) => (
                        <div key={transaction.id}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                {transaction.type === "win" ? "Prize Won" : "Game Entry"} - {transaction.game}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(transaction.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className={`font-semibold ${
                              transaction.amount > 0 ? "text-success" : "text-muted-foreground"
                            }`}>
                              {transaction.amount > 0 ? "+" : ""}{transaction.amount} ETB
                            </div>
                          </div>
                          {index < recentTransactions.length - 1 && <Separator className="mt-4" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;