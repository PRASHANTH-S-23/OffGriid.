import { useEffect, useRef } from "react";
import SplitText from "./SplitText";
import CurveDecoration from "./CurveDecoration";
import { Button } from "@/components/ui/button";
import "@fontsource/jetbrains-mono";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;
    let alive = true;

    const initAnimations = async () => {
      if (!sectionRef.current) return;

      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");

      if (!alive) return;

      const gsap = gsapModule.gsap || gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Hero content parallax
        if (contentRef.current) {
          gsap.to(contentRef.current, {
            y: -150,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          });
        }

        // Curve decoration parallax
        if (curveRef.current) {
          gsap.to(curveRef.current, {
            y: -80,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "center center",
              end: "bottom top",
              scrub: 0.3,
            },
          });
        }

        // Scroll indicator fade
        if (scrollIndicatorRef.current) {
          gsap.to(scrollIndicatorRef.current, {
            opacity: 0,
            y: -30,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "20% top",
              scrub: true,
            },
          });
        }
      }, sectionRef);
    };

    // IMPORTANT: wait until browser is idle (after LCP)
    requestIdleCallback(initAnimations);

    return () => {
      alive = false;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Curve decoration */}
      <div
        ref={curveRef}
        className="absolute bottom-0 left-0 right-0 z-10 translate-y-1/2"
      >
        <CurveDecoration />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent z-[5] pointer-events-none" />

      {/* Hero content */}
      <div
        ref={contentRef}
        className="relative z-20 container mx-auto px-6 md:px-12 text-center"
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
            className="mt-12 flex items-center justify-center gap-4 opacity-0 animate-fade-in"
            style={{ animationDelay: "1.5s" }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="rounded-full px-8 py-6 text-base border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300 group"
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-0 animate-fade-in"
        style={{ animationDelay: "2s" }}
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
