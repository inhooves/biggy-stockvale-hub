import { Link } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Wallet, TrendingUp, Users, ArrowRight, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ServicesPage() {
  const services = [
    {
      icon: ShoppingCart,
      title: "Biggy Groceries",
      description: "Members contribute a designated monthly fee for collective grocery purchases. Buy in bulk, get major discounts, and enjoy door-to-door delivery.",
      link: "/services/groceries",
      features: ["Bulk buying discounts", "Door-to-door delivery", "Grocery insurance"],
      color: "text-emerald-400",
    },
    {
      icon: Heart,
      title: "Biggy Burial Society",
      description: "A service to assist the next of kin with burial-related expenses. Receive USD $500 and 4 months of groceries upon a member's passing.",
      link: "/services/burial",
      features: ["USD $500 cash aid", "4 months groceries", "Counselling support"],
      color: "text-rose-400",
    },
    {
      icon: Wallet,
      title: "Biggy Savings Club",
      description: "Facilitate saving for travel and leisure. Plan group trips and experiences with small, manageable monthly contributions.",
      link: "/services/savings",
      features: ["Travel savings", "Group experiences", "Flexible contributions"],
      color: "text-sky-400",
    },
    {
      icon: TrendingUp,
      title: "Biggy Investments Club",
      description: "Long-term investment opportunities including financial markets, real estate, and education planning for your children.",
      link: "/services/investments",
      features: ["Real estate", "Financial markets", "Education funds"],
      color: "text-amber-400",
    },
    {
      icon: Users,
      title: "Biggy Crowd Funding",
      description: "Pool funds together for new businesses, farming projects, and dynasty funds. Invest as one consolidated investor.",
      link: "/services/crowdfunding",
      features: ["Business funding", "Crowd farming", "Dynasty fund"],
      color: "text-violet-400",
    },
    {
      icon: PartyPopper,
      title: "Biggy Fun & Games",
      description: "Monthly community events featuring games, prizes, and networking. Join us every last Sunday of the month for family fun!",
      link: "/fun/fun-day",
      features: ["Monthly events", "Prizes", "Networking"],
      color: "text-pink-400",
    },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-14 md:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-gold/5" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 purple-text">Stokvel Services</h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive financial solutions designed to help our community save, invest, and prosper together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {services.map((service) => (
              <motion.div key={service.title} variants={item}>
                <Card className="group glass-card h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-transparent hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <service.icon className={`h-7 w-7 ${service.color}`} />
                      </div>
                      <CardTitle className="text-xl md:text-2xl">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.features.map((feature) => (
                        <span key={feature} className="px-3 py-1 bg-primary/10 text-primary text-xs md:text-sm rounded-full font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <Button asChild size="sm" className="group/btn">
                      <Link to={service.link}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(280_50%_60%/0.3),transparent)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">Ready to Start Saving?</h2>
          <p className="text-lg mb-8 text-primary-foreground/80">
            Join Biggy Round today and access all our stokvel services.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-base px-8 py-6 shadow-lg">
            <Link to="/register">Register Now</Link>
          </Button>
        </motion.div>
      </section>
    </PageLayout>
  );
}
