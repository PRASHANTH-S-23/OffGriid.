import { useEffect, useRef, useCallback } from "react";
import SplitText from "./SplitText";
import CurveDecoration from "./CurveDecoration";
import { Button } from "@/components/ui/button";
import "@fontsource/jetbrains-mono";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Memoized scroll handler with RAF batching
  const updateScrollTransforms = useCallback(() => {
    const progress = scrollProgressRef.current;
    
    // Apply transforms directly to DOM for smoother performance
    if (contentRef.current) {
      contentRef.current.style.transform = `translate3d(0, ${progress * -150}px, 0)`;
      contentRef.current.style.opacity = String(Math.max(0, 1 - progress * 1.5));
    }
    
    if (curveRef.current) {
      curveRef.current.style.transform = `translate3d(0, ${progress * -80}px, 0) scale(${1 + progress * 0.1})`;
    }
    
    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.transform = `translate3d(-50%, ${progress * -30}px, 0)`;
      scrollIndicatorRef.current.style.opacity = String(Math.max(0, 1 - progress * 5));
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        rafIdRef.current = requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking = false;
            return;
          }
          
          const rect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // Calculate scroll progress (0 to 1)
          scrollProgressRef.current = Math.max(0, Math.min(1, 1 - (rect.bottom / viewportHeight)));
          updateScrollTransforms();
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [updateScrollTransforms]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden gpu-layer"
    >
      {/* Curve decoration */}
      <div
        ref={curveRef}
        className="absolute bottom-0 left-0 right-0 z-10 translate-y-1/2"
        style={{ 
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden'
        }}
      >
        <CurveDecoration />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent z-[5] pointer-events-none" />

      {/* Hero content */}
      <div
        ref={contentRef}
        className="relative z-20 container mx-auto px-6 md:px-12 text-center"
        style={{ 
          willChange: 'transform, opacity',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="max-w-5xl mx-auto">
          <h1
            className="
              font-light tracking-tight text-foreground leading-[1.1]
              text-[clamp(2.5rem,6vw,5rem)]
            "
          >
            <SplitText
              text="Beyond Networks."
              splitType="chars"
              delay={30}
              duration={1}
              ease="power3.out"
              from={{ opacity: 0, y: 60, rotateX: -45 }}
              to={{ opacity: 1, y: 0, rotateX: 0 }}
            />
            <br />
            <SplitText
              text="Beyond Control."
              splitType="chars"
              delay={30}
              duration={1}
              ease="power3.out"
              from={{ opacity: 0, y: 60, rotateX: -45 }}
              to={{ opacity: 1, y: 0, rotateX: 0 }}
            />
          </h1>

          <p
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in"
            style={{ animationDelay: "1.2s" }}
          >
            An offline-first, encrypted messaging network that works when the
            internet doesn't.
          </p>

          <div
            className="mt-12 flex items-center justify-center gap-4 opacity-0 animate-fade-in relative z-30"
            style={{ animationDelay: "1.5s", animationFillMode: "forwards" }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const aboutSection = document.getElementById("about");
                if (aboutSection) {
                  aboutSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="rounded-full px-8 py-6 text-base border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300 group cursor-pointer"
            >
              <span className="mr-2 inline-block w-2 h-2 rounded-full bg-accent group-hover:bg-background transition-colors" />
              About Us
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 z-20 opacity-0 animate-fade-in"
        style={{ 
          willChange: 'transform, opacity',
          transform: 'translate3d(-50%, 0, 0)',
          backfaceVisibility: 'hidden',
          animationDelay: "2s" 
        }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;