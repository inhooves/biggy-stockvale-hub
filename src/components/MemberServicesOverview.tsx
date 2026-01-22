import { ShoppingBasket, Heart, Wallet, Sprout } from 'lucide-react';
import { TabbedContainer, TabItem } from '@/components/TabbedContainer';
import groceriesBagImage from '@/assets/groceries-bag.jpeg';
import burialSupportImage from '@/assets/burial-support.jpeg';
import savingsJarImage from '@/assets/savings-jar.jpeg';
import investmentGrowthImage from '@/assets/investment-growth.jpeg';

export const MemberServicesOverview = () => {
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
    <div className="h-auto rounded-xl border border-border overflow-visible">
      <TabbedContainer
        tabs={serviceTabs}
        defaultLayoutMode="side-by-side"
        maxVisiblePanels={4}
        persistKey="member-services"
      />
    </div>
  );
};

export default MemberServicesOverview;
