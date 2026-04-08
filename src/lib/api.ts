import { useQuery } from '@tanstack/react-query';
import type { Product } from './mock-data';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://192.168.40.34:3000';

interface ApiProduct {
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
  ar_enabled: boolean;
}

const mapProduct = (p: ApiProduct): Product => ({
  ...p,
  arEnabled: p.ar_enabled,
});

async function fetchProducts(category?: string): Promise<Product[]> {
  const url = new URL(`${API_BASE}/api/products`);
  if (category && category !== 'all') {
    url.searchParams.set('category', category);
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch products');
  const data: ApiProduct[] = await res.json();
  return data.map(mapProduct);
}

async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  const data: ApiProduct = await res.json();
  return mapProduct(data);
}

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category ?? 'all'],
    queryFn: () => fetchProducts(category),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}

// --- Chains & Charms for custom jewelry builder ---

interface ApiChain {
  id: string;
  name: string;
  material: string;
  length_cm: number;
  price: number;
  base_price: number;
  description: string;
  images: string[];
  active: boolean;
}

interface ApiCharm {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  category: string;
  active: boolean;
}

async function fetchChains(): Promise<ApiChain[]> {
  const res = await fetch(`${API_BASE}/api/chains`);
  if (!res.ok) throw new Error('Failed to fetch chains');
  return res.json();
}

async function fetchCharms(): Promise<ApiCharm[]> {
  const res = await fetch(`${API_BASE}/api/charms`);
  if (!res.ok) throw new Error('Failed to fetch charms');
  return res.json();
}

export function useChains() {
  return useQuery({
    queryKey: ['chains'],
    queryFn: fetchChains,
  });
}

export function useCharms() {
  return useQuery({
    queryKey: ['charms'],
    queryFn: fetchCharms,
  });
}
