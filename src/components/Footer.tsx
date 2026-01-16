import { useState } from 'react';
import { ArrowUp, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const [email, setEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-foreground text-background py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 md:gap-8">
          {/* Logo & Location */}
          <div className="md:col-span-4">
            <h3 className="text-2xl font-semibold mb-6">STUDIO</h3>
            <address className="not-italic text-background/70 text-sm leading-relaxed">
              123 Creative Avenue<br />
              Design District<br />
              New York, NY 10001
            </address>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-sm uppercase tracking-widest text-background/50 mb-4">Contact</h4>
            <div className="space-y-2 text-sm">
              <a href="mailto:hello@studio.com" className="block text-background/70 hover:text-background transition-colors">
                hello@studio.com
              </a>
              <a href="mailto:business@studio.com" className="block text-background/70 hover:text-background transition-colors">
                business@studio.com
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <h4 className="text-sm uppercase tracking-widest text-background/50 mb-4">Social</h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="text-background/70 hover:text-background transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-background/70 hover:text-background transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-background/70 hover:text-background transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h4 className="text-sm uppercase tracking-widest text-background/50 mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full border-background/20 bg-background/10 text-background placeholder:text-background/40 focus:border-background/40"
              />
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full border-background/20 text-background hover:bg-background hover:text-foreground transition-all"
              >
                →
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © 2024 Studio. All rights reserved.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="text-background/70 hover:text-background hover:bg-background/10 rounded-full gap-2"
          >
            Back to top
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
