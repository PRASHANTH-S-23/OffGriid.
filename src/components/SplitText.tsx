import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
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
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [chars, setChars] = useState<string[]>([]);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    if (splitType === 'chars') {
      setChars(text.split(''));
    } else if (splitType === 'words') {
      setChars(text.split(' '));
    } else {
      setChars([text]);
    }
  }, [text, splitType]);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded || chars.length === 0) return;
      if (animationCompletedRef.current) return;

      const el = ref.current;
      const targets = el.querySelectorAll('.split-char');
      
      if (targets.length === 0) return;

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true
          },
          onComplete: () => {
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        chars
      ],
      scope: ref
    }
  );

  const renderContent = () => {
    return chars.map((char, index) => (
      <span 
        key={index} 
        className="split-char inline-block"
        style={{ opacity: 0 }}
      >
        {char === ' ' ? '\u00A0' : char}
        {splitType === 'words' && index < chars.length - 1 ? '\u00A0' : ''}
      </span>
    ));
  };

  const style: React.CSSProperties = {
    textAlign,
    overflow: 'hidden',
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    willChange: 'transform, opacity'
  };
  
  const classes = `split-parent ${className}`;

  switch (tag) {
    case 'h1':
      return <h1 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{renderContent()}</h1>;
    case 'h2':
      return <h2 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{renderContent()}</h2>;
    case 'h3':
      return <h3 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{renderContent()}</h3>;
    case 'h4':
      return <h4 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{renderContent()}</h4>;
    case 'h5':
      return <h5 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{renderContent()}</h5>;
    case 'h6':
      return <h6 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{renderContent()}</h6>;
    case 'span':
      return <span ref={ref as React.RefObject<HTMLSpanElement>} style={style} className={classes}>{renderContent()}</span>;
    default:
      return <p ref={ref as React.RefObject<HTMLParagraphElement>} style={style} className={classes}>{renderContent()}</p>;
  }
};

export default SplitText;
