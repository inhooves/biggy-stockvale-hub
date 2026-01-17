import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Car, Home, Sun, Sofa, Briefcase } from "lucide-react";

export default function DoOrDiePage() {
  const prizes = [
    {
      icon: Briefcase,
      title: "Small Business Capital",
      description: "Repayable interest-free in 20 months maximum period"
    },
    {
      icon: Car,
      title: "Quantum Mini Bus",
      description: "Win a quantum mini bus for your business"
    },
    {
      icon: Car,
      title: "Honda Fit Vehicle",
      description: "Drive away in your new Honda Fit"
    },
    {
      icon: Sun,
      title: "Housing Solar System",
      description: "Worth USD $1,500 for your home"
    },
    {
      icon: Sofa,
      title: "Kitchen & Lounge Furniture",
      description: "Complete furniture set for your home"
    },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Biggy Do or Die</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Spin the wheel for a chance to win life-changing prizes every month!
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <h3 className="font-semibold mb-2">Contribute</h3>
                <p className="text-sm text-muted-foreground">
                  Pay the participation fee between the 1st to 15th of each month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <h3 className="font-semibold mb-2">Live Draw</h3>
                <p className="text-sm text-muted-foreground">
                  A spin the wheel draw is conducted live streaming
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <h3 className="font-semibold mb-2">Win Big</h3>
                <p className="text-sm text-muted-foreground">
                  The wheel chooses where the collected funds go
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Prize Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {prizes.map((prize) => (
              <Card key={prize.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <prize.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{prize.title}</h3>
                  <p className="text-muted-foreground text-sm">{prize.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* More Prizes */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">Monthly Draw Prizes</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Active members who never skip their contribution are eligible for these monthly prizes:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Free groceries worth USD $200",
              "USD $50 Pizza Inn family voucher",
              "50 Gig Data",
              "Samsung phones",
              "Laptops",
              "Gas Stoves",
              "50kg Gas Tank (filled)",
              "60 inch flat screen TVs"
            ].map((prize) => (
              <span key={prize} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm">
                {prize}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dream Prizes */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-primary/20">
            <CardContent className="p-8 text-center">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Dream Big, Win Big!</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our grand prizes include paid holidays to Cape Town, Dubai, Victoria Falls, Nyanga, and China! 
                Houses, vehicles, solar panels, and more await our lucky winners. Every contribution brings 
                you closer to life-changing rewards.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take a Chance?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join Biggy Do or Die and spin the wheel of fortune!
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Register Now</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
