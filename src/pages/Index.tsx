import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { MainNavigation } from '@/components/MainNavigation';
import { UserPlus, ShieldCheck, ShoppingBasket, Users, TrendingUp, Award, Heart, Wallet, Sprout } from 'lucide-react';
import { TabbedContainer, TabItem } from '@/components/TabbedContainer';
import groceriesBagImage from '@/assets/groceries-bag.jpeg';
import burialSupportImage from '@/assets/burial-support.jpeg';
import savingsJarImage from '@/assets/savings-jar.jpeg';
import investmentGrowthImage from '@/assets/investment-growth.jpeg';

const Index = () => {
  const serviceTabs: TabItem[] = [
    {
      id: 'groceries',
      title: 'Groceries',
      closable: false,
      content: (
        <div className="p-2 md:p-3 text-center flex flex-col items-center">
          <ShoppingBasket size={20} className="text-primary mb-1 md:hidden" />
          <ShoppingBasket size={24} className="text-primary mb-1 hidden md:block" />
          <h3 className="font-display text-xs md:text-sm font-semibold mb-1">Bulk Groceries</h3>
          <p className="text-[10px] md:text-xs text-muted-foreground mb-2 line-clamp-2">Pool funds for wholesale grocery purchases.</p>
          <img src={groceriesBagImage} alt="Groceries bag with products" className="w-16 h-16 md:w-28 md:h-28 object-cover rounded-lg" />
        </div>
      ),
    },
    {
      id: 'burial',
      title: 'Burial',
      closable: false,
      content: (
        <div className="p-2 md:p-3 text-center flex flex-col items-center">
          <Heart size={20} className="text-primary mb-1 md:hidden" />
          <Heart size={24} className="text-primary mb-1 hidden md:block" />
          <h3 className="font-display text-xs md:text-sm font-semibold mb-1">Burial Cover</h3>
          <p className="text-[10px] md:text-xs text-muted-foreground mb-2 line-clamp-2">Community support during difficult times.</p>
          <img src={burialSupportImage} alt="Community support during difficult times" className="w-16 h-16 md:w-28 md:h-28 object-cover rounded-lg" />
        </div>
      ),
    },
    {
      id: 'savings',
      title: 'Savings',
      closable: false,
      content: (
        <div className="p-2 md:p-3 text-center flex flex-col items-center">
          <Wallet size={20} className="text-primary mb-1 md:hidden" />
          <Wallet size={24} className="text-primary mb-1 hidden md:block" />
          <h3 className="font-display text-xs md:text-sm font-semibold mb-1">Group Savings</h3>
          <p className="text-[10px] md:text-xs text-muted-foreground mb-2 line-clamp-2">Save together and grow your funds.</p>
          <img src={savingsJarImage} alt="Savings jar with coins and money" className="w-16 h-16 md:w-28 md:h-28 object-cover rounded-lg" />
        </div>
      ),
    },
    {
      id: 'investments',
      title: 'Investments',
      closable: false,
      content: (
        <div className="p-2 md:p-3 text-center flex flex-col items-center">
          <Sprout size={20} className="text-primary mb-1 md:hidden" />
          <Sprout size={24} className="text-primary mb-1 hidden md:block" />
          <h3 className="font-display text-xs md:text-sm font-semibold mb-1">Crowd Farming</h3>
          <p className="text-[10px] md:text-xs text-muted-foreground mb-2 line-clamp-2">Expand your investment potential.</p>
          <img src={investmentGrowthImage} alt="Investment growth chart" className="w-16 h-16 md:w-28 md:h-28 object-cover rounded-lg" />
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
        <section className="container mx-auto px-3 md:px-4 py-6 md:py-12 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex justify-center mb-4 md:mb-6">
              <div className="scale-75 md:scale-100">
                <Logo size="lg" />
              </div>
            </div>
            
            {/* Side-by-Side Tabs */}
            <div className="h-auto mb-4 md:mb-8 rounded-xl border border-border overflow-visible">
              <TabbedContainer
                tabs={serviceTabs}
                defaultLayoutMode="side-by-side"
                maxVisiblePanels={4}
                persistKey="home-services"
              />
            </div>
            
            <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <span className="text-foreground">Your Trusted</span>
              <br />
              <span className="gold-text text-3d">Groceries Partner</span>
            </h1>
            
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto px-2">
              Join Biggy Round Groceries Stockvale and experience premium grocery management 
              with exclusive member benefits.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Link to="/register">
                <Button variant="gold" size="lg" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8">
                  <UserPlus size={18} className="md:hidden" />
                  <UserPlus size={20} className="hidden md:block" />
                  Register Now
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8">
                  <ShieldCheck size={18} className="md:hidden" />
                  <ShieldCheck size={20} className="hidden md:block" />
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-3 md:px-4 pb-12 md:pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
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
                className="bg-card/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border hover-glow transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/20 flex items-center justify-center mb-3 md:mb-4">
                  <feature.icon size={20} className="text-primary md:hidden" />
                  <feature.icon size={24} className="text-primary hidden md:block" />
                </div>
                <h3 className="font-display text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Badge */}
        <section className="container mx-auto px-3 md:px-4 pb-12 md:pb-20">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl md:rounded-2xl p-6 md:p-8 max-w-2xl mx-auto text-center border border-primary/20">
            <Award size={32} className="text-primary mx-auto mb-3 md:hidden" />
            <Award size={40} className="text-primary mx-auto mb-4 hidden md:block" />
            <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mb-2">
              Trusted by Thousands
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Join our growing community of satisfied customers who trust Biggy Round 
              for their grocery stockvale needs.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-6 md:py-8">
        <div className="container mx-auto px-3 md:px-4 text-center text-xs md:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Biggy Round Groceries Stockvale. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
