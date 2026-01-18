import { useEffect, useRef, useState } from "react";
import { StepDrawer, InfoStep } from "./StepDrawer";

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const [textVisible, setTextVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === textRef.current) setTextVisible(true);
            if (entry.target === imageRef.current) setImageVisible(true);
            if (entry.target === statsRef.current) setStatsVisible(true);
            if (entry.target === stepsRef.current) setStepsVisible(true);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (textRef.current) observer.observe(textRef.current);
    if (imageRef.current) observer.observe(imageRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (stepsRef.current) observer.observe(stepsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-section"
      className="relative pt-16 md:pt-24 pb-32 md:pb-48 overflow-hidden content-auto gpu-layer"
    >
      <div className="absolute inset-0 z-0 bg-background/80 backdrop-blur-[2px]" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* ABOUT GRID */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-start">
          {/* Left */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-accent" />
              <span className="text-sm uppercase tracking-widest text-muted-foreground">
                About OffGriid
              </span>
            </div>

            <div
              ref={imageRef}
              className={`
                relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-border
                smooth-transition
                ${imageVisible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-12 scale-95'
                }
              `}
              style={{
                willChange: imageVisible ? 'auto' : 'transform, opacity',
                transitionDuration: '1000ms',
                transitionProperty: 'transform, opacity',
                backfaceVisibility: 'hidden'
              }}
            >
              <img
                src="/mesh.webp"
                alt="OffGriid mesh network visualization"
                className="w-full h-full object-cover scale-110"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Right */}
          <div>
            <p
              ref={textRef}
              className={`
                text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-foreground text-justify
                smooth-transition
                ${textVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
                }
              `}
              style={{
                willChange: textVisible ? 'auto' : 'transform, opacity',
                transitionDuration: '1000ms',
                transitionProperty: 'transform, opacity'
              }}
            >
              OffGriid is an offline-first, peer-to-peer messaging network built
              for moments when traditional communication infrastructure fails.
              Using Bluetooth Low Energy mesh networking and modern cryptography,
              devices communicate directly without servers, phone numbers, or
              internet access.
              <br />
              <br />
              Designed for resilience, privacy, and autonomy, OffGriid operates
              during blackouts, natural disasters, remote deployments, and
              network shutdowns — ensuring secure communication when it matters
              most.
            </p>

            <div 
              ref={statsRef} 
              className="mt-12 grid grid-cols-2 gap-8"
            >
              <div
                className={`
                  transition-all duration-700 ease-out
                  ${statsVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                  }
                `}
                style={{ transitionDelay: statsVisible ? '0ms' : '0ms' }}
              >
                <span className="text-4xl md:text-5xl font-light text-foreground">
                  Offline
                </span>
                <p className="mt-2 text-sm text-muted-foreground">
                  First Architecture
                </p>
              </div>
              <div
                className={`
                  transition-all duration-700 ease-out
                  ${statsVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                  }
                `}
                style={{ transitionDelay: statsVisible ? '200ms' : '0ms' }}
              >
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
            <div 
              className={`
                flex flex-col items-center
                transition-all duration-700 ease-out
                ${stepsVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
                }
              `}
              style={{ transitionDelay: stepsVisible ? '0ms' : '0ms' }}
            >
              <StepDrawer
                stepNumber={1}
                title="Install APK"
                description="Download and install the OffGriid APK directly — no app stores, no accounts."
                downloadUrl="/OffGriid.apk"
                fileName="offgriid-1.0.0.apk"
                sha256="42ADF9BA6D0D3ED4A359936C9687C975EA4AB1ADD6C775F434D40A1981FC52AD"
              />
            </div>

            <div 
              className={`
                flex flex-col items-center
                transition-all duration-700 ease-out
                ${stepsVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
                }
              `}
              style={{ transitionDelay: stepsVisible ? '150ms' : '0ms' }}
            >
              <InfoStep
                stepNumber={2}
                title="Generate Identity"
                description="On first launch, OffGriid automatically creates a secure cryptographic identity, no sign-up required."
                details={[
                  "Open OffGriid for the first time",
                  "App generates an Ed25519 key pair locally",
                  "No server communication occurs",
                  "Keys are stored securely on-device",
                ]}
              />
            </div>

            <div 
              className={`
                flex flex-col items-center
                transition-all duration-700 ease-out
                ${stepsVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
                }
              `}
              style={{ transitionDelay: stepsVisible ? '300ms' : '0ms' }}
            >
              <InfoStep
                stepNumber={3}
                title="Auto-Mesh"
                description="Nearby devices are discovered automatically using Bluetooth Low Energy and form a secure peer-to-peer mesh."
                details={[
                  "BLE discovers nearby OffGriid devices",
                  "Encrypted handshake establishes trust",
                  "Messages relay across the mesh",
                  "Works fully offline",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;