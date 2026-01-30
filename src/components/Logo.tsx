import biggyLogo from '@/assets/biggy-logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ size = 'md' }: LogoProps) => {
  // Sizes: sm for nav header, md/lg for hero display
  const sizeClasses = {
    sm: 'h-[86px]',
    md: 'h-[252px]',
    lg: 'h-[342px]',
  };

  return (
    <div className="flex items-center justify-start">
      <img 
        src={biggyLogo} 
        alt="Biggy Round Logo" 
        className={`${sizeClasses[size]} w-auto object-contain animate-logo-glow`}
        style={{
          mixBlendMode: 'screen',
        }}
      />
      <style>{`
        @keyframes logo-glow {
          0%, 100% {
            filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.4)) drop-shadow(0 0 24px rgba(139, 92, 246, 0.2));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 40px rgba(139, 92, 246, 0.3));
          }
        }
        .animate-logo-glow {
          animation: logo-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Logo;