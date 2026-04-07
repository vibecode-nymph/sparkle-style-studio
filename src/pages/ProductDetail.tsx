import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ARTryOn from '../components/ARTryOn'

interface Product {
  id: string
  name: string
  price: number
  description?: string
  material?: string
  category?: string
  images?: string[]
  sizes?: string[]
  stock?: number
}

const API_BASE = 'https://jewellery-api.cloudtunnel.uk/api'

function categoryToProductType(category?: string): 'chain' | 'bracelet' | null {
  if (!category) return null
  const c = category.toLowerCase()
  if (c === 'chains' || c === 'chain' || c === 'necklaces' || c === 'necklace') return 'chain'
  if (c === 'bracelets' || c === 'bracelet') return 'bracelet'
  return null
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [arOpen, setArOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/products/${id}`)
        if (!res.ok) throw new Error(`Product not found (${res.status})`)
        const data = await res.json()
        const p: Product = data.data ?? data
        setProduct(p)
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-jewel-900 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-gold-500/30 border-t-gold-400 animate-spin" />
      </div>
    )
  }

  if (fetchError || !product) {
    return (
      <div className="min-h-screen bg-jewel-900 flex flex-col items-center justify-center gap-4 text-stone-400">
        <p>{fetchError ?? 'Product not found'}</p>
        <Link to="/" className="text-gold-400 text-sm hover:underline">← Back to home</Link>
      </div>
    )
  }

  const productType = categoryToProductType(product.category)
  const images = product.images ?? []
  const currentImage = images[activeImage] ?? null

  return (
    <div className="min-h-screen bg-jewel-900 text-stone-200">
      {/* Header */}
      <header className="border-b border-stone-800 px-6 py-4">
        <Link to="/" className="text-gold-400 text-sm hover:text-gold-300 transition-colors">
          ← Back
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 md:grid md:grid-cols-2 md:gap-12">
        {/* Image gallery */}
        <div className="space-y-3">
          <div className="aspect-square bg-jewel-800 rounded-lg overflow-hidden border border-stone-700">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-600">
                <svg viewBox="0 0 24 24" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={1}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded border overflow-hidden transition-colors ${
                    i === activeImage ? 'border-gold-400' : 'border-stone-700 hover:border-stone-500'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="mt-8 md:mt-0 flex flex-col">
          {product.category && (
            <span className="text-gold-500 text-xs tracking-widest uppercase mb-2">
              {product.category}
            </span>
          )}
          <h1 className="font-serif text-3xl text-stone-100 leading-tight mb-3">
            {product.name}
          </h1>
          <p className="text-gold-400 text-2xl mb-4">£{product.price?.toFixed(2)}</p>

          {product.description && (
            <p className="text-stone-400 text-sm leading-relaxed mb-4">{product.description}</p>
          )}

          {product.material && (
            <div className="flex items-center gap-2 text-sm text-stone-400 mb-4">
              <span className="text-stone-500">Material:</span>
              <span>{product.material}</span>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-stone-400 text-sm mb-2">Available sizes</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <span
                    key={s}
                    className="px-3 py-1 text-xs border border-stone-600 text-stone-300 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto space-y-3 pt-4">
            {/* AR Try On button — shown when product type is supported */}
            {productType && currentImage && (
              <button
                onClick={() => setArOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/60 text-gold-400 hover:text-gold-300 py-3 px-6 rounded transition-colors font-medium"
              >
                {/* Camera / AR icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                Try On with AR
              </button>
            )}

            <button
              className="w-full bg-gold-500 hover:bg-gold-400 text-jewel-900 font-semibold py-3 px-6 rounded transition-colors"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </main>

      {/* AR fullscreen modal */}
      {arOpen && productType && currentImage && (
        <ARTryOn
          productImage={currentImage}
          productType={productType}
          onClose={() => setArOpen(false)}
        />
      )}
    </div>
  )
}
