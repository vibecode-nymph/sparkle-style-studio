export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  material: string;
  category: string;
  images: string[];
  sizes: string[];
  featured: boolean;
  trending: boolean;
  arEnabled: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Chains',
    slug: 'chains',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
    description: 'Statement chains that define your style',
  },
  {
    id: '2',
    name: 'Bracelets',
    slug: 'bracelets',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop',
    description: 'Bold bracelets for every occasion',
  },
  {
    id: '3',
    name: 'Name Chains',
    slug: 'name-chains',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&h=600&fit=crop',
    description: 'Personalized name chains crafted just for you',
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Cuban Link Chain',
    price: 89.99,
    description: 'A bold 18K gold-plated Cuban link chain that commands attention. Crafted with precision, this heavyweight piece features interlocking links for a luxurious drape.',
    material: '18K Gold Plated Stainless Steel',
    category: 'chains',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
    ],
    sizes: ['18"', '20"', '22"', '24"'],
    featured: true,
    trending: true,
    arEnabled: true,
  },
  {
    id: '2',
    name: 'Rope Chain',
    price: 69.99,
    description: 'Classic twisted rope chain with a modern edge. Its spiral design catches light from every angle, making it perfect for layering or wearing solo.',
    material: 'Sterling Silver',
    category: 'chains',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
    ],
    sizes: ['18"', '20"', '22"'],
    featured: false,
    trending: true,
    arEnabled: true,
  },
  {
    id: '3',
    name: 'Figaro Chain',
    price: 79.99,
    description: 'Italian-inspired Figaro chain featuring alternating flat links. A timeless pattern with a bold, contemporary weight.',
    material: '14K Gold Plated',
    category: 'chains',
    images: [
      'https://images.unsplash.com/photo-1515562141589-67f0d569b6c3?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
    ],
    sizes: ['18"', '20"', '24"'],
    featured: true,
    trending: false,
    arEnabled: true,
  },
  {
    id: '4',
    name: 'Box Chain',
    price: 59.99,
    description: 'Sleek and geometric box chain with square links. Minimalist yet striking — the perfect foundation piece.',
    material: 'Stainless Steel',
    category: 'chains',
    images: [
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
    ],
    sizes: ['18"', '20"'],
    featured: false,
    trending: true,
    arEnabled: true,
  },
  {
    id: '5',
    name: 'Chunky Gold Cuff',
    price: 54.99,
    description: 'A statement cuff bracelet with hammered gold finish. Bold, adjustable, and effortlessly cool.',
    material: '18K Gold Plated Brass',
    category: 'bracelets',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
    ],
    sizes: ['S', 'M', 'L'],
    featured: true,
    trending: true,
    arEnabled: false,
  },
  {
    id: '6',
    name: 'Tennis Bracelet',
    price: 119.99,
    description: 'Crystal-studded tennis bracelet that sparkles with every movement. A red-carpet staple made accessible.',
    material: 'Sterling Silver with CZ Stones',
    category: 'bracelets',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
    ],
    sizes: ['S', 'M', 'L'],
    featured: true,
    trending: false,
    arEnabled: false,
  },
  {
    id: '7',
    name: 'Link Bracelet',
    price: 64.99,
    description: 'Oversized chain link bracelet with a toggle clasp. Heavy, luxurious, and unapologetically bold.',
    material: '18K Gold Plated Stainless Steel',
    category: 'bracelets',
    images: [
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
    ],
    sizes: ['S', 'M', 'L'],
    featured: false,
    trending: true,
    arEnabled: false,
  },
  {
    id: '8',
    name: 'Snake Chain',
    price: 74.99,
    description: 'Sleek herringbone-style snake chain that lays flat against the skin. Liquid gold in motion.',
    material: '14K Gold Plated',
    category: 'chains',
    images: [
      'https://images.unsplash.com/photo-1515562141589-67f0d569b6c3?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=800&fit=crop',
    ],
    sizes: ['16"', '18"', '20"'],
    featured: false,
    trending: true,
    arEnabled: true,
  },
];
