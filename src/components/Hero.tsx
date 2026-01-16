import SplitText from './SplitText';
import LiquidEther from './LiquidEther';
import CurveDecoration from './CurveDecoration';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Liquid Ether Background */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={120}
          resolution={0.5}
          autoDemo={true}
          autoSpeed={0.4}
          autoIntensity={2.5}
        />
      </div>

      {/* Curved decoration */}
      <CurveDecoration className="absolute bottom-0 left-0 right-0 z-10" />

      {/* Hero Content */}
      <div className="relative z-20 container mx-auto px-6 md:px-12 text-center">
        <div className="max-w-5xl mx-auto">
          <SplitText
            text="Beyond Visions Within Reach"
            tag="h1"
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-foreground leading-[1.1]"
            splitType="chars"
            delay={30}
            duration={1}
            ease="power3.out"
            from={{ opacity: 0, y: 60, rotateX: -45 }}
            to={{ opacity: 1, y: 0, rotateX: 0 }}
          />
          
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            We craft digital experiences that transcend imagination and bring bold ideas to life.
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: '1.5s' }}>
            <Button 
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-base border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300 group"
            >
              <span className="mr-2 inline-block w-2 h-2 rounded-full bg-accent group-hover:bg-background transition-colors" />
              About Us
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-0 animate-fade-in" style={{ animationDelay: '2s' }}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
