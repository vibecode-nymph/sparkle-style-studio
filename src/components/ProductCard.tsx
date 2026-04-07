import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/mock-data';
import { useCartStore } from '@/lib/cart-store';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCartStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl aspect-square bg-secondary border border-border">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--gold)/0.05)_0%,_transparent_70%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {product.arEnabled && (
            <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold text-primary-foreground backdrop-blur-sm">
              <Sparkles className="h-3 w-3" /> AR Try-On
            </span>
          )}

          {product.trending && (
            <span className="absolute top-3 right-3 rounded-full bg-accent/90 px-2.5 py-1 text-[10px] font-semibold text-accent-foreground backdrop-blur-sm">
              Trending
            </span>
          )}
        </div>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-body text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">{product.material}</p>
          <p className="text-sm font-bold text-primary mt-1">${product.price.toFixed(2)}</p>
        </div>
        <button
          onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0] })}
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
