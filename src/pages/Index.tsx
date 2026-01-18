import { useEffect, useState, lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";

// Lazy-loaded components
const Hero = lazy(() => import("@/components/Hero"));
const About = lazy(() => import("@/components/About"));
const Footer = lazy(() => import("@/components/Footer"));
const ContactModal = lazy(() => import("@/components/ContactModal"));
const LiquidEther = lazy(() => import("@/components/LiquidEther"));

const Index = ({ stage }: { stage: number }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showLiquid, setShowLiquid] = useState(false);

  // Delay LiquidEther until page is fully interactive
  useEffect(() => {
    if (stage >= 2) {
      // Wait an extra moment after stage 2
      const timer = setTimeout(() => setShowLiquid(true), 300);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* STAGE 0: Hero ONLY */}
      <Suspense fallback={null}>
        <Hero />
      </Suspense>

      {/* Anchor for smooth scrolling (exists immediately, even before About mounts) */}
      <div id="about" aria-hidden="true" className="relative z-10 h-px w-px" />

      {/* STAGE 1: Navigation (after first paint) */}
      {stage >= 1 && (
        <Navigation onContactClick={() => setIsContactOpen(true)} />
      )}

      {/* STAGE 2+: Background effect (DELAYED - most expensive) */}
      {showLiquid && (
        <Suspense fallback={null}>
          <div 
            className="fixed inset-0 z-0 h-[200vh]"
            style={{ 
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              contain: 'strict',
              pointerEvents: 'none'
            }}
          >
            <LiquidEther
              colors={["#00FF66", "#00CC55", "#0E1F17"]}
              mouseForce={12} 
              cursorSize={100} 
              resolution={0.2} 
              autoDemo={true}
              autoSpeed={0.2} 
              autoIntensity={1.2} 
            />
          </div>
        </Suspense>
      )}

      {/* STAGE 2: Below-the-fold content */}
      {stage >= 2 && (
        <Suspense fallback={null}>
          <About />
          <Footer />
        </Suspense>
      )}

      {/* STAGE 2: Modals only when needed */}
      {stage >= 2 && isContactOpen && (
        <Suspense fallback={null}>
          <ContactModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />
        </Suspense>
      )}
    </main>
  );
};

export default Index;