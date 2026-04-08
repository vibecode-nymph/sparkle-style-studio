import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Gem } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleCart, totalItems } = useCartStore();
  const count = totalItems();

  const links = [
    { to: '/shop?category=chains', label: 'Necklaces' },
    { to: '/shop?category=bracelets', label: 'Bracelets' },
    { to: '/shop?category=name-chains', label: 'Name Chains' },
    { to: '/shop', label: 'Best Sellers' },
    { to: '/create', label: 'Personalized', icon: <Gem className="h-3.5 w-3.5" /> },
  ];

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="font-display text-2xl font-bold text-gradient-gold tracking-wide">
          AURUM
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to + l.label}
              to={l.to}
              className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-foreground hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button onClick={toggleCart} className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </button>
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border/50 bg-background overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {links.map((l) => (
                <Link
                  key={l.to + l.label}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  {l.icon}
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
