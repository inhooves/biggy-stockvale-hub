import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/PageLayout";
import Logo from "@/components/Logo";
import { Users, ShoppingCart, Wallet, Heart, Trophy, Handshake, Shield, UserCheck, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const features = [
    { icon: ShoppingCart, title: "Biggy Groceries", description: "Bulk buying power for maximum savings", color: "text-emerald-400" },
    { icon: Heart, title: "Burial Society", description: "Support for families in difficult times", color: "text-rose-400" },
    { icon: Wallet, title: "Savings Club", description: "Save together for travel and leisure", color: "text-sky-400" },
    { icon: Trophy, title: "Fun & Games", description: "Monthly fun day activities and prizes", color: "text-amber-400" },
    { icon: Handshake, title: "Crowd Funding", description: "Pool resources for investments", color: "text-violet-400" },
    { icon: Users, title: "Community", description: "Ubuntu - I am because we are", color: "text-primary" },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-gold/5" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <Logo size="lg" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
              <span className="purple-text">Biggy Round</span>{" "}
              <span className="gold-text">Stokvel</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-gold" />
              <p className="text-xl md:text-2xl font-semibold gold-text">
                Bigger, Better, Bolder
              </p>
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              A community of Zimbabweans united to save money and pool funds together. 
              The story of Ubuntu — <strong className="text-foreground">I am because we are</strong>.
            </p>
            <p className="text-base text-muted-foreground mb-10 leading-relaxed">
              We dream of value creation for our members and creating the biggest round community in 
              the history of Zimbabwe and the African continent.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" asChild className="group text-base px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25">
              <Link to="/register">
                Join Biggy Round
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8 py-6 border-2 hover:bg-primary/5">
              <Link to="/about">Learn More</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button size="sm" variant="ghost" asChild className="text-muted-foreground hover:text-primary">
              <Link to="/agent" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Agent Portal
              </Link>
            </Button>
            <Button size="sm" variant="ghost" asChild className="text-muted-foreground hover:text-primary">
              <Link to="/admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Portal
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="relative py-20 px-4">
        <div className="section-divider mb-16" />
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 purple-text">Our Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A project for the people, by the people — start the journey together, grow together, 
              save together, buy together, invest together, farm together and have fun together during 
              our end of the month <strong className="text-foreground">Biggy Fun Day</strong>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-14 purple-text"
          >
            What We Offer
          </motion.h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={item}>
                <Card className="group glass-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-transparent hover:border-primary/20">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(280_50%_60%/0.3),transparent)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Ready to Join Africa's Biggest Stokvel?
          </h2>
          <p className="text-lg mb-8 text-primary-foreground/80">
            Registration is FREE. Start your journey with Biggy Round today!
          </p>
          <Button size="lg" variant="secondary" asChild className="text-base px-8 py-6 shadow-lg">
            <Link to="/register">Register Now</Link>
          </Button>
        </motion.div>
      </section>
    </PageLayout>
  );
}
