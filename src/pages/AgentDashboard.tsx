import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { savePendingRegistration, PendingRegistration } from '@/lib/offlineStorage';
import Logo from '@/components/Logo';
import StatsCard from '@/components/StatsCard';
import PhotoUpload from '@/components/PhotoUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { 
  LogOut, 
  Users, 
  Plus, 
  Search, 
  Loader2,
  UserCircle,
  Hash,
  Phone,
  Mail,
  Eye,
  Trophy,
  BarChart3,
  WifiOff,
  RefreshCw,
   Cloud,
   Settings
} from 'lucide-react';
import { SettingsDropdown } from '@/components/SettingsDropdown';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  ref_number: string;
  profile_pic_url: string | null;
  customers_count: number;
  gender?: string | null;
}

interface AllAgent {
  id: string;
  name: string;
  profile_pic_url: string | null;
  customers_count: number;
  gender: string | null;
  rank: string;
}

interface AgentCustomer {
  id: string;
  name: string;
  surname: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  date_of_birth: string | null;
  id_number: string | null;
  gender: string | null;
  id_photo_url: string | null;
  created_at: string;
}

const GENDER_COLORS = {
  Male: 'hsl(var(--primary))',
  Female: 'hsl(var(--accent))',
  Other: 'hsl(var(--muted-foreground))',
};

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const { isOnline, pendingCount, isSyncing, syncPendingRegistrations, checkPendingCount } = useOfflineSync();
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [customers, setCustomers] = useState<AgentCustomer[]>([]);
  const [allAgents, setAllAgents] = useState<AllAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('members');
  
  // Add Member Modal
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    surname: '',
    id_number: '',
    gender: '',
    id_photo: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    date_of_birth: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View member details
  const [viewingCustomer, setViewingCustomer] = useState<AgentCustomer | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Agent ranking
  const [agentRank, setAgentRank] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/agent');
    }
  }, [user, authLoading, navigate]);

  const fetchAgentData = async () => {
    if (!user) return;
    
    try {
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (agentError) throw agentError;
      
      if (!agentData) {
        toast({
          title: 'Agent Profile Not Found',
          description: 'Please complete your agent registration.',
          variant: 'destructive',
        });
        navigate('/agent');
        return;
      }

      setAgent(agentData);

      const { data: customersData, error: customersError } = await supabase
        .from('agent_customers')
        .select('*')
        .eq('agent_id', agentData.id)
        .order('created_at', { ascending: false });

      if (customersError) throw customersError;
      setCustomers(customersData || []);

      // Fetch all agents for ranking
      await fetchAllAgents(agentData.id);
    } catch (error: any) {
      console.error('Error fetching agent data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load agent data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAgents = async (currentAgentId: string) => {
    try {
      const { data: agentsData, error } = await supabase
        .from('agents')
        .select('id, name, profile_pic_url, customers_count, gender')
        .order('customers_count', { ascending: false });

      if (error) throw error;

      // Assign ranks based on customer count
      const rankedAgents: AllAgent[] = (agentsData || []).map((a, index) => ({
        ...a,
        rank: `B${index + 1}`,
      }));

      setAllAgents(rankedAgents);

      // Find current agent's rank
      const currentRank = rankedAgents.find(a => a.id === currentAgentId);
      if (currentRank) {
        setAgentRank(currentRank.rank);
      }
    } catch (error) {
      console.error('Error fetching all agents:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAgentData();
    }
  }, [user]);

  // Real-time subscription
  useEffect(() => {
    if (!agent) return;

    const channel = supabase
      .channel('agent-customers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_customers',
          filter: `agent_id=eq.${agent.id}`,
        },
        () => {
          fetchAgentData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [agent?.id]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.surname?.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.id_number?.includes(query)
    );
  }, [customers, searchQuery]);

  // Gender pie chart data
  const genderChartData = useMemo(() => {
    const genderCounts: Record<string, number> = { Male: 0, Female: 0, Other: 0 };
    customers.forEach(c => {
      if (c.gender === 'Male') genderCounts.Male++;
      else if (c.gender === 'Female') genderCounts.Female++;
      else if (c.gender) genderCounts.Other++;
    });
    return Object.entries(genderCounts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));
  }, [customers]);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/agent');
  };

  const openAddModal = () => {
    setCustomerForm({ name: '', surname: '', id_number: '', gender: '', id_photo: '', phone: '', email: '', address: '', city: '', date_of_birth: '' });
    setCustomerModalOpen(true);
  };

  const openViewModal = (customer: AgentCustomer) => {
    setViewingCustomer(customer);
    setViewModalOpen(true);
  };

  const handleSubmitCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;

    if (!customerForm.name || !customerForm.surname || !customerForm.id_number || !customerForm.gender || !customerForm.id_photo || !customerForm.phone || !customerForm.address || !customerForm.city || !customerForm.date_of_birth) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields including ID photo.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    const registrationData = {
      agent_id: agent.id,
      name: customerForm.name,
      surname: customerForm.surname,
      phone: customerForm.phone,
      email: customerForm.email || null,
      address: customerForm.address,
      city: customerForm.city,
      date_of_birth: customerForm.date_of_birth,
      id_number: customerForm.id_number,
      gender: customerForm.gender,
      id_photo_url: customerForm.id_photo,
      referral_source: 'Agent',
      recruited_by_agent_id: agent.id,
    };

    // If offline, save to local storage
    if (!isOnline) {
      try {
        const pendingReg: PendingRegistration = {
          id: crypto.randomUUID(),
          ...registrationData,
          created_at: new Date().toISOString(),
        };
        await savePendingRegistration(pendingReg);
        await checkPendingCount();
        
        toast({
          title: 'Saved Offline',
          description: 'Member registration saved locally. Will sync when back online.',
        });
        setCustomerModalOpen(false);
        setCustomerForm({ name: '', surname: '', id_number: '', gender: '', id_photo: '', phone: '', email: '', address: '', city: '', date_of_birth: '' });
      } catch (error: any) {
        console.error('Error saving offline:', error);
        toast({
          title: 'Error',
          description: 'Failed to save registration offline.',
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Online: save to database
    try {
      const { error } = await supabase
        .from('agent_customers')
        .insert(registrationData);

      if (error) throw error;
      toast({ title: 'Member Added', description: 'New member has been registered successfully.' });

      setCustomerModalOpen(false);
      fetchAgentData();
    } catch (error: any) {
      console.error('Error saving member:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add member.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!agent) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Offline Status Indicator */}
              {!isOnline && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 rounded-full">
                  <WifiOff size={14} className="text-destructive" />
                  <span className="text-sm font-medium text-destructive hidden sm:inline">Offline</span>
                </div>
              )}
              
              {/* Pending Sync Indicator */}
              {pendingCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={syncPendingRegistrations}
                  disabled={!isOnline || isSyncing}
                  className="flex items-center gap-1.5"
                >
                  {isSyncing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isOnline ? (
                    <Cloud size={14} />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  <span className="text-xs">{pendingCount} pending</span>
                </Button>
              )}
              
              {agentRank && (
                <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-primary/10 rounded-full">
                  <Trophy size={14} className="text-primary" />
                  <span className="text-sm font-bold text-primary">{agentRank}</span>
                </div>
              )}
              <Avatar className="h-9 w-9 border-2 border-primary">
                <AvatarImage src={agent.profile_pic_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {agent.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{agent.name}</p>
                <p className="text-xs text-muted-foreground">{agent.ref_number}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
             <SettingsDropdown />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Agent Profile Card */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 mb-8 animate-fade-in">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <UserCircle size={20} className="text-primary" />
            Agent Profile
            {agentRank && (
              <span className="ml-2 px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                {agentRank}
              </span>
            )}
          </h2>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <Avatar className="h-28 w-28 border-4 border-primary/30 shadow-lg">
              <AvatarImage src={agent.profile_pic_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {agent.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center lg:text-left">
              <h1 className="font-display text-2xl font-bold text-foreground mb-3">{agent.name}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Hash size={16} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Reference Number</p>
                    <p className="font-medium text-foreground">{agent.ref_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Mail size={16} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{agent.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Phone size={16} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{agent.phone}</p>
                  </div>
                </div>
              </div>
            </div>
            <StatsCard
              title="Members Registered"
              value={agent.customers_count}
              icon={Users}
              className="w-full lg:w-auto"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users size={16} />
              My Members
            </TabsTrigger>
            <TabsTrigger value="rankings" className="flex items-center gap-2">
              <Trophy size={16} />
              View All Agents
            </TabsTrigger>
          </TabsList>

          {/* My Members Tab */}
          <TabsContent value="members" className="space-y-6">
            {/* Gender Pie Chart */}
            {genderChartData.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-primary" />
                  Member Gender Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genderChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={GENDER_COLORS[entry.name as keyof typeof GENDER_COLORS] || GENDER_COLORS.Other} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="gold" onClick={openAddModal}>
                <Plus size={18} />
                Add Member
              </Button>
            </div>

            {/* Members Table */}
            <div className="bg-card rounded-xl border border-border card-elevated overflow-hidden animate-slide-up">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">My Registered Members</h3>
                <p className="text-sm text-muted-foreground">View-only access to members you have registered</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="text-muted-foreground">Name</TableHead>
                      <TableHead className="text-muted-foreground">Surname</TableHead>
                      <TableHead className="text-muted-foreground">ID Number</TableHead>
                      <TableHead className="text-muted-foreground">Gender</TableHead>
                      <TableHead className="text-muted-foreground">Registered</TableHead>
                      <TableHead className="text-muted-foreground text-right">View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          {searchQuery ? 'No members match your search.' : 'No members registered yet. Add your first member!'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map(customer => (
                        <TableRow key={customer.id} className="border-border hover:bg-secondary/50">
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell className="text-muted-foreground">{customer.surname || '-'}</TableCell>
                          <TableCell className="text-muted-foreground">{customer.id_number || '-'}</TableCell>
                          <TableCell className="text-muted-foreground">{customer.gender || '-'}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(customer.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openViewModal(customer)}
                              title="View Member Details"
                            >
                              <Eye size={16} className="text-primary" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* All Agents Rankings Tab */}
          <TabsContent value="rankings" className="space-y-6">
            <div className="bg-card rounded-xl border border-border card-elevated overflow-hidden animate-slide-up">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Trophy size={18} className="text-primary" />
                  Agent Rankings
                </h3>
                <p className="text-sm text-muted-foreground">Agents ranked by number of members registered</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="text-muted-foreground w-20">Rank</TableHead>
                      <TableHead className="text-muted-foreground">Profile</TableHead>
                      <TableHead className="text-muted-foreground">Agent Name</TableHead>
                      <TableHead className="text-muted-foreground">Gender</TableHead>
                      <TableHead className="text-muted-foreground text-right">Members</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allAgents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          No agents found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      allAgents.map((a, index) => (
                        <TableRow 
                          key={a.id} 
                          className={`border-border hover:bg-secondary/50 ${a.id === agent.id ? 'bg-primary/10' : ''}`}
                        >
                          <TableCell>
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                              index === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                              index === 1 ? 'bg-gray-300/20 text-gray-500' :
                              index === 2 ? 'bg-orange-400/20 text-orange-500' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {a.rank}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Avatar className="h-10 w-10 border-2 border-border">
                              <AvatarImage src={a.profile_pic_url || undefined} />
                              <AvatarFallback className="bg-secondary text-secondary-foreground">
                                {a.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">
                            {a.name}
                            {a.id === agent.id && (
                              <span className="ml-2 text-xs text-primary">(You)</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{a.gender || '-'}</TableCell>
                          <TableCell className="text-right font-semibold text-primary">
                            {a.customers_count}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Member Modal */}
      <Dialog open={customerModalOpen} onOpenChange={setCustomerModalOpen}>
        <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Add New Member
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitCustomer} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name *</label>
              <Input
                value={customerForm.name}
                onChange={e => setCustomerForm(f => ({ ...f, name: e.target.value }))}
                placeholder="First name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Surname *</label>
              <Input
                value={customerForm.surname}
                onChange={e => setCustomerForm(f => ({ ...f, surname: e.target.value }))}
                placeholder="Surname"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">ID Number *</label>
              <Input
                value={customerForm.id_number}
                onChange={e => setCustomerForm(f => ({ ...f, id_number: e.target.value }))}
                placeholder="National ID number"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Gender *</label>
              <Select
                value={customerForm.gender}
                onValueChange={value => setCustomerForm(f => ({ ...f, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Contact Number *</label>
              <Input
                value={customerForm.phone}
                onChange={e => setCustomerForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+263..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email (Optional)</label>
              <Input
                type="email"
                value={customerForm.email}
                onChange={e => setCustomerForm(f => ({ ...f, email: e.target.value }))}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Address *</label>
              <Input
                value={customerForm.address}
                onChange={e => setCustomerForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Street address"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">City *</label>
              <Input
                value={customerForm.city}
                onChange={e => setCustomerForm(f => ({ ...f, city: e.target.value }))}
                placeholder="City"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date of Birth *</label>
              <Input
                type="date"
                value={customerForm.date_of_birth}
                onChange={e => setCustomerForm(f => ({ ...f, date_of_birth: e.target.value }))}
                required
              />
            </div>
            <PhotoUpload
              label="ID Photo"
              value={customerForm.id_photo}
              onChange={value => setCustomerForm(f => ({ ...f, id_photo: value }))}
              maxSizeMB={15}
              required
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setCustomerModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
                Add Member
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Member Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Member Details</DialogTitle>
          </DialogHeader>
          {viewingCustomer && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
                <Avatar className="h-16 w-16 border-2 border-primary/30">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {viewingCustomer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {viewingCustomer.name} {viewingCustomer.surname}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Registered on {new Date(viewingCustomer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Hash size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">ID Number</p>
                    <p className="font-medium text-foreground">{viewingCustomer.id_number || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <UserCircle size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="font-medium text-foreground">{viewingCustomer.gender || 'Not provided'}</p>
                  </div>
                </div>

                {viewingCustomer.id_photo_url && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">ID Photo</p>
                    <img 
                      src={viewingCustomer.id_photo_url} 
                      alt="ID Photo" 
                      className="w-full max-w-sm rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentDashboard;
