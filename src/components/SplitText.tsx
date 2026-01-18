import { useRef, useEffect, useState } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: {
    opacity?: number;
    y?: number;
    x?: number;
    rotateX?: number;
    rotateY?: number;
    scale?: number;
  };
  to?: {
    opacity?: number;
    y?: number;
    x?: number;
    rotateX?: number;
    rotateY?: number;
    scale?: number;
  };
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  onLetterAnimationComplete?: () => void;
}

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}: SplitTextProps) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [chars, setChars] = useState<string[]>([]);

  // Wait for fonts to load
  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  // Split text into chars/words
  useEffect(() => {
    if (splitType === 'chars') {
      setChars(text.split(''));
    } else if (splitType === 'words') {
      setChars(text.split(' '));
    } else {
      setChars([text]);
    }
  }, [text, splitType]);

  // IntersectionObserver for scroll-triggered animation
  useEffect(() => {
    if (!ref.current || chars.length === 0 || !fontsLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            
            // Call completion callback after animation finishes
            if (onLetterAnimationComplete) {
              const totalDuration = (chars.length * delay) + (duration * 1000);
              setTimeout(onLetterAnimationComplete, totalDuration);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [chars, threshold, rootMargin, isVisible, delay, duration, onLetterAnimationComplete, fontsLoaded]);

  // Convert GSAP easing to CSS cubic-bezier
  const getEasing = (easeName: string) => {
    const easings: Record<string, string> = {
      'power3.out': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
      'power2.out': 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
      'power1.out': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
      'expo.out': 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
      'circ.out': 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
    };
    return easings[easeName] || 'cubic-bezier(0.215, 0.610, 0.355, 1.000)';
  };

  const renderContent = () => {
    return chars.map((char, index) => {
      const style: React.CSSProperties = {
        display: 'inline-block',
        opacity: isVisible ? (to.opacity ?? 1) : (from.opacity ?? 0),
        transform: isVisible
          ? `translate(${to.x ?? 0}px, ${to.y ?? 0}px) rotateX(${to.rotateX ?? 0}deg) rotateY(${to.rotateY ?? 0}deg) scale(${to.scale ?? 1})`
          : `translate(${from.x ?? 0}px, ${from.y ?? 0}px) rotateX(${from.rotateX ?? 0}deg) rotateY(${from.rotateY ?? 0}deg) scale(${from.scale ?? 1})`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}s`,
        transitionDelay: `${(index * delay) / 1000}s`,
        transitionTimingFunction: getEasing(ease),
        transformOrigin: 'center',
        willChange: 'transform, opacity',
        minWidth: char === ' ' ? '0.25em' : 'auto',
      };

      return (
        <span key={index} className="split-char" style={style}>
          {char === ' ' ? '\u00A0' : char}
          {splitType === 'words' && index < chars.length - 1 ? '\u00A0' : ''}
        </span>
      );
    });
  };

  const containerStyle: React.CSSProperties = {
    textAlign,
    overflow: 'hidden',
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    willChange: 'transform, opacity',
  };

  const classes = `split-parent ${className}`;
  const content = renderContent();

  // Render based on tag type
  switch (tag) {
    case 'h1':
      return (
        <h1 ref={ref as React.RefObject<HTMLHeadingElement>} style={containerStyle} className={classes}>
          {content}
        </h1>
      );
    case 'h2':
      return (
        <h2 ref={ref as React.RefObject<HTMLHeadingElement>} style={containerStyle} className={classes}>
          {content}
        </h2>
      );
    case 'h3':
      return (
        <h3 ref={ref as React.RefObject<HTMLHeadingElement>} style={containerStyle} className={classes}>
          {content}
        </h3>
      );
    case 'h4':
      return (
        <h4 ref={ref as React.RefObject<HTMLHeadingElement>} style={containerStyle} className={classes}>
          {content}
        </h4>
      );
    case 'h5':
      return (
        <h5 ref={ref as React.RefObject<HTMLHeadingElement>} style={containerStyle} className={classes}>
          {content}
        </h5>
      );
    case 'h6':
      return (
        <h6 ref={ref as React.RefObject<HTMLHeadingElement>} style={containerStyle} className={classes}>
          {content}
        </h6>
      );
    case 'span':
      return (
        <span ref={ref as React.RefObject<HTMLSpanElement>} style={containerStyle} className={classes}>
          {content}
        </span>
      );
    default:
      return (
        <p ref={ref as React.RefObject<HTMLParagraphElement>} style={containerStyle} className={classes}>
          {content}
        </p>
      );
  }
};

export default SplitText;