import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PartyPopper, Trophy, Users, Calendar, Utensils, Building2 } from "lucide-react";

export default function FunDayPage() {
  const games = [
    "Legs tied race",
    "Fast walking race",
    "Sack races",
    "Blind folded treasure hunting",
    "Egg races",
    "Ball games (juggling and tyre holes target shooting)",
    "Kids 60m racing for toddlers",
    "Crawling race for 1 year olds",
    "One leg hopping race"
  ];

  const prizes = [
    "Samsung Phones",
    "Cash prizes",
    "Family Pizza Inn Vouchers",
    "Laptops",
    "Data bundles"
  ];

  const objectives = [
    { icon: Users, text: "Have fun as families" },
    { icon: PartyPopper, text: "Outdoor exercise, fresh air and good sunshine" },
    { icon: Building2, text: "Networking for professional opportunities" },
    { icon: Trophy, text: "Business opportunities and alliances" },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <PartyPopper className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Biggy Fun Day</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us every last Sunday of the month for games, prizes, and community fun!
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold">Monthly Community Event</h2>
                  <p className="text-muted-foreground">Last Sunday of each month</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Stokvel members contribute a designated amount to participate in the fun day events organized 
                the last Sunday of each month. Contributions are expected to be mobilized between the 1st to 
                the 15th of each month to enable high-level preparations on time.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                All contributions will be deposited in the main pool account for ease of tracking.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Games */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">Games & Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {games.map((game) => (
              <Card key={game}>
                <CardContent className="p-4 flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-primary shrink-0" />
                  <span>{game}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">Prizes for Winners</h2>
          <p className="text-center text-muted-foreground mb-8">
            Winners for 1st, 2nd, and 3rd place will be awarded amazing prizes!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {prizes.map((prize) => (
              <div key={prize} className="px-6 py-3 bg-primary/10 text-primary rounded-full font-medium">
                {prize}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendors */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">Food & Entertainment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <Utensils className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Food Vendors</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Braai merchants</li>
                  <li>• Simbisa (Pizza Inn and Steers)</li>
                  <li>• Dairibord ice cream sales (for kids)</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <PartyPopper className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Entertainment</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Jumping castle services</li>
                  <li>• Members' product/service booths</li>
                  <li>• Free advertising opportunities for stokvel members and sponsoring organizations</li>
                  <li>• Advertising items include banners, flyers, brochures, T-shirts, etc.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">Objectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((obj) => (
              <Card key={obj.text}>
                <CardContent className="p-6 flex items-center gap-4">
                  <obj.icon className="h-8 w-8 text-primary shrink-0" />
                  <span className="text-lg">{obj.text}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Fun!</h2>
          <p className="text-lg mb-8 opacity-90">
            Register today and be part of our monthly community celebration.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Register Now</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
