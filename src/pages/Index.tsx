import { useState, lazy, Suspense } from 'react';
import Navigation from '@/components/Navigation';
import LiquidEther from '@/components/LiquidEther';

// Lazy load heavy components
const Hero = lazy(() => import('@/components/Hero'));
const About = lazy(() => import('@/components/About'));
const Footer = lazy(() => import('@/components/Footer'));
const ContactModal = lazy(() => import('@/components/ContactModal'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      {/* Shared Liquid Ether Background - extends from Hero through About */}
      <div className="fixed inset-0 z-0 h-[200vh]">
        <LiquidEther
          colors={['#00FF66', '#00CC55', '#0E1F17']}
          mouseForce={20}
          cursorSize={120}
          resolution={0.4}
          autoDemo={true}
          autoSpeed={0.4}
          autoIntensity={2.5}
        />
      </div>

      <Navigation onContactClick={() => setIsContactOpen(true)} />
      
      <Suspense fallback={<LoadingFallback />}>
        <Hero />
        <About />
        <Footer />
        <ContactModal 
          isOpen={isContactOpen} 
          onClose={() => setIsContactOpen(false)} 
        />
      </Suspense>
    </main>
  );
};

export default Index;
