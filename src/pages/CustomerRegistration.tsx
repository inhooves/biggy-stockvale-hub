import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import PhotoUpload from '@/components/PhotoUpload';
import { addCustomer } from '@/lib/customerStorage';
import { ArrowLeft, CheckCircle, Shield } from 'lucide-react';

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

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredId, setRegisteredId] = useState('');
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = registrationSchema.parse(formData);
      
      // Validate passport number format if provided
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
      
      if (result.success && result.customer) {
        setRegisteredId(result.customer.idNumber);
        setShowSuccess(true);
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

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center animate-scale-in">
          <div className="bg-card rounded-2xl p-8 card-elevated border border-border">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center animate-pulse-gold">
              <CheckCircle size={48} className="text-success" />
            </div>
            <h2 className="font-display text-2xl font-bold gold-text mb-2">
              Welcome to Biggy Round!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your Groceries Stockvale account has been created successfully.
            </p>
            <div className="bg-secondary rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">Your Account ID</p>
              <p className="text-xl font-mono font-bold text-foreground">{registeredId}</p>
            </div>
            <Button variant="gold" size="lg" onClick={() => navigate('/')} className="w-full">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            Back
          </Button>
          <Logo size="sm" />
          <div className="w-20" />
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold gold-text mb-2">
            Customer Registration
          </h1>
          <p className="text-muted-foreground">
            Join Biggy Round Groceries Stockvale today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
          <div className="bg-card rounded-2xl p-6 card-elevated border border-border space-y-5">
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-5">
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
                  Phone Number <span className="text-destructive">*</span>
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

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  ID Number <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.idNumber}
                  onChange={e => updateField('idNumber', e.target.value)}
                  placeholder="Your national ID"
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

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Email Address <span className="text-destructive">*</span>
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
                placeholder="123 Main Street, City, Country"
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>

            {/* Photo Uploads */}
            <div className="grid md:grid-cols-2 gap-5 pt-4 border-t border-border">
              <PhotoUpload
                label="ID Photo"
                value={formData.idPhoto}
                onChange={value => updateField('idPhoto', value)}
                maxSizeMB={5}
                required
                error={errors.idPhoto}
              />
              <PhotoUpload
                label="Passport Sized Photo"
                value={formData.passportPhoto}
                onChange={value => updateField('passportPhoto', value)}
                maxSizeMB={2}
                required
                error={errors.passportPhoto}
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-3 bg-secondary/50 rounded-lg p-4">
            <Shield size={20} className="text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Your data is securely stored and protected. We comply with data protection regulations 
              and never share your personal information with third parties.
            </p>
          </div>

          <Button 
            type="submit" 
            variant="gold" 
            size="lg" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Complete Registration'}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default CustomerRegistration;
