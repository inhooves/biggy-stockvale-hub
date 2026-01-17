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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  Edit, 
  Trash2, 
  Loader2,
  UserCircle,
  Hash,
  AlertTriangle
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
  
  // Add/Edit Customer Modal
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<AgentCustomer | null>(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    referral_source: 'Agent',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<AgentCustomer | null>(null);

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
    setEditingCustomer(null);
    setCustomerForm({ name: '', phone: '', email: '', address: '', referral_source: 'Agent' });
    setCustomerModalOpen(true);
  };

  const openEditModal = (customer: AgentCustomer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || '',
      referral_source: 'Agent',
    });
    setCustomerModalOpen(true);
  };

  const handleSubmitCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;

    setIsSubmitting(true);
    try {
      if (editingCustomer) {
        const { error } = await supabase
          .from('agent_customers')
          .update({
            name: customerForm.name,
            phone: customerForm.phone,
            email: customerForm.email || null,
            address: customerForm.address || null,
          })
          .eq('id', editingCustomer.id);

        if (error) throw error;
        toast({ title: 'Customer Updated', description: 'Customer details have been updated.' });
      } else {
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
        toast({ title: 'Customer Added', description: 'New customer has been added successfully.' });
      }

      setCustomerModalOpen(false);
      fetchAgentData();
    } catch (error: any) {
      console.error('Error saving customer:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save customer.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (customer: AgentCustomer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;

    try {
      const { error } = await supabase
        .from('agent_customers')
        .delete()
        .eq('id', customerToDelete.id);

      if (error) throw error;

      toast({
        title: 'Customer Deleted',
        description: `${customerToDelete.name} has been removed.`,
      });

      fetchAgentData();
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete customer.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
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
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary/30">
              <AvatarImage src={agent.profile_pic_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {agent.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-display text-2xl font-bold text-foreground">{agent.name}</h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Hash size={14} />
                  {agent.ref_number}
                </span>
                <span className="flex items-center gap-1">
                  <UserCircle size={14} />
                  {agent.email}
                </span>
              </div>
            </div>
            <StatsCard
              title="My Customers"
              value={agent.customers_count}
              icon={Users}
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-slide-up">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="gold" onClick={openAddModal}>
            <Plus size={18} />
            Add Customer
          </Button>
        </div>

        {/* Customers Table */}
        <div className="bg-card rounded-xl border border-border card-elevated overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Phone</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Address</TableHead>
                  <TableHead className="text-muted-foreground">Added</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      {searchQuery ? 'No customers match your search.' : 'No customers yet. Add your first customer!'}
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
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditModal(customer)}
                            title="Edit Customer"
                          >
                            <Edit size={16} className="text-primary" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteClick(customer)}
                            title="Delete Customer"
                          >
                            <Trash2 size={16} className="text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Add/Edit Customer Modal */}
      <Dialog open={customerModalOpen} onOpenChange={setCustomerModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitCustomer} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name *</label>
              <Input
                value={customerForm.name}
                onChange={e => setCustomerForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Customer name"
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
                placeholder="customer@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Address</label>
              <Input
                value={customerForm.address}
                onChange={e => setCustomerForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Customer address"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setCustomerModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
                {editingCustomer ? 'Update' : 'Add'} Customer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="text-destructive" size={20} />
              Delete Customer
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{customerToDelete?.name}</strong>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AgentDashboard;
