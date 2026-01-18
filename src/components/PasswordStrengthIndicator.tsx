import { Check, X } from 'lucide-react';
import { getPasswordRequirements } from '@/lib/passwordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const requirements = getPasswordRequirements();
  
  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs text-muted-foreground font-medium mb-1">Password requirements:</p>
      {requirements.map((req, index) => {
        const isMet = req.regex.test(password);
        return (
          <div key={index} className="flex items-center gap-2 text-xs">
            {isMet ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-destructive" />
            )}
            <span className={isMet ? 'text-green-600' : 'text-muted-foreground'}>
              {req.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordStrengthIndicator;
