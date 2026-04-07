export interface ChainType {
  id: string;
  name: string;
  basePrice: number;
  image: string;
  description: string;
}

export interface Charm {
  id: string;
  name: string;
  price: number;
  emoji: string; // using emoji as placeholder icons
  category: string;
}

export interface Material {
  id: string;
  name: string;
  priceMultiplier: number;
  color: string; // tailwind-friendly color hint
}

export interface ChainLength {
  id: string;
  label: string;
  inches: number;
  priceAdd: number;
}

export const chainTypes: ChainType[] = [
  { id: 'cuban', name: 'Cuban Link', basePrice: 45, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop', description: 'Bold interlocking links' },
  { id: 'rope', name: 'Rope Chain', basePrice: 35, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop', description: 'Classic twisted spiral' },
  { id: 'figaro', name: 'Figaro', basePrice: 40, image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c3?w=400&h=400&fit=crop', description: 'Alternating flat links' },
  { id: 'box', name: 'Box Chain', basePrice: 30, image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop', description: 'Sleek square links' },
  { id: 'snake', name: 'Snake Chain', basePrice: 38, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop', description: 'Smooth herringbone style' },
];

export const charms: Charm[] = [
  { id: 'heart', name: 'Heart', price: 12, emoji: '❤️', category: 'classic' },
  { id: 'star', name: 'Star', price: 10, emoji: '⭐', category: 'classic' },
  { id: 'moon', name: 'Crescent Moon', price: 14, emoji: '🌙', category: 'celestial' },
  { id: 'sun', name: 'Sun', price: 14, emoji: '☀️', category: 'celestial' },
  { id: 'butterfly', name: 'Butterfly', price: 15, emoji: '🦋', category: 'nature' },
  { id: 'flower', name: 'Flower', price: 13, emoji: '🌸', category: 'nature' },
  { id: 'evil-eye', name: 'Evil Eye', price: 16, emoji: '🧿', category: 'symbolic' },
  { id: 'lock', name: 'Lock', price: 11, emoji: '🔒', category: 'classic' },
  { id: 'key', name: 'Key', price: 11, emoji: '🔑', category: 'classic' },
  { id: 'crown', name: 'Crown', price: 18, emoji: '👑', category: 'luxury' },
  { id: 'diamond', name: 'Diamond', price: 20, emoji: '💎', category: 'luxury' },
  { id: 'leaf', name: 'Leaf', price: 10, emoji: '🍃', category: 'nature' },
];

export const materials: Material[] = [
  { id: 'gold-plated', name: '18K Gold Plated', priceMultiplier: 1.0, color: '#D4B07A' },
  { id: 'sterling-silver', name: 'Sterling Silver', priceMultiplier: 0.85, color: '#C0C0C0' },
  { id: 'rose-gold', name: 'Rose Gold', priceMultiplier: 1.15, color: '#DDB2BC' },
  { id: '14k-gold', name: '14K Solid Gold', priceMultiplier: 2.5, color: '#C9A84C' },
];

export const chainLengths: ChainLength[] = [
  { id: '16', label: '16"', inches: 16, priceAdd: 0 },
  { id: '18', label: '18"', inches: 18, priceAdd: 5 },
  { id: '20', label: '20"', inches: 20, priceAdd: 10 },
  { id: '22', label: '22"', inches: 22, priceAdd: 15 },
  { id: '24', label: '24"', inches: 24, priceAdd: 20 },
];

export function calculatePrice(
  chain: ChainType | null,
  selectedCharms: Charm[],
  material: Material | null,
  length: ChainLength | null
): number {
  if (!chain) return 0;
  const base = chain.basePrice + (length?.priceAdd ?? 0);
  const charmsTotal = selectedCharms.reduce((sum, c) => sum + c.price, 0);
  const multiplier = material?.priceMultiplier ?? 1;
  return Math.round((base + charmsTotal) * multiplier * 100) / 100;
}
