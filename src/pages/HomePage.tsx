import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/PageLayout";
import Logo from "@/components/Logo";
import { Users, ShoppingCart, Wallet, Heart, Trophy, Handshake } from "lucide-react";

export default function HomePage() {
  const features = [
    { icon: ShoppingCart, title: "Biggy Groceries", description: "Bulk buying power for maximum savings" },
    { icon: Heart, title: "Burial Society", description: "Support for families in difficult times" },
    { icon: Wallet, title: "Savings Club", description: "Save together for travel and leisure" },
    { icon: Trophy, title: "Fun & Games", description: "Monthly fun day activities and prizes" },
    { icon: Handshake, title: "Crowd Funding", description: "Pool resources for investments" },
    { icon: Users, title: "Community", description: "Ubuntu - I am because we are" },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Biggy Round Stokvel
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-semibold">
            Bigger, Better, Bolder
          </p>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Biggy Round stokvel is a community of Zimbabweans who come together from all corners of 
              the country with a shared unity of purpose to save money and pool funds together for the 
              benefit of all members. Since ancient times, when a group of people came together with a 
              common purpose, it has largely thrived. This has been the African way of doing things as 
              one community – the story of Ubuntu – <strong>I am because we are</strong>.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Biggy Round was created as a shining example of the positive outcomes resulting from a 
              people coming together with unity of purpose – nothing they envision will be impossible. 
              We dream of value creation for our members and creating the biggest round community in 
              the history of Zimbabwe and the African continent; run with professionalism, sound 
              administration and maximum customer satisfaction.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">Join Biggy Round</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Here at Biggy Round we reflect the true spirit of visionary oneness and intriguing ambition. 
            A project for the people, by the people - start the journey together, grow together, save together, 
            buy together, invest together, farm together and have fun together during our end of the month 
            <strong> Biggy Fun Day</strong>.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Biggest Stokvel in Africa?</h2>
          <p className="text-lg mb-8 opacity-90">
            Registration is FREE. Start your journey with Biggy Round today!
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Register Now</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
