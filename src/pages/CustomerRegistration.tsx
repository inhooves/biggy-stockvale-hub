import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import PhotoUpload from '@/components/PhotoUpload';
import { addCustomer } from '@/lib/customerStorage';
import { ArrowLeft, CheckCircle, Shield, User, MapPin, Users, UserPlus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  surname: z.string().min(2, 'Surname is required').max(50),
  phone: z.string().regex(/^[\d\s\-+()]{10,20}$/, 'Invalid phone number'),
  idNumber: z.string().min(5, 'ID number is required').max(20),
  idPhoto: z.string().min(1, 'ID photo is required'),
  passportPhoto: z.string().optional(),
  passportNumber: z.string().optional(),
  email: z.string().email('Invalid email address'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(5, 'Address is required').max(200),
  city: z.string().min(2, 'City is required').max(100),
  referralSource: z.string().min(1, 'Please select how you heard about us'),
  agentName: z.string().optional(),
  agentPhone: z.string().optional(),
  beneficiaryName: z.string().min(2, 'Beneficiary name is required').max(100),
  beneficiaryIdNumber: z.string().min(5, 'Beneficiary ID number is required').max(20),
  beneficiaryAddress: z.string().min(5, 'Beneficiary address is required').max(200),
  beneficiaryPhone: z.string().regex(/^[\d\s\-+()]{10,20}$/, 'Invalid beneficiary phone number'),
});

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredId, setRegisteredId] = useState('');
  
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
        firstName: validatedData.firstName,
        surname: validatedData.surname,
        phone: validatedData.phone,
        idNumber: validatedData.idNumber,
        idPhoto: validatedData.idPhoto,
        passportPhoto: validatedData.passportPhoto || '',
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
        toast({
          title: 'Validation Error',
          description: 'Please check all required fields',
          variant: 'destructive',
        });
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
              Your Groceries Stockvale account has been created successfully. Registration is FREE!
            </p>
            <div className="bg-secondary rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground">Your Account ID</p>
              <p className="text-xl font-mono font-bold text-foreground">{registeredId}</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <p className="text-sm text-primary">
                Note: A once-off initiation fee of USD $3 will be required when you start contributing.
              </p>
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
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold gold-text mb-2">
            Member Registration
          </h1>
          <p className="text-muted-foreground">
            Join Biggy Round Stokvel Community - Registration is FREE!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
          {/* Personal Information Section */}
          <div className="bg-card rounded-2xl p-6 card-elevated border border-border space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-primary" size={20} />
              <h2 className="font-semibold text-lg">Personal Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  First Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.firstName}
                  onChange={e => updateField('firstName', e.target.value)}
                  placeholder="Enter your first name"
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
                  placeholder="Enter your surname"
                  className={errors.surname ? 'border-destructive' : ''}
                />
                {errors.surname && <p className="text-xs text-destructive">{errors.surname}</p>}
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
                  placeholder="Your national ID number"
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
                  Contact Number (WhatsApp) <span className="text-destructive">*</span>
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
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
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

          {/* Address Section */}
          <div className="bg-card rounded-2xl p-6 card-elevated border border-border space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-primary" size={20} />
              <h2 className="font-semibold text-lg">Address Details</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Physical Address <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.address}
                  onChange={e => updateField('address', e.target.value)}
                  placeholder="123 Main Street, Suburb"
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
                  placeholder="Harare, Bulawayo, etc."
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
              </div>
            </div>
          </div>

          {/* Referral Section */}
          <div className="bg-card rounded-2xl p-6 card-elevated border border-border space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="text-primary" size={20} />
              <h2 className="font-semibold text-lg">How Did You Hear About Us?</h2>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Referral Source <span className="text-destructive">*</span>
              </label>
              <Select value={formData.referralSource} onValueChange={(value) => updateField('referralSource', value)}>
                <SelectTrigger className={errors.referralSource ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select how you heard about Biggy Round" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="word_of_mouth">Word of Mouth</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp Digital Marketing</SelectItem>
                  <SelectItem value="website">Biggy Round Website</SelectItem>
                  <SelectItem value="facebook">Biggy Round Facebook</SelectItem>
                </SelectContent>
              </Select>
              {errors.referralSource && <p className="text-xs text-destructive">{errors.referralSource}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Agent Name <span className="text-muted-foreground text-xs">(If known)</span>
                </label>
                <Input
                  value={formData.agentName}
                  onChange={e => updateField('agentName', e.target.value)}
                  placeholder="Name of agent who recruited you"
                  className={errors.agentName ? 'border-destructive' : ''}
                />
                {errors.agentName && <p className="text-xs text-destructive">{errors.agentName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Agent Contact Number <span className="text-muted-foreground text-xs">(If known)</span>
                </label>
                <Input
                  value={formData.agentPhone}
                  onChange={e => updateField('agentPhone', e.target.value)}
                  placeholder="Agent's phone number"
                  className={errors.agentPhone ? 'border-destructive' : ''}
                />
                {errors.agentPhone && <p className="text-xs text-destructive">{errors.agentPhone}</p>}
              </div>
            </div>
          </div>

          {/* Beneficiary Section */}
          <div className="bg-card rounded-2xl p-6 card-elevated border border-border space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-primary" size={20} />
              <h2 className="font-semibold text-lg">Beneficiary / Next of Kin</h2>
            </div>
            <p className="text-sm text-muted-foreground -mt-2 mb-4">
              This person will receive the funeral aid cover (USD $500) upon your death if applicable.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.beneficiaryName}
                  onChange={e => updateField('beneficiaryName', e.target.value)}
                  placeholder="Beneficiary's full name"
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
                  placeholder="Beneficiary's ID number"
                  className={errors.beneficiaryIdNumber ? 'border-destructive' : ''}
                />
                {errors.beneficiaryIdNumber && <p className="text-xs text-destructive">{errors.beneficiaryIdNumber}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Physical Address <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.beneficiaryAddress}
                  onChange={e => updateField('beneficiaryAddress', e.target.value)}
                  placeholder="Beneficiary's physical address"
                  className={errors.beneficiaryAddress ? 'border-destructive' : ''}
                />
                {errors.beneficiaryAddress && <p className="text-xs text-destructive">{errors.beneficiaryAddress}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.beneficiaryPhone}
                  onChange={e => updateField('beneficiaryPhone', e.target.value)}
                  placeholder="+263 7XX XXX XXX"
                  className={errors.beneficiaryPhone ? 'border-destructive' : ''}
                />
                {errors.beneficiaryPhone && <p className="text-xs text-destructive">{errors.beneficiaryPhone}</p>}
              </div>
            </div>
          </div>

          {/* Photo Uploads */}
          <div className="bg-card rounded-2xl p-6 card-elevated border border-border space-y-5">
            <h2 className="font-semibold text-lg mb-4">Document Uploads</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <PhotoUpload
                label="ID Photo"
                value={formData.idPhoto}
                onChange={value => updateField('idPhoto', value)}
                maxSizeMB={15}
                required
                error={errors.idPhoto}
              />
              <PhotoUpload
                label="Passport Sized Photo"
                value={formData.passportPhoto}
                onChange={value => updateField('passportPhoto', value)}
                maxSizeMB={15}
                required={false}
                error={errors.passportPhoto}
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-3 bg-secondary/50 rounded-lg p-4">
            <Shield size={20} className="text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Your data is securely stored and protected. We comply with data protection regulations 
              and never share your personal information with third parties. Registration is FREE - 
              contributions will only be required after registration.
            </p>
          </div>

          <Button 
            type="submit" 
            variant="gold" 
            size="lg" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Complete Registration (FREE)'}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default CustomerRegistration;
