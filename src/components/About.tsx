import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 md:py-48 bg-background"
    >
      <div className="container mx-auto px-6 md:px-12">
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

          {/* Image */}
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-border">
            <img
              src="/mesh.webp"
              alt="OffGriid mesh network visualization"
              className="w-full h-full object-cover"
            />
          </div>
        </div>


          {/* Description */}
          <div>
            <p
              ref={textRef}
              className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-foreground text-justify"
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

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-8">
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

          <div className="grid md:grid-cols-3 gap-12 text-center">
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
              <a
                href="/OffGriid.apk"
                className="text-sm text-accent hover:underline"
              >
                Download APK →
              </a>
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
