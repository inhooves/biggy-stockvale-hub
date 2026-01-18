import biggyLogo from '@/assets/biggy-logo.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-[92px]',
    md: 'h-[132px]',
    lg: 'h-[185px]',
  };

  return (
    <div className="flex items-center">
      <img 
        src={biggyLogo} 
        alt="Biggy Round Logo" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </div>
  );
};

export default Logo;