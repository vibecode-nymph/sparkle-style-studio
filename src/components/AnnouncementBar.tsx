import { useState } from 'react';
import { X } from 'lucide-react';

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-gold text-primary-foreground text-center py-2.5 px-8 font-body text-sm font-semibold tracking-wide">
      <span>FREE SHIPPING on orders over $75 · Waterproof & Tarnish-Free</span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
