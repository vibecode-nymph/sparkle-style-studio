import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Gem, X, Plus, ShoppingBag, Sparkles, Loader2 } from 'lucide-react';
import NameNecklacePreview from '@/components/NameNecklacePreview';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart-store';
import { toast } from 'sonner';
import { useChains, useCharms } from '@/lib/api';
import {
  materials,
  chainLengths,
  calculatePrice,
  type ChainType,
  type Charm,
  type Material,
  type ChainLength,
} from '@/lib/custom-jewelry-data';

const NAME_CHARM_PRICE = 18;

const NAME_FONTS: { id: 'serif' | 'script' | 'modern'; label: string; family: string }[] = [
  { id: 'serif', label: 'Serif', family: "'Playfair Display', serif" },
  { id: 'script', label: 'Script', family: "'Dancing Script', cursive" },
  { id: 'modern', label: 'Modern', family: "'Montserrat', sans-serif" },
];

const CreateJewelry = () => {
  const { data: chainsData, isLoading: chainsLoading } = useChains();
  const { data: charmsData, isLoading: charmsLoading } = useCharms();

  const chainTypes = useMemo(() =>
    chainsData?.map((c) => ({
      id: c.id,
      name: c.name,
      basePrice: c.base_price || c.price,
      image: c.images?.[0] || '',
      description: c.description,
    })) ?? [], [chainsData]);

  const charmsList = useMemo(() =>
    charmsData?.map((c) => ({
      id: c.id,
      name: c.name,
      price: c.price,
      emoji: c.emoji || '💎',
      category: c.category,
    })) ?? [], [charmsData]);

  const [selectedChain, setSelectedChain] = useState<ChainType | null>(null);
  const [selectedCharms, setSelectedCharms] = useState<(Charm & { uid: string })[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(materials[0]);
  const [selectedLength, setSelectedLength] = useState<ChainLength>(chainLengths[1]);
  const [customName, setCustomName] = useState('');
  const [nameFont, setNameFont] = useState<'serif' | 'script' | 'modern'>('script');
  const [step, setStep] = useState(0);

  const addCharm = useCallback((charm: Charm) => {
    if (selectedCharms.length >= 5) {
      toast.error('Maximum 5 charms per chain');
      return;
    }
    setSelectedCharms((prev) => [...prev, { ...charm, uid: `${charm.id}-${Date.now()}` }]);
  }, [selectedCharms.length]);

  const removeCharm = useCallback((uid: string) => {
    setSelectedCharms((prev) => prev.filter((c) => c.uid !== uid));
  }, []);

  const hasNameCharm = customName.trim().length > 0;
  const basePrice = calculatePrice(selectedChain, selectedCharms, selectedMaterial, selectedLength);
  const price = hasNameCharm ? basePrice + NAME_CHARM_PRICE : basePrice;

  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (!selectedChain) {
      toast.error('Please select a chain type first');
      return;
    }
    const nameSuffix = hasNameCharm ? ` — "${customName.trim().toUpperCase()}"` : '';
    addItem({
      id: `custom-${Date.now()}`,
      name: `Custom ${selectedChain.name}${nameSuffix}`,
      price,
      image: selectedChain.image,
      size: selectedLength.label,
      material: `${selectedMaterial.name}${hasNameCharm ? ` · Name: ${customName.trim()} (${NAME_FONTS.find(f => f.id === nameFont)?.label})` : ''}`,
    });
    toast.success('Custom piece added to cart!');
  };

  const charmCategories = [...new Set(charmsList.map((c) => c.category))];
  // fontFamily still used for the font picker preview labels
  const selectedFontFamily = NAME_FONTS.find(f => f.id === nameFont)?.family || '';

  if (chainsLoading || charmsLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <Sparkles className="mx-auto h-10 w-10 text-primary mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            <span className="text-gradient-gold">Create</span> Your Own
          </h1>
          <p className="mt-3 font-body text-muted-foreground text-lg">
            Design a one-of-a-kind piece — pick your chain, add charms, choose your finish
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Left: builder panels */}
          <div className="space-y-8">
            {/* 1. Chain type */}
            <BuilderSection title="1. Choose Your Chain" subtitle="The foundation of your piece">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {chainTypes.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => setSelectedChain(chain)}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all ${
                      selectedChain?.id === chain.id
                        ? 'border-primary shadow-gold'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="aspect-square bg-secondary">
                      <img src={chain.image} alt={chain.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3 bg-card">
                      <p className="font-body text-sm font-semibold text-foreground">{chain.name}</p>
                      <p className="font-body text-xs text-muted-foreground">${chain.basePrice}</p>
                    </div>
                    {selectedChain?.id === chain.id && (
                      <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Gem className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </BuilderSection>

            {/* 2. Add charms */}
            <BuilderSection title="2. Add Charms" subtitle="Drag to reorder · max 5">
              {charmCategories.map((cat) => (
                <div key={cat} className="mb-4">
                  <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {cat}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {charmsList
                      .filter((c) => c.category === cat)
                      .map((charm) => (
                        <button
                          key={charm.id}
                          onClick={() => addCharm(charm)}
                          className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 hover:border-primary/40 hover:bg-secondary transition-all group"
                        >
                          <span className="text-lg">{charm.emoji}</span>
                          <span className="font-body text-xs font-medium text-foreground">{charm.name}</span>
                          <span className="font-body text-xs text-muted-foreground">+${charm.price}</span>
                          <Plus className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </BuilderSection>

            {/* 3. Material */}
            <BuilderSection title="3. Pick Material" subtitle="Choose your metal finish">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {materials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`rounded-xl border-2 p-4 text-center transition-all ${
                      selectedMaterial.id === mat.id
                        ? 'border-primary shadow-gold'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div
                      className="mx-auto h-8 w-8 rounded-full mb-2 border border-border"
                      style={{ backgroundColor: mat.color }}
                    />
                    <p className="font-body text-xs font-semibold text-foreground">{mat.name}</p>
                    <p className="font-body text-[10px] text-muted-foreground">
                      {mat.priceMultiplier === 1 ? 'Base' : `×${mat.priceMultiplier}`}
                    </p>
                  </button>
                ))}
              </div>
            </BuilderSection>

            {/* 4. Length */}
            <BuilderSection title="4. Select Length" subtitle="Choose the perfect fit">
              <div className="flex flex-wrap gap-2">
                {chainLengths.map((len) => (
                  <button
                    key={len.id}
                    onClick={() => setSelectedLength(len)}
                    className={`rounded-full border-2 px-5 py-2 font-body text-sm font-medium transition-all ${
                      selectedLength.id === len.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {len.label}
                    {len.priceAdd > 0 && (
                      <span className="ml-1 text-xs text-muted-foreground">+${len.priceAdd}</span>
                    )}
                  </button>
                ))}
              </div>
            </BuilderSection>

            {/* 5. Name Charm */}
            <BuilderSection title="5. Name Charm (Optional)" subtitle={`Add your name to the chain · +$${NAME_CHARM_PRICE}`}>
              <div className="space-y-4">
                {/* Name input */}
                <div>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.slice(0, 12))}
                    placeholder="Enter your name..."
                    maxLength={12}
                    className="w-full rounded-xl border-2 border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  <p className="font-body text-xs text-muted-foreground mt-1.5">
                    {customName.length}/12 characters
                  </p>
                </div>

                {/* Font picker */}
                <div>
                  <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Font Style
                  </p>
                  <div className="flex gap-2">
                    {NAME_FONTS.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setNameFont(font.id)}
                        className={`flex-1 rounded-xl border-2 py-3 px-3 text-center transition-all ${
                          nameFont === font.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <span
                          className="block text-lg text-foreground"
                          style={{ fontFamily: font.family }}
                        >
                          Aa
                        </span>
                        <span className="font-body text-[10px] text-muted-foreground mt-1 block">
                          {font.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live pendant preview */}
                <NameNecklacePreview
                  name={customName}
                  fontId={nameFont}
                  material={
                    selectedMaterial.name.toLowerCase().includes('rose')
                      ? 'rose-gold'
                      : selectedMaterial.name.toLowerCase().includes('silver')
                      ? 'silver'
                      : 'gold'
                  }
                  size="md"
                />
              </div>
            </BuilderSection>
          </div>

          {/* Right: live preview & summary */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Preview */}
            <motion.div
              layout
              className="rounded-2xl border border-border bg-secondary overflow-hidden"
            >
              <div className="aspect-square relative bg-card flex items-center justify-center">
                {selectedChain ? (
                  <img
                    src={selectedChain.image}
                    alt={selectedChain.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <Gem className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                    <p className="font-body text-sm text-muted-foreground">Select a chain to start</p>
                  </div>
                )}
                {/* Charm overlay */}
                {selectedCharms.length > 0 && (
                  <div className="absolute bottom-4 left-4 right-4 flex gap-1 justify-center">
                    {selectedCharms.map((c) => (
                      <motion.span
                        key={c.uid}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="text-2xl drop-shadow-lg"
                      >
                        {c.emoji}
                      </motion.span>
                    ))}
                  </div>
                )}
                {/* Name charm overlay */}
                {hasNameCharm && (
                  <div className="absolute bottom-14 left-0 right-0">
                    <NameNecklacePreview
                      name={customName}
                      fontId={nameFont}
                      material={
                        selectedMaterial.name.toLowerCase().includes('rose')
                          ? 'rose-gold'
                          : selectedMaterial.name.toLowerCase().includes('silver')
                          ? 'silver'
                          : 'gold'
                      }
                      size="sm"
                    />
                  </div>
                )}
                {selectedChain && (
                  <div className="absolute top-3 left-3 rounded-full bg-background/80 backdrop-blur px-3 py-1">
                    <span className="font-body text-xs font-medium text-foreground">
                      {selectedMaterial.name}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Selected charms list (reorderable) */}
            {selectedCharms.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Your Charms ({selectedCharms.length}/5)
                </p>
                <Reorder.Group
                  axis="y"
                  values={selectedCharms}
                  onReorder={setSelectedCharms as any}
                  className="space-y-2"
                >
                  <AnimatePresence>
                    {selectedCharms.map((charm) => (
                      <Reorder.Item
                        key={charm.uid}
                        value={charm}
                        className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{charm.emoji}</span>
                          <span className="font-body text-sm text-foreground">{charm.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-body text-xs text-muted-foreground">${charm.price}</span>
                          <button
                            onClick={() => removeCharm(charm.uid)}
                            className="h-5 w-5 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                          >
                            <X className="h-3 w-3 text-destructive" />
                          </button>
                        </div>
                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              </div>
            )}

            {/* Price summary */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="space-y-2 font-body text-sm">
                {selectedChain && (
                  <>
                    <div className="flex justify-between text-foreground">
                      <span>{selectedChain.name}</span>
                      <span>${selectedChain.basePrice}</span>
                    </div>
                    {selectedCharms.length > 0 && (
                      <div className="flex justify-between text-foreground">
                        <span>Charms ({selectedCharms.length})</span>
                        <span>${selectedCharms.reduce((s, c) => s + c.price, 0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-foreground">
                      <span>Length ({selectedLength.label})</span>
                      <span>{selectedLength.priceAdd > 0 ? `+$${selectedLength.priceAdd}` : 'Included'}</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>{selectedMaterial.name}</span>
                      <span>×{selectedMaterial.priceMultiplier}</span>
                    </div>
                    {hasNameCharm && (
                      <div className="flex justify-between text-primary font-medium">
                        <span>Name Charm</span>
                        <span>+${NAME_CHARM_PRICE}</span>
                      </div>
                    )}
                    <div className="border-t border-border my-2" />
                  </>
                )}
                <div className="flex justify-between font-semibold text-lg text-foreground">
                  <span>Total</span>
                  <span className="text-gradient-gold">${price.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={!selectedChain}
                className="w-full mt-4 bg-gradient-gold text-primary-foreground font-body font-semibold shadow-gold hover:opacity-90"
                size="lg"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function BuilderSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
      <p className="font-body text-sm text-muted-foreground mb-4">{subtitle}</p>
      {children}
    </motion.div>
  );
}

export default CreateJewelry;
