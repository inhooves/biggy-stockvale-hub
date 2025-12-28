import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const StatsCard = ({ title, value, icon: Icon, trend, className }: StatsCardProps) => {
  return (
    <div className={cn(
      "bg-card rounded-xl p-5 border border-border card-elevated hover-glow transition-all duration-300",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={cn(
          "p-3 rounded-lg",
          trend === 'up' && "bg-success/20",
          trend === 'down' && "bg-destructive/20",
          !trend && "bg-primary/20"
        )}>
          <Icon 
            size={24} 
            className={cn(
              trend === 'up' && "text-success",
              trend === 'down' && "text-destructive",
              !trend && "text-primary"
            )} 
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
