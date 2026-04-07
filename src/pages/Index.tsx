import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import TrustBadges from '@/components/TrustBadges';
import CollectionGrid from '@/components/CollectionGrid';
import QualityPromise from '@/components/QualityPromise';
import { categories } from '@/lib/mock-data';
import { useProducts } from '@/lib/api';

const categoryTabs = [
  { label: 'Necklaces', slug: 'chains' },
  { label: 'Bracelets', slug: 'bracelets' },
];

const Index = () => {
  const { data: products = [] } = useProducts();
  const [activeTab, setActiveTab] = useState('chains');

  const trending = useMemo(() => products.filter((p) => p.trending).slice(0, 4), [products]);
  const featured = useMemo(() => products.filter((p) => p.featured).slice(0, 3), [products]);
  const tabProducts = useMemo(
    () => products.filter((p) => p.category === activeTab).slice(0, 4),
    [products, activeTab]
  );

  return (
    <div className="min-h-screen">
      {/* Hero — full-bleed lifestyle image */}
      <section className="relative w-full overflow-hidden">
        <div className="relative aspect-[16/7] md:aspect-[2.5/1] w-full">
          <img
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920&h=1080&fit=crop"
            alt="Gold jewelry collection"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="container mx-auto px-4"
            >
              <div className="max-w-lg">
                <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight text-foreground">
                  Jewelry Made to Be
                  <br />
                  <span className="text-gradient-gold">Worn Every Day</span>
                </h1>
                <p className="mt-4 font-body text-base md:text-lg text-muted-foreground leading-relaxed">
                  18K gold plated. Waterproof. Tarnish-free. Crafted for those who never settle.
                </p>
                <div className="mt-6 flex gap-3">
                  <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold shadow-gold hover:opacity-90">
                    <Link to="/shop">
                      Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="font-body border-primary/40 text-primary hover:bg-primary/10">
                    <Link to="/create">
                      Personalize Yours
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Category Tabs — Shop by category with product preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            {categoryTabs.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => setActiveTab(tab.slug)}
                className={`font-display text-2xl md:text-3xl font-bold transition-colors ${
                  activeTab === tab.slug ? 'text-foreground' : 'text-muted-foreground/40 hover:text-muted-foreground/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {tabProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="font-body border-primary/40 text-primary hover:bg-primary/10">
              <Link to={`/shop?category=${activeTab}`}>
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Collection Grid */}
      <CollectionGrid />

      {/* Lifestyle Banner */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-2xl aspect-[3/1] bg-secondary border border-border">
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&h=600&fit=crop"
            alt="Wear it your way"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-8 md:px-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Wear It <span className="text-gradient-gold">Your Way</span>
              </h2>
              <p className="mt-2 font-body text-muted-foreground max-w-md">Stack, layer, and style your pieces to match your mood.</p>
              <Button asChild className="mt-4 bg-gradient-gold text-primary-foreground font-body font-semibold shadow-gold hover:opacity-90">
                <Link to="/shop">Shop the Look</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <QualityPromise />

      {/* Trending */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Trending Now</h2>
              <p className="mt-2 font-body text-muted-foreground">What everyone is wearing</p>
            </div>
            <Button asChild variant="ghost" className="text-primary font-body">
              <Link to="/shop">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {trending.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Editor's Picks */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">Editor's Picks</h2>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
