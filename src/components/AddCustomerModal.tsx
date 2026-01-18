import { useState } from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import PhotoUpload from '@/components/PhotoUpload';
import { addCustomer } from '@/lib/customerStorage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, MapPin, UserPlus, Users } from 'lucide-react';

const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  surname: z.string().min(2, 'Surname is required').max(50),
  phone: z.string().regex(/^[\d\s\-+()]{10,20}$/, 'Invalid phone number'),
  idNumber: z.string().min(5, 'ID number is required').max(20),
  idPhoto: z.string().min(1, 'ID photo is required'),
  passportPhoto: z.string().min(1, 'Passport sized photo is required'),
  passportNumber: z.string().optional(),
  email: z.string().email('Invalid email address'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(5, 'Address is required').max(200),
  city: z.string().min(2, 'City is required').max(100),
  referralSource: z.string().min(1, 'Please select referral source'),
  agentName: z.string().optional(),
  agentPhone: z.string().optional(),
  beneficiaryName: z.string().min(2, 'Beneficiary name is required').max(100),
  beneficiaryIdNumber: z.string().min(5, 'Beneficiary ID is required').max(20),
  beneficiaryAddress: z.string().min(5, 'Beneficiary address is required').max(200),
  beneficiaryPhone: z.string().regex(/^[\d\s\-+()]{10,20}$/, 'Invalid beneficiary phone'),
});

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCustomerModal = ({ open, onClose, onSuccess }: AddCustomerModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    phone: '',
    idNumber: '',
    idPhoto: '',
    passportPhoto: '',
    passportNumber: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    city: '',
    referralSource: '',
    agentName: '',
    agentPhone: '',
    beneficiaryName: '',
    beneficiaryIdNumber: '',
    beneficiaryAddress: '',
    beneficiaryPhone: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      surname: '',
      phone: '',
      idNumber: '',
      idPhoto: '',
      passportPhoto: '',
      passportNumber: '',
      email: '',
      gender: '',
      dateOfBirth: '',
      address: '',
      city: '',
      referralSource: '',
      agentName: '',
      agentPhone: '',
      beneficiaryName: '',
      beneficiaryIdNumber: '',
      beneficiaryAddress: '',
      beneficiaryPhone: '',
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = registrationSchema.parse(formData);
      
      if (validatedData.passportNumber && validatedData.passportNumber.length > 0 && validatedData.passportNumber.length < 6) {
        setErrors({ passportNumber: 'Passport number must be at least 6 characters if provided' });
        setIsSubmitting(false);
        return;
      }

      // Generate a default username from email and random suffix for agent-added customers
      const defaultUsername = validatedData.email.split('@')[0] + Math.floor(Math.random() * 1000);
      
      const result = addCustomer({
        firstName: validatedData.firstName,
        surname: validatedData.surname,
        phone: validatedData.phone,
        idNumber: validatedData.idNumber,
        idPhoto: validatedData.idPhoto,
        passportPhoto: validatedData.passportPhoto,
        passportNumber: validatedData.passportNumber || '',
        email: validatedData.email,
        gender: validatedData.gender,
        dateOfBirth: validatedData.dateOfBirth,
        address: validatedData.address,
        city: validatedData.city,
        referralSource: validatedData.referralSource,
        agentName: validatedData.agentName || '',
        agentPhone: validatedData.agentPhone || '',
        beneficiaryName: validatedData.beneficiaryName,
        beneficiaryIdNumber: validatedData.beneficiaryIdNumber,
        beneficiaryAddress: validatedData.beneficiaryAddress,
        beneficiaryPhone: validatedData.beneficiaryPhone,
        username: defaultUsername,
        passwordHash: '', // Agent-added customers will need to set password later
      });
      
      if (result.success) {
        toast({
          title: 'Customer Added',
          description: `${validatedData.firstName} ${validatedData.surname} has been registered successfully.`,
        });
        resetForm();
        onSuccess();
        onClose();
      } else {
        toast({
          title: 'Registration Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl gold-text">
            Add New Customer
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <User size={18} />
              <h3 className="font-medium">Personal Information</h3>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  First Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.firstName}
                  onChange={e => updateField('firstName', e.target.value)}
                  placeholder="First name"
                  className={errors.firstName ? 'border-destructive' : ''}
                />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Surname <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.surname}
                  onChange={e => updateField('surname', e.target.value)}
                  placeholder="Surname"
                  className={errors.surname ? 'border-destructive' : ''}
                />
                {errors.surname && <p className="text-xs text-destructive">{errors.surname}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  ID Number <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.idNumber}
                  onChange={e => updateField('idNumber', e.target.value)}
                  placeholder="National ID"
                  className={errors.idNumber ? 'border-destructive' : ''}
                />
                {errors.idNumber && <p className="text-xs text-destructive">{errors.idNumber}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Passport Number <span className="text-muted-foreground text-xs">(Optional)</span>
                </label>
                <Input
                  value={formData.passportNumber}
                  onChange={e => updateField('passportNumber', e.target.value)}
                  placeholder="Leave blank if none"
                  className={errors.passportNumber ? 'border-destructive' : ''}
                />
                {errors.passportNumber && <p className="text-xs text-destructive">{errors.passportNumber}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Contact (WhatsApp) <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  placeholder="+263 7XX XXX XXX"
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Email <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="email@example.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Gender <span className="text-destructive">*</span>
                </label>
                <Select value={formData.gender} onValueChange={(value) => updateField('gender', value)}>
                  <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Date of Birth <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={e => updateField('dateOfBirth', e.target.value)}
                  className={errors.dateOfBirth ? 'border-destructive' : ''}
                />
                {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-primary">
              <MapPin size={18} />
              <h3 className="font-medium">Address Details</h3>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Address <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.address}
                  onChange={e => updateField('address', e.target.value)}
                  placeholder="123 Main Street"
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  City <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.city}
                  onChange={e => updateField('city', e.target.value)}
                  placeholder="Harare"
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
              </div>
            </div>
          </div>

          {/* Referral Source */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-primary">
              <UserPlus size={18} />
              <h3 className="font-medium">Referral Information</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                How did they hear about us? <span className="text-destructive">*</span>
              </label>
              <Select value={formData.referralSource} onValueChange={(value) => updateField('referralSource', value)}>
                <SelectTrigger className={errors.referralSource ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="word_of_mouth">Word of Mouth</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp Marketing</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
              {errors.referralSource && <p className="text-xs text-destructive">{errors.referralSource}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Agent Name <span className="text-muted-foreground text-xs">(If known)</span>
                </label>
                <Input
                  value={formData.agentName}
                  onChange={e => updateField('agentName', e.target.value)}
                  placeholder="Agent name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Agent Phone <span className="text-muted-foreground text-xs">(If known)</span>
                </label>
                <Input
                  value={formData.agentPhone}
                  onChange={e => updateField('agentPhone', e.target.value)}
                  placeholder="Agent phone"
                />
              </div>
            </div>
          </div>

          {/* Beneficiary */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-primary">
              <Users size={18} />
              <h3 className="font-medium">Beneficiary / Next of Kin</h3>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.beneficiaryName}
                  onChange={e => updateField('beneficiaryName', e.target.value)}
                  placeholder="Beneficiary name"
                  className={errors.beneficiaryName ? 'border-destructive' : ''}
                />
                {errors.beneficiaryName && <p className="text-xs text-destructive">{errors.beneficiaryName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  ID Number <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.beneficiaryIdNumber}
                  onChange={e => updateField('beneficiaryIdNumber', e.target.value)}
                  placeholder="Beneficiary ID"
                  className={errors.beneficiaryIdNumber ? 'border-destructive' : ''}
                />
                {errors.beneficiaryIdNumber && <p className="text-xs text-destructive">{errors.beneficiaryIdNumber}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Address <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.beneficiaryAddress}
                  onChange={e => updateField('beneficiaryAddress', e.target.value)}
                  placeholder="Beneficiary address"
                  className={errors.beneficiaryAddress ? 'border-destructive' : ''}
                />
                {errors.beneficiaryAddress && <p className="text-xs text-destructive">{errors.beneficiaryAddress}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Phone <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.beneficiaryPhone}
                  onChange={e => updateField('beneficiaryPhone', e.target.value)}
                  placeholder="Beneficiary phone"
                  className={errors.beneficiaryPhone ? 'border-destructive' : ''}
                />
                {errors.beneficiaryPhone && <p className="text-xs text-destructive">{errors.beneficiaryPhone}</p>}
              </div>
            </div>
          </div>

          {/* Photo Uploads */}
          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
            <PhotoUpload
              label="ID Photo"
              value={formData.idPhoto}
              onChange={value => updateField('idPhoto', value)}
              maxSizeMB={5}
              required
              error={errors.idPhoto}
            />
            <PhotoUpload
              label="Passport Photo"
              value={formData.passportPhoto}
              onChange={value => updateField('passportPhoto', value)}
              maxSizeMB={2}
              required
              error={errors.passportPhoto}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="gold" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Adding...' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerModal;
