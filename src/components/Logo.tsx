import biggyLogo from '@/assets/biggy-logo.png';

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
    <div className="flex items-center justify-start overflow-hidden">
      <img 
        src={biggyLogo} 
        alt="Biggy Round Logo" 
        className={`${sizeClasses[size]} w-auto object-cover`}
        style={{
          transform: 'scale(1.4)',
          transformOrigin: 'center center',
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.4)) drop-shadow(0 0 24px rgba(139, 92, 246, 0.2))'
        }}
      />
    </div>
  );
};

export default Logo;