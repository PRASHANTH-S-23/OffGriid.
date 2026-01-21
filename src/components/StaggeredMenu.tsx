import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  isFixed?: boolean;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onContactClick?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  colors = ['hsl(var(--background))', 'hsl(var(--primary))'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  menuButtonColor = 'hsl(var(--foreground))',
  openMenuButtonColor = 'hsl(var(--foreground))',
  changeMenuColorOnOpen = true,
  accentColor = 'hsl(var(--primary))',
  isFixed = true,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  onContactClick
}: StaggeredMenuProps) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const preLayersRef = useRef<HTMLDivElement>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);

  const plusHRef = useRef<HTMLSpanElement>(null);
  const plusVRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  const textInnerRef = useRef<HTMLSpanElement>(null);
  const textWrapRef = useRef<HTMLSpanElement>(null);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const busyRef = useRef(false);

  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  const resolveGsapColor = useCallback((el: HTMLElement, color: string) => {
    // GSAP can't reliably parse CSS variable color strings like `hsl(var(--foreground))`.
    // We resolve them to a computed rgb(...) string for animation targets.
    if (!color || typeof color !== 'string') return '';
    if (!color.includes('var(')) return color;

    const prev = (el as HTMLElement).style.color;
    (el as HTMLElement).style.color = color;
    const resolved = getComputedStyle(el).color;
    (el as HTMLElement).style.color = prev;
    return resolved;
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });

      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

      gsap.set(textInner, { yPercent: 0 });

      // Don't use GSAP for setting color when it might be CSS-variable based.
      if (toggleBtnRef.current) toggleBtnRef.current.style.color = menuButtonColor;
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current || [];
    if (!panel || !Array.isArray(layers)) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
    const numberEls = Array.from(
      panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
    ) as HTMLElement[];
    const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];

    const validLayers = layers.filter(el => el !== null && el !== undefined);
    const layerStates = validLayers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as string]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity' as string]: 1, stagger: { each: 0.08, from: 'start' } },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            }
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current || [];
    if (!panel) return;

    const validLayers = layers.filter(el => el !== null && el !== undefined);
    const all: HTMLElement[] = [...validLayers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
        ) as HTMLElement[];
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as string]: 0 });

        const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
      }
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetRaw = opening ? openMenuButtonColor : menuButtonColor;
        const targetResolved = resolveGsapColor(btn, targetRaw);

        // If we couldn't resolve (unexpected), fall back to immediate style set.
        if (!targetResolved) {
          btn.style.color = targetRaw;
          return;
        }

        colorTweenRef.current = gsap.to(btn, {
          color: targetResolved,
          delay: 0.18,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => {
            // Preserve theming by re-applying the CSS-variable based string.
            btn.style.color = targetRaw;
          }
        });
      } else {
        btn.style.color = menuButtonColor;
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen, resolveGsapColor]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        toggleBtnRef.current.style.color = targetColor;
      } else {
        toggleBtnRef.current.style.color = menuButtonColor;
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;

    const seq: string[] = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  const handleItemClick = (link: string) => {
    closeMenu();
    if (link.startsWith('#')) {
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (link.startsWith('http')) {
      window.open(link, '_blank');
    }
  };

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  return (
    <div className={`sm-scope ${className || ''}`}>
      <div
        className="staggered-menu-wrapper"
        data-open={open || undefined}
        style={{ ['--sm-accent' as string]: accentColor }}
      >
        {/* Pre-layers for stagger effect */}
        <div ref={preLayersRef} className="sm-prelayers-container">
          {(() => {
            const raw = colors && colors.length ? colors.slice(0, 4) : ['hsl(var(--card))', 'hsl(var(--primary))'];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div
                key={i}
                className="sm-prelayer"
                style={{
                  position: 'fixed',
                  top: 0,
                  bottom: 0,
                  [position]: 0,
                  width: '100%',
                  maxWidth: '32rem',
                  backgroundColor: c,
                  zIndex: 98 + i
                }}
              />
            ));
          })()}
        </div>

        {/* Header with logo and toggle button */}
        <header
          className="sm-header"
          style={{
            position: isFixed ? 'fixed' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
          }}
        >
          {/* Logo */}
          <a href="#" className="text-xl font-bold tracking-tight text-foreground font-jetbrains">
            Off Gr<span className="text-primary">ii</span>d.
          </a>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onContactClick}
              className="rounded-full px-6 py-2 border border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300 text-sm font-medium"
            >
              Let's Talk
            </button>
            
            <button
              ref={toggleBtnRef}
              onClick={toggleMenu}
              className="sm-toggle-btn flex items-center gap-2 px-4 py-2 rounded-full hover:bg-foreground/10 transition-colors"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span
                ref={textWrapRef}
                className="sm-text-wrap inline-block overflow-hidden h-5 relative"
                style={{ width: '3rem' }}
              >
                <span
                  ref={textInnerRef}
                  className="sm-text-inner flex flex-col"
                >
                  {textLines.map((l, i) => (
                    <span key={i} className="text-sm font-medium leading-5">
                      {l}
                    </span>
                  ))}
                </span>
              </span>

              <span ref={iconRef} className="sm-icon relative w-4 h-4">
                <span
                  ref={plusHRef}
                  className="absolute top-1/2 left-0 w-full h-0.5 bg-current -translate-y-1/2"
                />
                <span
                  ref={plusVRef}
                  className="absolute top-1/2 left-0 w-full h-0.5 bg-current -translate-y-1/2"
                />
              </span>
            </button>
          </div>
        </header>

        {/* Menu Panel */}
        <div
          ref={panelRef}
          className="staggered-menu-panel"
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            [position]: 0,
            width: '100%',
            maxWidth: '32rem',
            backgroundColor: 'hsl(var(--card))',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            padding: '6rem 2rem 2rem',
            overflowY: 'auto'
          }}
        >
          <div className="sm-panel-content flex flex-col h-full">
            {/* Menu Items */}
            <nav
              className="sm-panel-list flex flex-col gap-2"
              data-numbering={displayItemNumbering || undefined}
            >
              {items && items.length ? (
                items.map((it, idx) => (
                  <div
                    key={idx}
                    className="sm-panel-item group"
                    style={{ ['--sm-num-opacity' as string]: 0 }}
                  >
                    <button
                      onClick={() => handleItemClick(it.link)}
                      aria-label={it.ariaLabel}
                      className="sm-panel-itemLabel-wrap overflow-hidden block w-full text-left"
                    >
                      <span className="sm-panel-itemLabel flex items-center gap-4 text-4xl md:text-5xl font-light text-foreground hover:text-primary transition-colors duration-300 py-2">
                        {displayItemNumbering && (
                          <span
                            className="text-sm text-muted-foreground transition-opacity"
                            style={{ opacity: 'var(--sm-num-opacity)' }}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                        )}
                        {it.label}
                      </span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="sm-panel-item">
                  <div className="sm-panel-itemLabel-wrap overflow-hidden">
                    <span className="sm-panel-itemLabel text-4xl font-light text-muted-foreground">
                      No items
                    </span>
                  </div>
                </div>
              )}
            </nav>

            {/* Socials */}
            {displaySocials && socialItems && socialItems.length > 0 && (
              <div className="sm-socials mt-auto pt-12">
                <p className="sm-socials-title text-sm text-muted-foreground mb-4">
                  Visit us
                </p>
                <div className="sm-socials-links flex flex-wrap gap-4">
                  {socialItems.map((s, i) => (
                    <a
                      key={i}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm-socials-link text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .sm-scope .staggered-menu-wrapper[data-open] ~ * {
          pointer-events: none;
        }
        @media (max-width: 1024px) {
          .sm-scope .staggered-menu-panel {
            width: 100%;
            max-width: 100%;
          }
        }
        @media (max-width: 640px) {
          .sm-scope .staggered-menu-panel {
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
