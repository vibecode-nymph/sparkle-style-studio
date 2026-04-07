import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import ScrollSequence from '@/components/ScrollSequence';
import { categories } from '@/lib/mock-data';
import { useProducts } from '@/lib/api';

const Index = () => {
  const { data: products = [] } = useProducts();

  const trending = useMemo(() => products.filter((p) => p.trending).slice(0, 4), [products]);
  const featured = useMemo(() => products.filter((p) => p.featured).slice(0, 3), [products]);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <Gem className="h-4 w-4 text-primary" />
            <span className="font-body text-xs font-semibold text-primary">New Collection 2026</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-gradient-gold">Bold</span> Jewelry
            <br />
            for <span className="text-gradient-gold">Bold</span> People
          </h1>
          <p className="mt-6 max-w-xl mx-auto font-body text-lg text-muted-foreground leading-relaxed">
            Handcrafted chains and bracelets designed to make a statement. Redefine your style with pieces that shine as bright as you do.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold shadow-gold hover:opacity-90">
              <Link to="/shop">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-body border-primary/40 text-primary hover:bg-primary/10">
              <Link to="/try-on">
                <Sparkles className="mr-2 h-4 w-4" /> Try On with AR
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Hero image card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto mt-12"
        >
          <div className="relative overflow-hidden rounded-2xl aspect-[2.5/1] bg-secondary border border-border">
            <img
              src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920&h=1080&fit=crop"
              alt="Gold jewelry collection"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--gold)/0.08)_0%,_transparent_70%)]" />
          </div>
        </motion.div>
      </section>

      {/* Scroll Sequence */}
      <ScrollSequence />

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center mb-10">
          <Gem className="mx-auto h-10 w-10 text-primary mb-4" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Shop by Category</h2>
          <p className="mt-2 font-body text-muted-foreground">Find your next signature piece</p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link to={`/shop?category=${cat.slug}`} className="group relative block overflow-hidden rounded-2xl aspect-[2/1] bg-secondary border border-border">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--gold)/0.05)_0%,_transparent_70%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="font-display text-2xl font-bold text-foreground">{cat.name}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-1">{cat.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 font-body text-sm font-semibold text-primary">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

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

      {/* AR CTA */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-secondary border border-border p-10 md:p-16 text-center max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--gold)/0.08)_0%,_transparent_70%)]" />
          <div className="relative z-10">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="font-display text-3xl md:text-5xl font-bold">
              <span className="text-gradient-gold">Try Before</span> You Buy
            </h2>
            <p className="mt-4 max-w-xl mx-auto font-body text-muted-foreground text-lg">
              Use your camera to see how our chains look on you — powered by AR technology.
            </p>
            <Button asChild size="lg" className="mt-8 bg-gradient-gold text-primary-foreground font-body font-semibold shadow-gold hover:opacity-90">
              <Link to="/try-on">
                <Sparkles className="mr-2 h-4 w-4" /> Launch AR Try-On
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Featured */}
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
