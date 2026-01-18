import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getCustomerById, Customer } from '@/lib/customerStorage';
import {
  Home,
  Info,
  Wallet,
  Gamepad2,
  FileText,
  Gift,
  Phone,
  Store,
  LogOut,
  User,
  ShoppingBag,
  Flower2,
  PiggyBank,
  TrendingUp,
  Users,
  PartyPopper,
  Dice5,
} from 'lucide-react';

const MEMBER_SESSION_KEY = 'biggy_member_session';

export const setMemberSession = (memberId: string) => {
  localStorage.setItem(MEMBER_SESSION_KEY, memberId);
};

export const getMemberSession = (): string | null => {
  return localStorage.getItem(MEMBER_SESSION_KEY);
};

export const clearMemberSession = () => {
  localStorage.removeItem(MEMBER_SESSION_KEY);
};

const MemberDashboard = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const memberId = getMemberSession();
    if (!memberId) {
      navigate('/member/login');
      return;
    }
    const customerData = getCustomerById(memberId);
    if (!customerData) {
      clearMemberSession();
      navigate('/member/login');
      return;
    }
    setMember(customerData);
  }, [navigate]);

  const handleLogout = () => {
    clearMemberSession();
    navigate('/');
  };

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getInitials = () => {
    return `${member.firstName?.[0] || ''}${member.surname?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 border-2 border-primary">
                {member.passportPhoto ? (
                  <AvatarImage src={member.passportPhoto} alt={member.firstName} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium hidden md:block">
                {member.firstName} {member.surname}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto bg-muted/50 p-2 rounded-lg mb-6">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">About Us</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Stokvel Services</span>
            </TabsTrigger>
            <TabsTrigger value="fun" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">Fun & Games</span>
            </TabsTrigger>
            <TabsTrigger value="constitution" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Constitution</span>
            </TabsTrigger>
            <TabsTrigger value="benefits" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span className="hidden sm:inline">Benefits</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contact Us</span>
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Biggy Market Place</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Welcome, {member.firstName}!
                  </CardTitle>
                  <CardDescription>Your member dashboard at Biggy Stokvel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Member ID</p>
                      <p className="font-mono font-bold">{member.idNumber}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">{new Date(member.dateJoined).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{member.email || 'Not provided'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <Button variant="outline" className="justify-start" onClick={() => setActiveTab('services')}>
                      <Wallet className="h-4 w-4 mr-2" />
                      View Stokvel Services
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => setActiveTab('marketplace')}>
                      <Store className="h-4 w-4 mr-2" />
                      Browse Marketplace
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => setActiveTab('fun')}>
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      Fun & Games
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Announcements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Welcome to Biggy Stokvel! Explore our services and join our community initiatives.
                      Check out the Fun & Games section for upcoming events.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* About Us Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Biggy Stokvel</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-muted-foreground">
                  Biggy Stokvel embodies the spirit of Ubuntu – "I am because we are." 
                  We are a community-driven savings and investment club that empowers members 
                  through collective prosperity and mutual support.
                </p>
                <p className="text-muted-foreground mt-4">
                  Our vision is to create financial freedom for every member through disciplined 
                  savings, smart investments, and community support systems.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stokvel Services Tab */}
          <TabsContent value="services">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/services/groceries')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Biggy Groceries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Bulk grocery purchases with monthly savings cycles for better value.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/services/burial')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Flower2 className="h-5 w-5 text-primary" />
                    Burial Society
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    USD $500 burial aid plus 4 months of groceries for bereaved families.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/services/savings')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PiggyBank className="h-5 w-5 text-primary" />
                    Savings Club
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Dedicated savings for travel, leisure, and personal goals.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/services/investments')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Investments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Education and real estate investment opportunities.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/services/crowdfunding')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-primary" />
                    Crowd Farming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Livestock and business funding through community pooling.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fun & Games Tab */}
          <TabsContent value="fun">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/fun/funday')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PartyPopper className="h-5 w-5 text-primary" />
                    Biggy Fun Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Community events, celebrations, and social gatherings for all members.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/fun/doordie')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dice5 className="h-5 w-5 text-primary" />
                    Do or Die
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Exciting prize draws and competitions for members.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Constitution Tab */}
          <TabsContent value="constitution">
            <Card>
              <CardHeader>
                <CardTitle>Biggy Stokvel Constitution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our constitution outlines the rules, regulations, and guidelines that govern 
                  our stokvel operations and member conduct.
                </p>
                <Button variant="outline" onClick={() => navigate('/constitution')}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Constitution
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits">
            <Card>
              <CardHeader>
                <CardTitle>Member Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Gift className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Collective Savings Power</p>
                      <p className="text-sm text-muted-foreground">Pool resources for better rates and bulk discounts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Community Support</p>
                      <p className="text-sm text-muted-foreground">Access to burial society and emergency assistance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Investment Opportunities</p>
                      <p className="text-sm text-muted-foreground">Participate in group investments and crowd farming</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/benefits')}>
                  View All Benefits
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Us Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Have questions or need assistance? Reach out to our team.
                </p>
                <Button variant="outline" onClick={() => navigate('/contact')}>
                  <Phone className="h-4 w-4 mr-2" />
                  Go to Contact Page
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Biggy Market Place
                </CardTitle>
                <CardDescription>Coming Soon!</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  An exclusive marketplace for stokvel members to buy, sell, and trade 
                  products and services within our community.
                </p>
                <Button variant="outline" onClick={() => navigate('/marketplace')}>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MemberDashboard;
