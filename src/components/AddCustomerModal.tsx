import { useState } from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import PhotoUpload from '@/components/PhotoUpload';
import { addCustomer } from '@/lib/customerStorage';

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100),
  phone: z.string().regex(/^[\d\s\-+()]{10,20}$/, 'Invalid phone number'),
  idNumber: z.string().min(5, 'ID number is required').max(20),
  idPhoto: z.string().min(1, 'ID photo is required'),
  passportPhoto: z.string().min(1, 'Passport sized photo is required'),
  passportNumber: z.string().optional(),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(5, 'Address is required').max(200),
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
    fullName: '',
    phone: '',
    idNumber: '',
    idPhoto: '',
    passportPhoto: '',
    passportNumber: '',
    email: '',
    dateOfBirth: '',
    address: '',
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
      fullName: '',
      phone: '',
      idNumber: '',
      idPhoto: '',
      passportPhoto: '',
      passportNumber: '',
      email: '',
      dateOfBirth: '',
      address: '',
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

      const result = addCustomer({
        fullName: validatedData.fullName,
        phone: validatedData.phone,
        idNumber: validatedData.idNumber,
        idPhoto: validatedData.idPhoto,
        passportPhoto: validatedData.passportPhoto,
        passportNumber: validatedData.passportNumber || '',
        email: validatedData.email,
        dateOfBirth: validatedData.dateOfBirth,
        address: validatedData.address,
      });
      
      if (result.success) {
        toast({
          title: 'Customer Added',
          description: `${validatedData.fullName} has been registered successfully.`,
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
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl gold-text">
            Add New Customer
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.fullName}
                onChange={e => updateField('fullName', e.target.value)}
                placeholder="John Doe"
                className={errors.fullName ? 'border-destructive' : ''}
              />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Phone <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.phone}
                onChange={e => updateField('phone', e.target.value)}
                placeholder="+1 234 567 8900"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
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
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={e => updateField('email', e.target.value)}
                placeholder="john@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
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

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Address <span className="text-destructive">*</span>
            </label>
            <Input
              value={formData.address}
              onChange={e => updateField('address', e.target.value)}
              placeholder="123 Main Street, City"
              className={errors.address ? 'border-destructive' : ''}
            />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>

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
