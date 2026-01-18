import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, Truck, Heart, Gift, Trophy, Users, 
  Lightbulb, Shield, MessageCircle, Scale, Wallet, 
  Building2, FileText, Phone, Eye, Vote
} from "lucide-react";

export default function BenefitsPage() {
  const benefits = [
    {
      icon: ShoppingCart,
      title: "Bulk Buying Power",
      description: "Members individually get more units for the same value of their money compared to buying as separate households."
    },
    {
      icon: Truck,
      title: "Door-to-Door Delivery",
      description: "Goods will be delivered at member physical addresses between the periods 10 to 20 of each month."
    },
    {
      icon: Heart,
      title: "Burial Society Inclusion",
      description: "Upon death, next of kin receives USD $500 cash aid and the family receives groceries for 4 consecutive months."
    },
    {
      icon: Building2,
      title: "Free Advertising",
      description: "Registered stokvel members can advertise products or services through our e-commerce platform."
    },
    {
      icon: Trophy,
      title: "Monthly Prize Draws",
      description: "Win free groceries worth USD $200, phones, laptops, gas stoves, flat screen TVs, and more!"
    },
    {
      icon: Users,
      title: "Women Empowerment",
      description: "Free women empowerment workshops organized every quarter."
    },
    {
      icon: Lightbulb,
      title: "Business Mentoring",
      description: "Free start-ups mentoring in sales, digital marketing, operations management and capital sourcing."
    },
    {
      icon: Shield,
      title: "Strong Constitution",
      description: "Policies and procedures to ensure member confidence and satisfaction."
    },
    {
      icon: Vote,
      title: "Democratic Leadership",
      description: "Members free to suggest points related to community administration. Your voice is heard with mutual respect."
    },
    {
      icon: Phone,
      title: "Customer Support",
      description: "Customer Services Team available Monday to Friday, 8:30am to 4:30pm."
    },
    {
      icon: FileText,
      title: "Proper Structure",
      description: "Adequate departments established so that the venture is run successfully."
    },
    {
      icon: Scale,
      title: "Elected Committee",
      description: "A Committee elected yearly by members to guard their interests continuously."
    },
    {
      icon: Wallet,
      title: "Interest-Free Loans",
      description: "Access short-term loans of up to USD $100 repayable in 60 days (after 6 months membership)."
    },
    {
      icon: Gift,
      title: "Business Opportunities",
      description: "Receive emerging business opportunity tips including machine suppliers and free business proposal writing."
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Operations are transparent with things done according to established policy. Integrity at the heart of our values."
    },
    {
      icon: MessageCircle,
      title: "Grievance Resolution",
      description: "Present grievances to the Community Manager via email, WhatsApp, or in-person appointments."
    },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-10 md:py-16 px-3 md:px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Gift className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Member Benefits</h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover all the advantages of being a Biggy Round stokvel member.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-10 md:py-16 px-3 md:px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">{benefit.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Management */}
      <section className="py-10 md:py-16 px-3 md:px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-primary/20">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <Shield className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                <h2 className="text-xl md:text-2xl font-bold">Strong Risk Management</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3 md:mb-4">
                Strong risk management policies safeguard stokvel member contributions. Joining members 
                are free to visit the bank and verify if the pool account is only deposit taking without 
                anyone capable of withdrawing any funds or diverting them for any other reason varying 
                from the stokvel purpose.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Our operations are transparent and things are done according to established policy. 
                Our community is very organized and highly professional. Integrity is at the heart 
                of our esteemed values.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Free Registration */}
      <section className="py-10 md:py-16 px-3 md:px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Registration is FREE!</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
            During the registration process of all members, no one will pay any money. 
            Contributions are only required post registration.
          </p>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
            Members can join from any city in Zimbabwe. We will introduce several stokvels 
            for different purposes and market segments.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-16 px-3 md:px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Start Enjoying These Benefits Today</h2>
          <p className="text-base md:text-lg mb-6 md:mb-8 opacity-90">
            Join Biggy Round and become part of Zimbabwe's biggest stokvel community.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Register Now - It's Free!</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
