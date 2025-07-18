import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, CreditCard, Play, Trophy, CheckCircle, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Smartphone,
      title: "Register with Phone",
      description: "Sign up quickly using your phone number. No lengthy forms or complicated verification process.",
      step: "01"
    },
    {
      icon: CreditCard,
      title: "Buy Bingo Cards",
      description: "Purchase virtual bingo cards for upcoming draws. Choose from various price points and jackpot levels.",
      step: "02"
    },
    {
      icon: Play,
      title: "Join Live Games",
      description: "Participate in scheduled draws with other players. Watch the numbers being called in real-time.",
      step: "03"
    },
    {
      icon: Trophy,
      title: "Win & Celebrate",
      description: "Complete patterns to win prizes! Winnings are instantly credited to your wallet.",
      step: "04"
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: "Fair & Transparent",
      description: "All draws are conducted fairly with transparent random number generation."
    },
    {
      icon: CheckCircle,
      title: "Instant Payouts",
      description: "Winners receive their prizes immediately after the draw ends."
    },
    {
      icon: CheckCircle,
      title: "Multiple Game Types",
      description: "Various bingo patterns and jackpot levels to suit all players."
    },
    {
      icon: CheckCircle,
      title: "Mobile Optimized",
      description: "Play seamlessly on any device - phone, tablet, or desktop."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How <span className="text-primary">Betegna</span> Works
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of players in the most exciting digital bingo experience. 
            Simple to start, thrilling to play, and rewarding to win!
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Get Started in 4 Simple Steps
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="betegna-card h-full text-center">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-foreground">{step.step}</span>
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                {/* Arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose Betegna?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Start Playing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of players and start your winning journey today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="betegna-gradient-primary">
              <Link to="/register">
                Create Account
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/draws">
                View Upcoming Draws
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;