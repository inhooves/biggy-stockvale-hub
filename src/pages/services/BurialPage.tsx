import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, DollarSign, ShoppingCart, Users, Calendar } from "lucide-react";
import burialHeroImage from "@/assets/burial-hero.jpeg";
import burialSupportImage from "@/assets/burial-support.jpeg";

export default function BurialPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: "USD $500 Cash Aid",
      description: "The next of kin will receive USD $500 equivalence for burial-related expenses."
    },
    {
      icon: ShoppingCart,
      title: "3 Months Groceries",
      description: "The family will receive standard grocery allotment for 3 months post the death of the member."
    },
    {
      icon: Users,
      title: "Counselling Sessions",
      description: "We organize counselling sessions and provide ideas on how to move on and ensure family financial needs are met."
    },
    {
      icon: Calendar,
      title: "Events Management",
      description: "An event management specialist will help with on-the-ground planning and coordination from the time the news is shared with our Community Manager until completion of the counselling sessions."
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
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Biggy Burial Society</h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Supporting family members of our deceased member during their most difficult times with financial assistance and emotional care.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img 
                src={burialHeroImage} 
                alt="Community support at funeral service" 
                className="w-72 h-48 md:w-80 md:h-56 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            A service to assist the next of kin with burial-related expenses. The fee 
            is automatically covered on the monthly fee. This benefit is meant to give the family time 
            to heal, adjust and prepare for the future without their loved one.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            As the Biggy Round community stewards, we believe help comes in many forms apart from financial needs. 
            Emotional support, presence and ideas on teaching the family how to fish can have medium to long-term impact.
          </p>
        </div>
      </section>

      {/* Community Support Image */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <img 
              src={burialSupportImage} 
              alt="Community members supporting each other during difficult times" 
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What We Provide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Eligibility Requirements</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">1</span>
                  <span>Only members who contribute the full monthly fee for a period of <strong>6 months</strong> without skipping a month will be eligible to benefit from this scheme.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">2</span>
                  <span>The details of the next of kin beneficiary are required upon initial registration to avoid conflicts during grieving.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">3</span>
                  <span>Beneficiary details include: Name, ID number, physical address, email address, and contact numbers.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Protect Your Family Today</h2>
          <p className="text-lg mb-8 opacity-90">
            Register and ensure your loved ones are protected.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Register Now</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
