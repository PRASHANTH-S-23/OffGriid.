import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StepDrawer, InfoStep } from "./StepDrawer";

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

      // Text reveal
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 0.5,
          },
        }
      );

      // Image parallax
      gsap.fromTo(
        imageRef.current,
        { y: 100, scale: 0.95 },
        {
          y: -50,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );

      // Stats stagger
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
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      // Steps stagger
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
            ease: "power2.out",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 75%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative pt-16 md:pt-24 pb-32 md:pb-48 overflow-hidden"
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

          {/* Right */}
          <div>
            <p
              ref={textRef}
              className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-foreground text-justify will-change-transform"
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

          <div
            ref={stepsRef}
            className="grid md:grid-cols-3 gap-12 text-center"
          >
            {/* Step 01 */}
            <div className="flex flex-col items-center">
              <StepDrawer
                stepNumber={1}
                title="Install APK"
                description="Download and install the OffGriid APK directly — no app stores, no accounts."
                downloadUrl="/apk/offgriid-1.0.0.apk"
                fileName="offgriid-1.0.0.apk"
                sha256="42ADF9BA6D0D3ED4A359936C9687C975EA4AB1ADD6C775F434D40A1981FC52AD"
              />
            </div>

            {/* Step 02 */}
            <div className="flex flex-col items-center">
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

            {/* Step 03 */}
            <div className="flex flex-col items-center">
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
