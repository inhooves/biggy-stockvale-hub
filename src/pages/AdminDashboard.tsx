import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import StatsCard from '@/components/StatsCard';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { 
  LogOut, 
  Users, 
  UserPlus, 
  Search, 
  Eye, 
  Loader2,
  UserCheck,
  Building2,
  PieChart as PieChartIcon,
  Trophy,
  BarChart3,
  User,
   Shield,
   Settings
} from 'lucide-react';
import { SettingsDropdown } from '@/components/SettingsDropdown';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  ref_number: string;
  profile_pic_url: string | null;
  customers_count: number;
  created_at: string;
  gender?: string | null;
}

interface RankedAgent {
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
  gender: string | null;
  referral_source: string | null;
  recruited_by_agent_id: string | null;
  created_at: string;
}

interface ReferralData {
  name: string;
  value: number;
}

interface RegisteredMember {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  id_number: string;
  date_of_birth: string;
  gender: string;
  address: string | null;
  city: string | null;
  referral_source: string;
  created_at: string;
  updated_at: string;
}

const REFERRAL_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(262, 83%, 58%)',
  'hsl(199, 89%, 48%)',
  'hsl(350, 89%, 60%)',
];

const GENDER_COLORS = {
  Male: 'hsl(var(--primary))',
  Female: 'hsl(var(--accent))',
  Other: 'hsl(var(--muted-foreground))',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('agents');
  
  // Customer view modal
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentCustomers, setAgentCustomers] = useState<AgentCustomer[]>([]);
  const [customersModalOpen, setCustomersModalOpen] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  
  // All customers for referral chart
  const [allCustomers, setAllCustomers] = useState<AgentCustomer[]>([]);
  
  // Self-registered members
  const [registeredMembers, setRegisteredMembers] = useState<RegisteredMember[]>([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  
  // Member details modal
  const [selectedMember, setSelectedMember] = useState<RegisteredMember | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);

  // Check admin role
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!authLoading && user) {
        const { data } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });
        
        if (!data) {
          toast({
            title: 'Access Denied',
            description: 'You do not have admin privileges.',
            variant: 'destructive',
          });
          navigate('/admin');
        } else {
          setIsAdmin(true);
        }
      } else if (!authLoading && !user) {
        navigate('/admin');
      }
    };
    
    checkAdminRole();
  }, [user, authLoading, navigate, toast]);

  // Fetch agents data
  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error: any) {
      console.error('Error fetching agents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load agents data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all customers for referral stats
  const fetchAllCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllCustomers(data || []);
    } catch (error: any) {
      console.error('Error fetching all customers:', error);
    }
  };

  // Fetch self-registered members
  const fetchRegisteredMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('registered_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegisteredMembers(data || []);
    } catch (error: any) {
      console.error('Error fetching registered members:', error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAgents();
      fetchAllCustomers();
      fetchRegisteredMembers();
    }
  }, [isAdmin]);

  // Real-time subscription for agents
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('admin-agents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agents',
        },
        () => {
          fetchAgents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const filteredAgents = useMemo(() => {
    if (!searchQuery) return agents;
    const query = searchQuery.toLowerCase();
    return agents.filter(a => 
      a.name.toLowerCase().includes(query) ||
      a.email.toLowerCase().includes(query) ||
      a.phone.includes(query) ||
      a.ref_number.toLowerCase().includes(query)
    );
  }, [agents, searchQuery]);

  const totalCustomers = useMemo(() => {
    return agents.reduce((sum, agent) => sum + agent.customers_count, 0);
  }, [agents]);

  // Compute referral source stats - combines agent-registered (as Word of Mouth) and self-registered members
  const referralStats = useMemo((): ReferralData[] => {
    const counts: Record<string, number> = {};
    
    // Agent-registered members count as "Word of Mouth"
    if (allCustomers.length > 0) {
      counts['Word of Mouth'] = (counts['Word of Mouth'] || 0) + allCustomers.length;
    }
    
    // Self-registered members use their actual referral source
    registeredMembers.forEach(m => {
      const source = m.referral_source || 'Unknown';
      counts[source] = (counts[source] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [allCustomers, registeredMembers]);

  // Total members (agent-registered + self-registered)
  const totalAllMembers = useMemo(() => {
    return totalCustomers + registeredMembers.length;
  }, [totalCustomers, registeredMembers.length]);

  // Filter self-registered members
  const filteredMembers = useMemo(() => {
    if (!memberSearchQuery) return registeredMembers;
    const query = memberSearchQuery.toLowerCase();
    return registeredMembers.filter(m => 
      m.name.toLowerCase().includes(query) ||
      m.surname.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.phone.includes(query)
    );
  }, [registeredMembers, memberSearchQuery]);

  const handleViewMember = (member: RegisteredMember) => {
    setSelectedMember(member);
    setMemberModalOpen(true);
  };

  // Compute ranked agents
  const rankedAgents = useMemo((): RankedAgent[] => {
    return [...agents]
      .sort((a, b) => b.customers_count - a.customers_count)
      .map((a, index) => ({
        id: a.id,
        name: a.name,
        profile_pic_url: a.profile_pic_url,
        customers_count: a.customers_count,
        gender: a.gender || null,
        rank: `B${index + 1}`,
      }));
  }, [agents]);

  // Gender chart data for selected agent's customers
  const agentCustomersGenderData = useMemo(() => {
    const genderCounts: Record<string, number> = { Male: 0, Female: 0, Other: 0 };
    agentCustomers.forEach(c => {
      if (c.gender === 'Male') genderCounts.Male++;
      else if (c.gender === 'Female') genderCounts.Female++;
      else if (c.gender) genderCounts.Other++;
    });
    return Object.entries(genderCounts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));
  }, [agentCustomers]);

  // Helper to get agent name by ID
  const getAgentName = (agentId: string | null): string => {
    if (!agentId) return '-';
    const agent = agents.find(a => a.id === agentId);
    return agent?.name || '-';
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/admin');
  };

  const handleViewCustomers = async (agent: Agent) => {
    setSelectedAgent(agent);
    setLoadingCustomers(true);
    setCustomersModalOpen(true);

    try {
      const { data, error } = await supabase
        .from('agent_customers')
        .select('*')
        .eq('agent_id', agent.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgentCustomers(data || []);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customer data.',
        variant: 'destructive',
      });
    } finally {
      setLoadingCustomers(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Building2 size={16} />
                Home
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </Button>
             <SettingsDropdown />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage agents and view member registrations</p>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-4 mb-8 animate-fade-in">
          <StatsCard
            title="Total Agents"
            value={agents.length}
            icon={UserCheck}
          />
          <StatsCard
            title="Agent-Registered Members"
            value={totalCustomers}
            icon={Users}
          />
          <StatsCard
            title="Self-Registered Members"
            value={registeredMembers.length}
            icon={UserPlus}
          />
          <StatsCard
            title="Total All Members"
            value={totalAllMembers}
            icon={UserCheck}
          />
        </div>

        {/* Referral Source Pie Chart */}
        {referralStats.length > 0 && (
          <div className="bg-card rounded-xl border border-border card-elevated p-6 mb-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon size={20} className="text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                How Members Heard About Biggy
              </h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={referralStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {referralStats.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={REFERRAL_COLORS[index % REFERRAL_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tabs for Agents, Members, and Rankings */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Users size={16} />
              Agents
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <UserPlus size={16} />
              Members
            </TabsTrigger>
            <TabsTrigger value="rankings" className="flex items-center gap-2">
              <Trophy size={16} />
              Rankings
            </TabsTrigger>
          </TabsList>

          {/* All Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search agents by name, email, phone, or reference..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Agents Table */}
            <div className="bg-card rounded-xl border border-border card-elevated overflow-hidden animate-slide-up">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="text-muted-foreground">Agent</TableHead>
                      <TableHead className="text-muted-foreground">Reference</TableHead>
                      <TableHead className="text-muted-foreground">Phone</TableHead>
                      <TableHead className="text-muted-foreground">Email</TableHead>
                      <TableHead className="text-muted-foreground">Members</TableHead>
                      <TableHead className="text-muted-foreground">Joined</TableHead>
                      <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          {searchQuery ? 'No agents match your search.' : 'No agents registered yet.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAgents.map(agent => (
                        <TableRow key={agent.id} className="border-border hover:bg-secondary/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-primary/30">
                                <AvatarImage src={agent.profile_pic_url || undefined} />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {agent.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{agent.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm text-primary">{agent.ref_number}</TableCell>
                          <TableCell className="text-muted-foreground">{agent.phone}</TableCell>
                          <TableCell className="text-muted-foreground">{agent.email}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleViewCustomers(agent)}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                            >
                              {agent.customers_count} members
                            </button>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(agent.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewCustomers(agent)}
                              title="View Customers"
                            >
                              <Eye size={16} className="text-primary" />
                              View Members
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

          {/* Self-Registered Members Tab */}
          <TabsContent value="members" className="space-y-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search members by name, email, or phone..."
                  value={memberSearchQuery}
                  onChange={e => setMemberSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Members Table */}
            <div className="bg-card rounded-xl border border-border card-elevated overflow-hidden animate-slide-up">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <UserPlus size={18} className="text-primary" />
                  Self-Registered Members
                </h3>
                <p className="text-sm text-muted-foreground">Members who registered directly through the website</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="text-muted-foreground">Name</TableHead>
                      <TableHead className="text-muted-foreground">Gender</TableHead>
                      <TableHead className="text-muted-foreground">Phone</TableHead>
                      <TableHead className="text-muted-foreground">Email</TableHead>
                      <TableHead className="text-muted-foreground">Referral Source</TableHead>
                      <TableHead className="text-muted-foreground">Registered</TableHead>
                      <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          {memberSearchQuery ? 'No members match your search.' : 'No self-registered members yet.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMembers.map(member => (
                        <TableRow 
                          key={member.id} 
                          className="border-border hover:bg-secondary/50 cursor-pointer"
                          onClick={() => handleViewMember(member)}
                        >
                          <TableCell className="font-medium">
                            {member.name} {member.surname}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{member.gender || '-'}</TableCell>
                          <TableCell className="text-muted-foreground">{member.phone}</TableCell>
                          <TableCell className="text-muted-foreground">{member.email || '-'}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent-foreground">
                              {member.referral_source}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(member.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewMember(member);
                              }}
                              title="View Details"
                            >
                              <Eye size={16} className="text-primary" />
                              View
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

          {/* Agent Rankings Tab */}
          <TabsContent value="rankings" className="space-y-6">
            <div className="bg-card rounded-xl border border-border card-elevated overflow-hidden animate-slide-up">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Trophy size={18} className="text-primary" />
                  Agent Leaderboard
                </h3>
                <p className="text-sm text-muted-foreground">Agents ranked by total members registered</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="text-muted-foreground w-20">Rank</TableHead>
                      <TableHead className="text-muted-foreground">Agent</TableHead>
                      <TableHead className="text-muted-foreground">Gender</TableHead>
                      <TableHead className="text-muted-foreground">Members</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankedAgents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                          No agents registered yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      rankedAgents.map((agent, index) => (
                        <TableRow key={agent.id} className="border-border hover:bg-secondary/50">
                          <TableCell>
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                              index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                              index === 1 ? 'bg-gray-300/20 text-gray-400' :
                              index === 2 ? 'bg-orange-500/20 text-orange-500' :
                              'bg-primary/10 text-primary'
                            }`}>
                              {agent.rank}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-primary/30">
                                <AvatarImage src={agent.profile_pic_url || undefined} />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {agent.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{agent.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{agent.gender || '-'}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {agent.customers_count} members
                            </span>
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

      {/* Customer View Modal */}
      <Dialog open={customersModalOpen} onOpenChange={setCustomersModalOpen}>
        <DialogContent className="bg-card border-border max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-3">
              {selectedAgent && (
                <>
                  <Avatar className="h-8 w-8 border-2 border-primary/30">
                    <AvatarImage src={selectedAgent.profile_pic_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {selectedAgent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedAgent.name}'s Members</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    ({selectedAgent.ref_number})
                  </span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto space-y-6">
            {loadingCustomers ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : agentCustomers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No members registered by this agent yet.
              </div>
            ) : (
              <>
                {/* Gender Distribution Pie Chart */}
                {agentCustomersGenderData.length > 0 && (
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <BarChart3 size={16} className="text-primary" />
                      Member Gender Distribution
                    </h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={agentCustomersGenderData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {agentCustomersGenderData.map((entry, index) => (
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

                {/* Members Table */}
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="text-muted-foreground">Name</TableHead>
                      <TableHead className="text-muted-foreground">Gender</TableHead>
                      <TableHead className="text-muted-foreground">Phone</TableHead>
                      <TableHead className="text-muted-foreground">Email</TableHead>
                      <TableHead className="text-muted-foreground">Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentCustomers.map(customer => (
                      <TableRow key={customer.id} className="border-border hover:bg-secondary/50">
                        <TableCell className="font-medium">
                          {customer.name} {customer.surname || ''}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{customer.gender || '-'}</TableCell>
                        <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                        <TableCell className="text-muted-foreground">{customer.email || '-'}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(customer.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Member Details Modal */}
      <Dialog open={memberModalOpen} onOpenChange={setMemberModalOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <span>{selectedMember?.name} {selectedMember?.surname}</span>
                <p className="text-sm text-muted-foreground font-normal">Member Details</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedMember && (
            <div className="flex-1 overflow-auto space-y-6 py-4">
              {/* Personal Information */}
              <div className="bg-secondary/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">First Name</p>
                    <p className="text-foreground font-medium">{selectedMember.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Surname</p>
                    <p className="text-foreground font-medium">{selectedMember.surname}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">ID Number</p>
                    <p className="text-foreground font-medium font-mono">{selectedMember.id_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Gender</p>
                    <p className="text-foreground font-medium">{selectedMember.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Date of Birth</p>
                    <p className="text-foreground font-medium">
                      {selectedMember.date_of_birth ? new Date(selectedMember.date_of_birth).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-secondary/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield size={16} className="text-primary" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone Number</p>
                    <p className="text-foreground font-medium">{selectedMember.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Email Address</p>
                    <p className="text-foreground font-medium">{selectedMember.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Address</p>
                    <p className="text-foreground font-medium">{selectedMember.address || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">City</p>
                    <p className="text-foreground font-medium">{selectedMember.city || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Registration Information */}
              <div className="bg-secondary/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <PieChartIcon size={16} className="text-primary" />
                  Registration Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">How They Heard About Us</p>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
                      {selectedMember.referral_source}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Registration Date</p>
                    <p className="text-foreground font-medium">
                      {new Date(selectedMember.created_at).toLocaleDateString()} at {new Date(selectedMember.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
