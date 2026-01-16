import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
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
          once: true
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="relative py-32 md:py-48 bg-background"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-start">
          {/* Label */}
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-accent" />
            <span className="text-sm uppercase tracking-widest text-muted-foreground">About Us</span>
          </div>
          
          {/* Description */}
          <div>
            <p 
              ref={textRef}
              className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-foreground"
            >
              We are a creative studio dedicated to pushing boundaries and crafting 
              immersive digital experiences. Our team blends artistry with technology 
              to create work that resonates, inspires, and transforms how people 
              interact with brands.
            </p>
            
            <div className="mt-12 grid grid-cols-2 gap-8">
              <div>
                <span className="text-4xl md:text-5xl font-light text-foreground">50+</span>
                <p className="mt-2 text-sm text-muted-foreground">Projects Delivered</p>
              </div>
              <div>
                <span className="text-4xl md:text-5xl font-light text-foreground">8+</span>
                <p className="mt-2 text-sm text-muted-foreground">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
