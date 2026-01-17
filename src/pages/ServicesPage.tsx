import { Link } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Wallet, TrendingUp, Users, ArrowRight } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: ShoppingCart,
      title: "Biggy Groceries",
      description: "Members contribute a designated monthly fee for collective grocery purchases. Buy in bulk, get major discounts, and enjoy door-to-door delivery.",
      link: "/services/groceries",
      features: ["Bulk buying discounts", "Door-to-door delivery", "Grocery insurance"]
    },
    {
      icon: Heart,
      title: "Biggy Burial Society",
      description: "A service to assist the next of kin with burial-related expenses. Receive USD $500 and 4 months of groceries upon a member's passing.",
      link: "/services/burial",
      features: ["USD $500 cash aid", "4 months groceries", "Counselling support"]
    },
    {
      icon: Wallet,
      title: "Biggy Savings Club",
      description: "Facilitate saving for travel and leisure. Plan group trips and experiences with small, manageable monthly contributions.",
      link: "/services/savings",
      features: ["Travel savings", "Group experiences", "Flexible contributions"]
    },
    {
      icon: TrendingUp,
      title: "Biggy Investments Club",
      description: "Long-term investment opportunities including financial markets, real estate, and education planning for your children.",
      link: "/services/investments",
      features: ["Real estate", "Financial markets", "Education funds"]
    },
    {
      icon: Users,
      title: "Biggy Crowd Funding",
      description: "Pool funds together for new businesses, farming projects, and dynasty funds. Invest as one consolidated investor.",
      link: "/services/crowdfunding",
      features: ["Business funding", "Crowd farming", "Dynasty fund"]
    },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Stokvel Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive financial solutions designed to help our community save, invest, and prosper together.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <service.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features.map((feature) => (
                      <span key={feature} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Button asChild>
                    <Link to={service.link}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join Biggy Round today and access all our stokvel services.
          </p>
          <Button size="lg" asChild>
            <Link to="/register">Register Now</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
