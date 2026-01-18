import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { MainNavigation } from '@/components/MainNavigation';
import { UserPlus, ShieldCheck, ShoppingBasket, Users, TrendingUp, Award, Heart, Wallet, Sprout } from 'lucide-react';
import { TabbedContainer, TabItem } from '@/components/TabbedContainer';
import groceriesBagImage from '@/assets/groceries-bag.jpeg';

const Index = () => {
  const serviceTabs: TabItem[] = [
    {
      id: 'groceries',
      title: 'Groceries',
      closable: false,
      content: (
        <div className="p-4 text-center">
          <ShoppingBasket size={32} className="text-primary mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold mb-2">Bulk Groceries</h3>
          <p className="text-sm text-muted-foreground mb-3">Pool funds for wholesale grocery purchases at discounted rates.</p>
          <img src={groceriesBagImage} alt="Groceries bag with products" className="w-full max-w-xs mx-auto rounded-lg" />
        </div>
      ),
    },
    {
      id: 'burial',
      title: 'Burial',
      closable: false,
      content: (
        <div className="p-4 text-center">
          <Heart size={32} className="text-primary mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold mb-2">Burial Cover</h3>
          <p className="text-sm text-muted-foreground">Community support during difficult times with burial insurance.</p>
        </div>
      ),
    },
    {
      id: 'savings',
      title: 'Savings',
      closable: false,
      content: (
        <div className="p-4 text-center">
          <Wallet size={32} className="text-primary mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold mb-2">Group Savings</h3>
          <p className="text-sm text-muted-foreground">Save together and grow your funds with community savings.</p>
        </div>
      ),
    },
    {
      id: 'investments',
      title: 'Investments',
      closable: false,
      content: (
        <div className="p-4 text-center">
          <Sprout size={32} className="text-primary mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold mb-2">Crowd Farming</h3>
          <p className="text-sm text-muted-foreground">Invest more to multiply your investments with us.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <MainNavigation />

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            
            {/* Side-by-Side Tabs */}
            <div className="h-[200px] mb-8 rounded-xl border border-border overflow-hidden">
              <TabbedContainer
                tabs={serviceTabs}
                defaultLayoutMode="side-by-side"
                maxVisiblePanels={4}
                persistKey="home-services"
              />
            </div>
            
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Your Trusted</span>
              <br />
              <span className="gold-text text-3d">Groceries Partner</span>
            </h1>
            
            <p className="text-base text-muted-foreground mb-8 max-w-xl mx-auto">
              Join Biggy Round Groceries Stockvale and experience premium grocery management 
              with exclusive member benefits and seamless service.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="gold" size="lg" className="w-full sm:w-auto text-lg px-8">
                  <UserPlus size={20} />
                  Register Now
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                  <ShieldCheck size={20} />
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: ShoppingBasket,
                title: 'Premium Groceries',
                description: 'Access to high-quality products and exclusive member discounts.'
              },
              {
                icon: Users,
                title: 'Member Benefits',
                description: 'Personalized service and loyalty rewards for registered customers.'
              },
              {
                icon: TrendingUp,
                title: 'Smart Management',
                description: 'Advanced stockvale tracking and inventory solutions.'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border hover-glow transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Badge */}
        <section className="container mx-auto px-4 pb-20">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 max-w-2xl mx-auto text-center border border-primary/20">
            <Award size={40} className="text-primary mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Trusted by Thousands
            </h3>
            <p className="text-muted-foreground">
              Join our growing community of satisfied customers who trust Biggy Round 
              for their grocery stockvale needs.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Biggy Round Groceries Stockvale. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
