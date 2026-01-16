import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
interface NavigationProps {
  onContactClick: () => void;
}
const Navigation = ({
  onContactClick
}: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const menuItems = [{
    label: 'Home',
    href: '#'
  }, {
    label: 'About Us',
    href: '#about'
  }, {
    label: 'Docs',
    href: 'https://github.com/PRASHANTH-S-23/OffGriid./blob/main/README.md',
    external: true,
  }, {
    label: 'Contact',
    href: '#footer'
  }];
  return <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 md:py-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a
          href="#"
          className="text-xl font-bold tracking-tight text-foreground font-jetbrains"
          >
          Off Gr<span className="text-[#00CC55]">ii</span>d.
          </a>


          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-full px-6 border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300" onClick={onContactClick}>
              Let's Talk
            </Button>
            <Button variant="ghost" className="rounded-full px-6 hover:bg-foreground/10 transition-all duration-300" onClick={() => setIsMenuOpen(true)}>
              Menu
            </Button>
          </div>
        </nav>
      </header>

      {/* Menu Overlay */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        
        {/* Menu Panel */}
        <div className={`absolute right-0 top-0 h-full w-full max-w-lg bg-card shadow-2xl transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex h-full flex-col p-8 md:p-12">
            {/* Close button */}
            <button onClick={() => setIsMenuOpen(false)} className="self-end rounded-full p-2 hover:bg-muted transition-colors">
              <X className="h-6 w-6" />
            </button>

            {/* Menu Items */}
            <nav className="mt-12 flex flex-col gap-6">
              {menuItems.map((item, index) => <a key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)} className="text-4xl md:text-5xl font-light text-foreground hover:text-accent transition-colors duration-300" style={{
              animationDelay: `${index * 50}ms`,
              animation: isMenuOpen ? 'fade-in 0.5s ease-out forwards' : 'none',
              opacity: isMenuOpen ? undefined : 0
            }}>
                  {item.label}
                </a>)}
            </nav>
        {/* Visit Us */}
        <div className="mt-auto">
          <p className="text-sm text-muted-foreground mb-4">
            Visit us 
          </p>

          <div className="flex gap-2">
            <div className="flex-1 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground flex items-center">
              ZERO BLINK
            </div>

                <Button
                  asChild
                  variant="default"
                  className="rounded-full px-6"
                >
                  <a
                    href="https://zeroblink.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                </Button>
              </div>
            </div>


          </div>
        </div>
      </div>
    </>;
};
export default Navigation;