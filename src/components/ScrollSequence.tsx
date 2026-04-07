import { useRef, useState, useCallback, useEffect } from 'react';
import { Gem } from 'lucide-react';

const frames = [
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1515562141589-67f0d569b6c3?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=1200&h=800&fit=crop',
];

const captions = [
  'Crafted with Precision',
  'Timeless Elegance',
  'Bold Statements',
  'Modern Luxury',
  'Everyday Glamour',
  'Radiant Details',
  'Golden Hour',
  'Your Signature Piece',
];

const ScrollSequence = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const scrollTop = el.scrollTop;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;
    const pct = scrollTop / maxScroll;
    setProgress(pct);
    const frameIndex = Math.min(Math.floor(pct * frames.length), frames.length - 1);
    setCurrentFrame(frameIndex);
  }, []);

  // Preload images
  useEffect(() => {
    frames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <Gem className="mx-auto h-10 w-10 text-primary mb-4" />
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          The Collection
        </h2>
        <p className="mt-2 font-body text-muted-foreground">
          Scroll to explore our craftsmanship
        </p>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Fixed display area */}
        <div className="sticky top-0 rounded-2xl overflow-hidden border border-border bg-secondary aspect-[2.5/1] pointer-events-none select-none">
          {frames.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={captions[i]}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-150"
              style={{ opacity: i === currentFrame ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <p className="font-display text-2xl md:text-3xl font-bold text-foreground transition-opacity duration-150">
              {captions[currentFrame]}
            </p>
            <span className="font-body text-xs text-muted-foreground mt-2 block">
              {currentFrame + 1} / {frames.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="absolute top-4 left-4 right-4 h-1 rounded-full bg-border/50 overflow-hidden">
            <div
              className="h-full bg-gradient-gold rounded-full transition-[width] duration-100"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Internal scroll driver — overlays the sticky area */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Tall spacer to create scroll room: each frame gets ~100vh of scroll */}
          <div style={{ height: `${frames.length * 100}vh` }} />
        </div>
      </div>
    </section>
  );
};

export default ScrollSequence;
