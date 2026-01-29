import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Sprout, Baby, Building2 } from "lucide-react";

export default function CrowdfundingPage() {
  const crowdfundingTypes = [
    {
      icon: Building2,
      title: "Business Crowd Funding",
      description: "Stokvel members contribute to fund a new business launched by the Biggy Round founding team or by one of the stokvel members. Contributing members own shares as a single consolidated investor – entitled to receive a share of the profits after an agreed time period."
    },
    {
      icon: Baby,
      title: "Biggy Dynasty Fund",
      description: "Stokvel members contribute small monthly fees to a crowd fund with a dedicated fund steward who constantly presents business and investment opportunities for consideration every month. Target market are toddlers' parents who seek long-term value multiplication (10 years minimum)."
    },
    {
      icon: Sprout,
      title: "Crowd Farming",
      description: "Stokvel members pool funds together to fund medium to large scale farming projects or high return projects. This includes cattle, goat farming, road runner breeding OR short to medium term crop production such as potatoes and sweet potato farming over a designated period (5 years) with each contributor viewed as an investor entitled to equal sharing of growth."
    },
    {
      icon: Users,
      title: "Non-Commercial Crowd Funding",
      description: "Pooling funds from a group of people to acquire or procure a commonly demanded not-for-profit product."
    },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Biggy Crowd Funding</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pool your resources to fund businesses, farming projects, and build generational wealth.
          </p>
        </div>
      </section>

      {/* Types of Crowdfunding */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Crowdfunding Options</h2>
          <div className="space-y-8">
            {crowdfundingTypes.map((type) => (
              <Card key={type.title}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <type.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{type.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Livestock Farming */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Livestock & Crop Farming Projects</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Crowd farming projects can take the form of cattle and goat farming, road runner breeding, 
                or short to medium term crop production such as potatoes and sweet potato farming 
                to grow returns over a designated period (5 years) as a unit with many contributors.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The livestock can be kept at one to ten farms in total with each stokvel member who contributed 
                capital viewed as an investor, thus entitled to an equal sharing of the livestock growth over 
                the investment period in each cluster or tribe.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This nature of stokvel appeals to those who seek to invest for medium to long-term return with 
                special reference to children or family legacy-oriented investment decisions.
              </p>
            </CardContent>
          </Card>
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
                <p className="text-sm text-muted-foreground">Pool funds together with other stokvel members</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <h3 className="font-semibold mb-2">Invest</h3>
                <p className="text-sm text-muted-foreground">Fund agreed projects as consolidated investors</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <h3 className="font-semibold mb-2">Profit</h3>
                <p className="text-sm text-muted-foreground">Share profits equally among all contributors</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Building Wealth Together</h2>
          <p className="text-lg mb-8 opacity-90">
            Join Biggy Crowd Funding and invest in your community's future.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Register Now</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
