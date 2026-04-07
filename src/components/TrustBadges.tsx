import { Star, Droplets, Heart, Shield } from 'lucide-react';

const badges = [
  { icon: Star, label: '500+ Happy Customers' },
  { icon: Droplets, label: 'Waterproof & Tarnish-Free' },
  { icon: Heart, label: 'Hypoallergenic' },
  { icon: Shield, label: '2 Year Warranty' },
];

const TrustBadges = () => (
  <div className="overflow-hidden border-y border-border bg-secondary/50 py-3">
    <div className="flex animate-marquee gap-12 whitespace-nowrap">
      {[...badges, ...badges, ...badges].map((b, i) => (
        <span key={i} className="flex items-center gap-2 font-body text-sm font-semibold text-foreground/80 uppercase tracking-wider">
          <b.icon className="h-4 w-4 text-primary shrink-0" />
          {b.label}
        </span>
      ))}
    </div>
  </div>
);

export default TrustBadges;
