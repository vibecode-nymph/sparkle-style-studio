import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-border mt-20 bg-secondary/30">
    <div className="container mx-auto px-4 py-14">
      <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="font-display text-xl font-bold text-gradient-gold mb-3">AURUM</h3>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Bold jewelry for bold people. Waterproof, tarnish-free & hypoallergenic — made to be worn every day.
          </p>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold text-foreground mb-4">Shop</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/shop?category=chains" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Necklaces</Link>
            <Link to="/shop?category=bracelets" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Bracelets</Link>
            <Link to="/shop" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Best Sellers</Link>
            <Link to="/shop" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link>
          </div>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold text-foreground mb-4">Experience</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/create" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Personalized Jewelry</Link>
            <span className="font-body text-sm text-muted-foreground">Gift Guide</span>
            <span className="font-body text-sm text-muted-foreground">Birthstone Collection</span>
          </div>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold text-foreground mb-4">Help</h4>
          <div className="flex flex-col gap-2.5">
            <span className="font-body text-sm text-muted-foreground">Shipping & Returns</span>
            <span className="font-body text-sm text-muted-foreground">Contact Us</span>
            <span className="font-body text-sm text-muted-foreground">FAQ</span>
            <span className="font-body text-sm text-muted-foreground">Warranty</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-10 pt-6 text-center">
        <p className="font-body text-xs text-muted-foreground">&copy; 2026 AURUM Jewelry. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
