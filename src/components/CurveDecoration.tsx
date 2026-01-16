import { cn } from '@/lib/utils';

interface CurveDecorationProps {
  className?: string;
}

const CurveDecoration = ({ className }: CurveDecorationProps) => {
  return (
    <div className={cn("pointer-events-none", className)}>
      <svg
        viewBox="0 0 1440 320"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--curve-start))" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(var(--curve-end))" stopOpacity="0.7" />
          </linearGradient>
          <filter id="curveBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          </filter>
        </defs>
        
        {/* Main curve with blur effect */}
        <path
          fill="none"
          stroke="url(#curveGradient)"
          strokeWidth="80"
          filter="url(#curveBlur)"
          d="M0,160 C180,280 360,80 540,160 C720,240 900,60 1080,140 C1260,220 1440,120 1440,120"
          opacity="0.6"
        />
        
        {/* Secondary sharper curve */}
        <path
          fill="none"
          stroke="url(#curveGradient)"
          strokeWidth="4"
          d="M0,180 C200,300 400,100 600,180 C800,260 1000,80 1200,160 C1300,200 1440,140 1440,140"
          opacity="0.4"
        />
      </svg>
    </div>
  );
};

export default CurveDecoration;
