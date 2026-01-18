import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Building, GraduationCap, Briefcase, LineChart } from "lucide-react";
import investmentsHeroImage from "@/assets/investments-hero.jpeg";

export default function InvestmentsPage() {
  const investmentOptions = [
    {
      icon: LineChart,
      title: "Financial Markets",
      description: "Invest collectively in stocks, bonds, and other financial instruments for long-term growth."
    },
    {
      icon: Building,
      title: "Real Estate",
      description: "Pool funds to invest in property, stands, and real estate developments."
    },
    {
      icon: GraduationCap,
      title: "Education Funds",
      description: "Plan and save for primary, high school, or university education fees for your children."
    },
    {
      icon: Briefcase,
      title: "Business Equity",
      description: "Secure equity or shares in thriving businesses as a consolidated investor group."
    },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="w-20 h-20 mx-auto md:mx-0 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Biggy Investments Club</h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Long-term investment opportunities for wealth creation and asset acquisition.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img 
                src={investmentsHeroImage} 
                alt="Investment growth chart with city skyline" 
                className="w-64 h-80 md:w-72 md:h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            This facilitates long-term investment avenues for those intending to acquire a physical asset 
            in the near future. Stokvel members can pool their funds and invest as one fund in agreed 
            investment options.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            It should be noted that stokvel members should be long-term driven to enable higher returns. 
            Whether it's financial markets, real estate, or securing equity in thriving businesses, 
            investing together multiplies our power.
          </p>
        </div>
      </section>

      {/* Investment Options */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Investment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {investmentOptions.map((option) => (
              <Card key={option.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <option.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                      <p className="text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education Focus */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <GraduationCap className="h-10 w-10 text-primary" />
                <h2 className="text-2xl font-bold">Education Investment</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A member may plan to invest immediately for the primary, high school or university 
                education fees of their children. Start early, invest consistently, and secure your 
                children's educational future through our structured savings and investment programs.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Build Your Future Today</h2>
          <p className="text-lg mb-8 opacity-90">
            Join Biggy Investments Club and grow your wealth together.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Register Now</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
