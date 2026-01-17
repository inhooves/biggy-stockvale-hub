import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
  LogOut, 
  Users, 
  UserCheck, 
  Search, 
  Eye, 
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  ref_number: string;
  profile_pic_url: string | null;
  customers_count: number;
  created_at: string;
}

interface AgentCustomer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  created_at: string;
}

const AgentsAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // View customers modal
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentCustomers, setAgentCustomers] = useState<AgentCustomer[]>([]);
  const [customersModalOpen, setCustomersModalOpen] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Check admin role using proper Supabase auth
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
        description: 'Failed to load agents.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAgents();
    }
  }, [isAdmin]);

  // Real-time subscription
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('agents-admin-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agents' },
        () => fetchAgents()
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
      a.ref_number.toLowerCase().includes(query) ||
      a.email.toLowerCase().includes(query)
    );
  }, [agents, searchQuery]);

  const totalCustomers = useMemo(() => {
    return agents.reduce((sum, a) => sum + a.customers_count, 0);
  }, [agents]);

  const handleViewCustomers = async (agent: Agent) => {
    setSelectedAgent(agent);
    setCustomersModalOpen(true);
    setLoadingCustomers(true);

    try {
      const { data, error } = await supabase
        .from('agent_customers')
        .select('*')
        .eq('agent_id', agent.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgentCustomers(data || []);
    } catch (error: any) {
      console.error('Error fetching agent customers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customers.',
        variant: 'destructive',
      });
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/admin');
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
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} />
                Back to Customers
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Agents Management</h1>
          <p className="text-muted-foreground">Monitor all registered agents and their customers</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8 animate-fade-in">
          <StatsCard
            title="Total Agents"
            value={agents.length}
            icon={UserCheck}
          />
          <StatsCard
            title="Total Customers (via Agents)"
            value={totalCustomers}
            icon={Users}
          />
        </div>

        {/* Search */}
        <div className="mb-6 animate-slide-up">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search agents by name, ref#, or email..."
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
                  <TableHead className="text-muted-foreground">Ref #</TableHead>
                  <TableHead className="text-muted-foreground">Phone</TableHead>
                  <TableHead className="text-muted-foreground">Customers</TableHead>
                  <TableHead className="text-muted-foreground">Joined</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      {searchQuery ? 'No agents match your search.' : 'No agents registered yet.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAgents.map(agent => (
                    <TableRow key={agent.id} className="border-border hover:bg-secondary/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage src={agent.profile_pic_url || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {agent.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{agent.name}</p>
                            <p className="text-xs text-muted-foreground">{agent.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-primary">{agent.ref_number}</TableCell>
                      <TableCell className="text-muted-foreground">{agent.phone}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          <Users size={14} />
                          {agent.customers_count}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(agent.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewCustomers(agent)}
                        >
                          <Eye size={16} className="text-primary" />
                          View Customers
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* View Customers Modal */}
      <Dialog open={customersModalOpen} onOpenChange={setCustomersModalOpen}>
        <DialogContent className="bg-card border-border max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-3">
              {selectedAgent && (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedAgent.profile_pic_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedAgent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span>{selectedAgent.name}'s Customers</span>
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({selectedAgent.ref_number})
                    </span>
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            {loadingCustomers ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : agentCustomers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                This agent has no customers yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Phone</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Address</TableHead>
                    <TableHead className="text-muted-foreground">Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentCustomers.map(customer => (
                    <TableRow key={customer.id} className="border-border">
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.email || '-'}</TableCell>
                      <TableCell className="text-muted-foreground max-w-32 truncate">{customer.address || '-'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentsAdmin;