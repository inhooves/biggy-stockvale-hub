import { Customer } from '@/lib/customerStorage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, MapPin, Phone, CreditCard, Fingerprint, Users, User } from 'lucide-react';

interface CustomerDetailsModalProps {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
}

const CustomerDetailsModal = ({ customer, open, onClose }: CustomerDetailsModalProps) => {
  if (!customer) return null;

  const fullName = `${customer.firstName} ${customer.surname}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl gold-text">
            Customer Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Info */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-primary shrink-0">
              <img 
                src={customer.passportPhoto} 
                alt={fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{fullName}</h3>
              <Badge variant="outline" className="mt-1 border-primary text-primary">
                ID: {customer.idNumber}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                Joined: {new Date(customer.dateJoined).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
              <Phone size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Phone (WhatsApp)</p>
                <p className="text-sm font-medium">{customer.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
              <Mail size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium break-all">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
              <Calendar size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Date of Birth</p>
                <p className="text-sm font-medium">{customer.dateOfBirth}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
              <User size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Gender</p>
                <p className="text-sm font-medium capitalize">{customer.gender}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-secondary rounded-lg p-3 sm:col-span-2">
              <MapPin size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium">{customer.address}, {customer.city}</p>
              </div>
            </div>
          </div>

          {/* ID Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
              <Fingerprint size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">ID Number</p>
                <p className="text-sm font-medium font-mono">{customer.idNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
              <CreditCard size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Passport Number</p>
                <p className="text-sm font-medium font-mono">
                  {customer.passportNumber || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Referral Info */}
          {customer.referralSource && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Referral Information</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">How they heard about us</p>
                  <p className="text-sm font-medium capitalize">{customer.referralSource.replace('_', ' ')}</p>
                </div>
                {customer.agentName && (
                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Recruiting Agent</p>
                    <p className="text-sm font-medium">{customer.agentName}</p>
                    {customer.agentPhone && <p className="text-xs text-muted-foreground">{customer.agentPhone}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Beneficiary Info */}
          {customer.beneficiaryName && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-primary" />
                <h4 className="text-sm font-medium text-foreground">Beneficiary / Next of Kin</h4>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{customer.beneficiaryName}</p>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">ID Number</p>
                  <p className="text-sm font-medium font-mono">{customer.beneficiaryIdNumber}</p>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{customer.beneficiaryPhone}</p>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-medium">{customer.beneficiaryAddress}</p>
                </div>
              </div>
            </div>
          )}

          {/* Photos */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Uploaded Documents</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">ID Photo</p>
                <div className="rounded-xl overflow-hidden border border-border">
                  <img 
                    src={customer.idPhoto} 
                    alt="ID Document"
                    className="w-full h-auto max-h-64 object-contain bg-secondary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Passport Photo</p>
                <div className="rounded-xl overflow-hidden border border-border">
                  <img 
                    src={customer.passportPhoto} 
                    alt="Passport Photo"
                    className="w-full h-auto max-h-64 object-contain bg-secondary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsModal;
