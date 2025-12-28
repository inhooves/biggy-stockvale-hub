import { ShoppingBasket } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  const iconSizes = {
    sm: 24,
    md: 36,
    lg: 56,
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative animate-float">
        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
        <div className="relative bg-gradient-to-br from-primary via-accent to-primary p-2 rounded-xl gold-glow">
          <ShoppingBasket 
            size={iconSizes[size]} 
            className="text-primary-foreground drop-shadow-lg"
            strokeWidth={2.5}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className={`font-display font-bold gold-text text-3d ${sizeClasses[size]}`}>
          Biggy Round
        </h1>
        <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
          Groceries Stockvale
        </span>
      </div>
    </div>
  );
};

export default Logo;
