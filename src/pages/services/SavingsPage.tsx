import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wallet, Plane, Users, Calendar, MapPin } from "lucide-react";

export default function SavingsPage() {
  const destinations = [
    "Cape Town", "Dubai", "Victoria Falls", "Nyanga", "China"
  ];

  const features = [
    {
      icon: Users,
      title: "Group Travel",
      description: "Travel as a group of families or individuals for amazing experiences together."
    },
    {
      icon: Calendar,
      title: "Flexible Planning",
      description: "Save for 12 to 18 months prior to actual travel with small feasible amounts."
    },
    {
      icon: Wallet,
      title: "Disciplined Saving",
      description: "A single pool account created for a specific purpose fosters saving discipline."
    },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Biggy Savings Club</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Save together for travel, leisure, and unforgettable experiences with your community.
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            This is a service to facilitate saving for a future gratification purpose – chiefly travel and leisure. 
            Imagine arranging a visit to Cape Town as a group of 1,000 individuals or several families – it can be 
            done for Easter Celebration, August holidays, December, or any time of the year as per the agreement 
            by the stokvel members.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Consistency to save as an individual may prove difficult, thus a single pool account created for a 
            specific purpose may foster the discipline to systematically save the agreed amount in a deposit-taking 
            only pool account.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">Dream Destinations</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Save together and experience these amazing destinations as a community:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {destinations.map((destination) => (
              <div key={destination} className="flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">{destination}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Plane className="h-10 w-10 text-primary" />
                <h2 className="text-2xl font-bold">Example Savings Plan</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Assuming a group of 100 families want to visit a specific destination (locally, regionally or 
                internationally), we can arrange smaller contributions for 12 to 18 months prior to the actual 
                visit or travel. This helps members save money in small feasible amounts and get to experience 
                their dream visit in over a year.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Saving for Your Dream Trip</h2>
          <p className="text-lg mb-8 opacity-90">
            Join Biggy Savings Club and travel the world with your community.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Register Now</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
