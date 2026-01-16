import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RATE_LIMIT_HOURS = 24;
const STORAGE_KEY = 'contact_last_sent_at';

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const isRateLimited = () => {
    const lastSent = localStorage.getItem(STORAGE_KEY);
    if (!lastSent) return false;

    const diffHours =
      (Date.now() - Number(lastSent)) / (1000 * 60 * 60);

    return diffHours < RATE_LIMIT_HOURS;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (isRateLimited()) {
      toast({
        title: 'Rate limit reached',
        description: 'You can send only one message per day.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Construct mailto
    const subject = encodeURIComponent(`Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    window.location.href = `mailto:prashanthkumarsvpl@gmail.com?subject=${subject}&body=${body}`;

    // Save timestamp
    localStorage.setItem(STORAGE_KEY, Date.now().toString());

    toast({
      title: 'Message prepared',
      description: 'Your email client has been opened.',
    });

    setIsSubmitting(false);
    setName('');
    setEmail('');
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-card rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-light text-foreground">
            Let's Talk
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Your Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg"
              maxLength={255}
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Your Message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-lg min-h-[120px] resize-none"
              maxLength={1000}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full py-6 text-base"
          >
            Open Email Client
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
