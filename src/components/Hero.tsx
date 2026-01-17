import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from './SplitText';
import CurveDecoration from './CurveDecoration';
import { Button } from '@/components/ui/button';
import '@fontsource/jetbrains-mono';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Parallax effect on hero content - moves up slower than scroll
    gsap.to(contentRef.current, {
      y: -150,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });

    // Curve decoration parallax - moves up faster for depth
    gsap.to(curveRef.current, {
      y: -80,
      scale: 1.1,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'center center',
        end: 'bottom top',
        scrub: 0.3,
      },
    });

    // Fade out scroll indicator quickly
    gsap.to(scrollIndicatorRef.current, {
      opacity: 0,
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '20% top',
        scrub: true,
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Curved decoration with parallax */}
      <div ref={curveRef} className="absolute bottom-0 left-0 right-0 z-10 translate-y-1/2 will-change-transform">
        <CurveDecoration />
      </div>
      
      {/* Subtle bottom fade - minimal to avoid visible border */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent z-[5] pointer-events-none" />

      {/* Hero Content with parallax */}
      <div ref={contentRef} className="relative z-20 container mx-auto px-6 md:px-12 text-center will-change-transform">
        <div className="max-w-5xl mx-auto">
          <SplitText
            text="Beyond Networks. Beyond Control."
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
            An offline-first, encrypted messaging network that works when the internet doesn't.
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: '1.5s' }}>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                document.getElementById("about")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="rounded-full px-8 py-6 text-base border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300 group"
            >
              <span className="mr-2 inline-block w-2 h-2 rounded-full bg-accent group-hover:bg-background transition-colors" />
              About Us
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator with fade */}
      <div ref={scrollIndicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-0 animate-fade-in will-change-transform" style={{ animationDelay: '2s' }}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
