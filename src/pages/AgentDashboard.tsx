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
  Plus, 
  Search, 
  Loader2,
  UserCircle,
  Hash,
  Phone,
  Mail,
  Eye
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  ref_number: string;
  profile_pic_url: string | null;
  customers_count: number;
}

interface AgentCustomer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  created_at: string;
}

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [customers, setCustomers] = useState<AgentCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add Member Modal
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    referral_source: 'Agent',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View member details
  const [viewingCustomer, setViewingCustomer] = useState<AgentCustomer | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

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
      c.phone.includes(query) ||
      c.email?.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/agent');
  };

  const openAddModal = () => {
    setCustomerForm({ name: '', phone: '', email: '', address: '', referral_source: 'Agent' });
    setCustomerModalOpen(true);
  };

  const openViewModal = (customer: AgentCustomer) => {
    setViewingCustomer(customer);
    setViewModalOpen(true);
  };

  const handleSubmitCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('agent_customers')
        .insert({
          agent_id: agent.id,
          name: customerForm.name,
          phone: customerForm.phone,
          email: customerForm.email || null,
          address: customerForm.address || null,
          referral_source: 'Agent',
          recruited_by_agent_id: agent.id,
        });

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
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Agent Profile Card */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 mb-8 animate-fade-in">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <UserCircle size={20} className="text-primary" />
            Agent Profile
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

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-slide-up">
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
                  <TableHead className="text-muted-foreground">Phone</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Address</TableHead>
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
                      <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.email || '-'}</TableCell>
                      <TableCell className="text-muted-foreground max-w-40 truncate">{customer.address || '-'}</TableCell>
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
      </main>

      {/* Add Member Modal */}
      <Dialog open={customerModalOpen} onOpenChange={setCustomerModalOpen}>
        <DialogContent className="bg-card border-border">
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
                placeholder="Member name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone *</label>
              <Input
                value={customerForm.phone}
                onChange={e => setCustomerForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+263..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                value={customerForm.email}
                onChange={e => setCustomerForm(f => ({ ...f, email: e.target.value }))}
                placeholder="member@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Address</label>
              <Input
                value={customerForm.address}
                onChange={e => setCustomerForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Member address"
              />
            </div>
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
        <DialogContent className="bg-card border-border">
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
                  <h3 className="font-semibold text-lg text-foreground">{viewingCustomer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Registered on {new Date(viewingCustomer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{viewingCustomer.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{viewingCustomer.email || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <UserCircle size={18} className="text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="font-medium text-foreground">{viewingCustomer.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
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
