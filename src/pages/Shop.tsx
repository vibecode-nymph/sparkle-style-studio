import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ShoppingBag, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
import { categories } from '@/lib/mock-data';
import { useProducts } from '@/lib/api';

type SortKey = 'newest' | 'price-asc' | 'price-desc';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'all';
  const [sort, setSort] = useState<SortKey>('newest');
  const [priceRange, setPriceRange] = useState<string>('all');

  const { data: products = [], isLoading } = useProducts(categoryFilter);

  const filtered = useMemo(() => {
    let list = [...products];
    if (priceRange === 'under-60') list = list.filter((p) => p.price < 60);
    else if (priceRange === '60-100') list = list.filter((p) => p.price >= 60 && p.price <= 100);
    else if (priceRange === 'over-100') list = list.filter((p) => p.price > 100);

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, sort, priceRange]);

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center mb-10">
          <ShoppingBag className="mx-auto h-10 w-10 text-primary mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            {categoryFilter !== 'all'
              ? categories.find((c) => c.slug === categoryFilter)?.name || 'Shop'
              : 'All Jewelry'}
          </h1>
          <p className="mt-2 font-body text-muted-foreground">{filtered.length} pieces</p>
        </motion.div>

        {/* Filters */}
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 p-4 rounded-2xl bg-secondary border border-border">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

            <div className="flex gap-2">
              <Button
                variant={categoryFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchParams({})}
                className="font-body text-xs"
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={categoryFilter === cat.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchParams({ category: cat.slug })}
                  className="font-body text-xs"
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-36 font-body text-xs h-9">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-60">Under $60</SelectItem>
                <SelectItem value="60-100">$60 - $100</SelectItem>
                <SelectItem value="over-100">Over $100</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-36 font-body text-xs h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-20">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-20 text-muted-foreground font-body">
                  No products match your filters.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
