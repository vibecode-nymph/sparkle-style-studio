import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ARTryOn from '../components/ARTryOn'

interface Product {
  id: string
  name: string
  price: number
  description?: string
  category?: string
  images?: string[]
  ar_enabled?: boolean
}

const API_BASE = 'https://jewellery-api.cloudtunnel.uk/api'

function categoryToProductType(category?: string): 'chain' | 'bracelet' | null {
  if (!category) return null
  const c = category.toLowerCase()
  if (c === 'chains' || c === 'chain' || c === 'necklaces' || c === 'necklace') return 'chain'
  if (c === 'bracelets' || c === 'bracelet') return 'bracelet'
  return null
}

export default function TryOn() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Product | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/products`)
        if (!res.ok) throw new Error(`API error ${res.status}`)
        const data = await res.json()
        // Support both { data: [...] } and [...] response shapes
        const list: Product[] = Array.isArray(data) ? data : data.data ?? []
        // Show only products with a supported category for AR
        const arProducts = list.filter(p => categoryToProductType(p.category) !== null)
        setProducts(arProducts)
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const productType = selected ? categoryToProductType(selected.category) : null

  return (
    <div className="min-h-screen bg-jewel-900 text-stone-200">
      {/* Header */}
      <header className="border-b border-stone-800 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-gold-400 text-sm hover:text-gold-300 transition-colors">
          ← Back
        </Link>
        <h1 className="font-serif text-xl text-gold-400 tracking-widest">Try On with AR</h1>
        <div className="w-12" />
      </header>

      <main className="px-4 py-8 max-w-5xl mx-auto">
        <p className="text-stone-400 text-center mb-8 text-sm">
          Select a piece to try it on virtually using your camera
        </p>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-gold-500/30 border-t-gold-400 animate-spin" />
          </div>
        )}

        {/* Error */}
        {fetchError && (
          <div className="text-center py-20 text-red-400 text-sm">{fetchError}</div>
        )}

        {/* Empty state */}
        {!loading && !fetchError && products.length === 0 && (
          <div className="text-center py-20 text-stone-500 text-sm">
            No AR-compatible products found
          </div>
        )}

        {/* Product grid */}
        {!loading && !fetchError && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map(product => {
              const thumb = product.images?.[0] ?? null
              const type = categoryToProductType(product.category)
              return (
                <button
                  key={product.id}
                  onClick={() => setSelected(product)}
                  className="group bg-jewel-800 border border-stone-700 hover:border-gold-500/60 rounded-lg overflow-hidden text-left transition-all hover:shadow-lg hover:shadow-gold-900/20 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                >
                  <div className="aspect-square bg-jewel-700 overflow-hidden">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-600">
                        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1}>
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="m21 15-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-stone-200 text-sm font-medium truncate">{product.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gold-400 text-xs">£{product.price?.toFixed(2)}</span>
                      <span className="text-stone-500 text-xs capitalize">{type}</span>
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <span className="block w-full text-center bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs py-1.5 rounded transition-colors">
                      Try On
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </main>

      {/* AR modal */}
      {selected && productType && (
        <ARTryOn
          productImage={selected.images?.[0] ?? ''}
          productType={productType}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
