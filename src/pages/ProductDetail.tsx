import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Check, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import StarRating from '@/components/StarRating';
import { useProduct, useProducts } from '@/lib/api';
import { useCartStore } from '@/lib/cart-store';
import { toast } from 'sonner';
import { getProductReviews, getAverageRating } from '@/lib/reviews-data';

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id || '');
  const { data: allProducts = [] } = useProducts();
  const { addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-muted-foreground font-body">
        Product not found.
      </div>
    );
  }

  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0], size: selectedSize });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative overflow-hidden rounded-2xl aspect-square bg-secondary border border-border">
              <img src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--gold)/0.05)_0%,_transparent_70%)]" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            <span className="font-body text-xs font-semibold text-primary uppercase tracking-widest">
              {product.category}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">{product.name}</h1>
            <p className="font-display text-3xl font-bold text-primary mt-4">${product.price.toFixed(2)}</p>

            {getAverageRating(product.id) > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={getAverageRating(product.id)} size="md" />
                <span className="font-body text-sm text-muted-foreground">
                  {getAverageRating(product.id).toFixed(1)} ({getProductReviews(product.id).length} reviews)
                </span>
              </div>
            )}

            <p className="font-body text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

            <div className="mt-6 p-4 rounded-2xl bg-secondary border border-border">
              <span className="font-body text-sm text-muted-foreground">Material</span>
              <p className="font-body text-sm font-semibold text-foreground">{product.material}</p>
            </div>

            {/* Size */}
            <div className="mt-6">
              <span className="font-body text-sm text-muted-foreground mb-2 block">Size</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`relative h-10 min-w-[3rem] rounded-xl border px-3 font-body text-sm font-medium transition-all ${
                      selectedSize === s
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {s}
                    {selectedSize === s && <Check className="absolute -top-1 -right-1 h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full bg-gradient-gold text-primary-foreground font-body font-semibold shadow-gold hover:opacity-90"
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        {getProductReviews(product.id).length > 0 && (
          <section className="mt-20 max-w-5xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-2 mb-8">
              <StarRating rating={getAverageRating(product.id)} size="md" />
              <span className="font-body text-sm text-muted-foreground">
                Based on {getProductReviews(product.id).length} reviews
              </span>
            </div>
            <div className="space-y-6">
              {getProductReviews(product.id).map((review) => (
                <div key={review.id} className="p-5 rounded-2xl bg-secondary border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-body text-sm font-bold text-primary">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <span className="font-body text-sm font-semibold text-foreground">{review.author}</span>
                        {review.verified && (
                          <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                            <CheckCircle className="h-3 w-3" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-body text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <StarRating rating={review.rating} />
                  <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20 max-w-5xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">You Might Also Like</h2>
            <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
