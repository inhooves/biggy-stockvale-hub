import biggyLogo from '@/assets/biggy-logo.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ size = 'md' }: LogoProps) => {
  // Sizes increased by 1.75x: sm: 92*1.75=161, md: 132*1.75=231, lg: 185*1.75=324
  const sizeClasses = {
    sm: 'h-[161px]',
    md: 'h-[231px]',
    lg: 'h-[324px]',
  };

  return (
    <div className="flex items-center justify-start">
      <img 
        src={biggyLogo} 
        alt="Biggy Round Logo" 
        className={`${sizeClasses[size]} w-auto object-contain brightness-0 invert dark:brightness-0 dark:invert`}
      />
    </div>
  );
};

export default Logo;