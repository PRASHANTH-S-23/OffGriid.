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
          {/* Neon OG gradient */}
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FF66" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#00FF88" stopOpacity="1" />
            <stop offset="100%" stopColor="#00CC55" stopOpacity="0.85" />
          </linearGradient>

          {/* Tight neon glow */}
          <filter id="curveGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow base curve */}
        <path
          fill="none"
          stroke="url(#curveGradient)"
          strokeWidth="64"
          filter="url(#curveGlow)"
          d="M0,170 C200,300 400,80 600,170 C800,250 1000,90 1200,160 C1320,210 1440,140 1440,140"
          opacity="0.55"
        />

        {/* Sharp tech line */}
        <path
          fill="none"
          stroke="url(#curveGradient)"
          strokeWidth="3"
          d="M0,190 C220,320 420,110 620,190 C820,270 1020,110 1220,180 C1340,220 1440,160 1440,160"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};

export default CurveDecoration;
