import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Text reveal with parallax
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 0.5,
          },
        }
      );

      // Image parallax - moves slower than scroll for depth
      gsap.fromTo(
        imageRef.current,
        { y: 100, scale: 0.95 },
        {
          y: -50,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        }
      );

      // Stats staggered reveal
      const statItems = statsRef.current?.children;
      if (statItems) {
        gsap.fromTo(
          statItems,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Steps parallax reveal
      const stepItems = stepsRef.current?.children;
      if (stepItems) {
        gsap.fromTo(
          stepItems,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  const handleDownloadAPK = () => {
    const link = document.createElement('a');
    link.href = '/OffGriid.apk';
    link.download = 'OffGriid.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 md:py-48 bg-transparent overflow-hidden"
    >
      {/* Smooth gradient transition from hero */}
      <div className="absolute inset-0 z-0">
        {/* Top gradient blending from transparent to solid */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent via-background/60 to-background/90" />
        {/* Main background */}
        <div className="absolute top-64 inset-x-0 bottom-0 bg-background/90 backdrop-blur-sm" />
      </div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* ABOUT GRID */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-start">
          {/* Left Visual */}
          <div className="flex flex-col gap-6">
            {/* Label */}
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-accent" />
              <span className="text-sm uppercase tracking-widest text-muted-foreground">
                About OffGriid
              </span>
            </div>

            {/* Image with parallax */}
            <div 
              ref={imageRef}
              className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-border will-change-transform"
            >
              <img
                src="/mesh.webp"
                alt="OffGriid mesh network visualization"
                className="w-full h-full object-cover scale-110"
                loading="lazy"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <p
              ref={textRef}
              className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-foreground text-justify will-change-transform"
            >
              OffGriid is an offline-first, peer-to-peer messaging network built for
              moments when traditional communication infrastructure fails. Using
              Bluetooth Low Energy mesh networking and modern cryptography, devices
              communicate directly without servers, phone numbers, or internet access.
              <br /><br />
              Designed for resilience, privacy, and autonomy, OffGriid operates during
              blackouts, natural disasters, remote deployments, and network shutdowns —
              ensuring secure communication when it matters most.
            </p>

            {/* Stats with stagger animation */}
            <div ref={statsRef} className="mt-12 grid grid-cols-2 gap-8">
              <div>
                <span className="text-4xl md:text-5xl font-light text-foreground">
                  Offline
                </span>
                <p className="mt-2 text-sm text-muted-foreground">
                  First Architecture
                </p>
              </div>
              <div>
                <span className="text-4xl md:text-5xl font-light text-foreground">
                  Zero
                </span>
                <p className="mt-2 text-sm text-muted-foreground">
                  Central Servers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-32">
          <h3 className="text-center text-xl md:text-2xl font-light text-foreground mb-12">
            How It Works
          </h3>

          <div ref={stepsRef} className="grid md:grid-cols-3 gap-12 text-center">
            {/* Step 01 */}
            <div className="flex flex-col items-center">
              <span className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent text-sm font-medium">
                01
              </span>
              <h4 className="text-lg font-medium text-foreground mb-2">
                Install APK
              </h4>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                Download and install the OffGriid APK directly — no app stores, no
                accounts.
              </p>
              <button
                onClick={handleDownloadAPK}
                className="text-sm text-accent hover:underline cursor-pointer inline-flex items-center gap-2 transition-colors hover:text-accent/80"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Download APK
              </button>
            </div>

            {/* Step 02 */}
            <div className="flex flex-col items-center">
              <span className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent text-sm font-medium">
                02
              </span>
              <h4 className="text-lg font-medium text-foreground mb-2">
                Generate Identity
              </h4>
              <p className="text-sm text-muted-foreground max-w-xs">
                On first launch, OffGriid automatically creates a secure cryptographic
                identity — no sign-up required.
              </p>
            </div>

            {/* Step 03 */}
            <div className="flex flex-col items-center">
              <span className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent text-sm font-medium">
                03
              </span>
              <h4 className="text-lg font-medium text-foreground mb-2">
                Auto-Mesh
              </h4>
              <p className="text-sm text-muted-foreground max-w-xs">
                Nearby devices are discovered automatically using Bluetooth Low Energy
                and form a secure peer-to-peer mesh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
