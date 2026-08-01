import { useEffect, useState } from 'react'
import { StoreLayout } from '../components/layout/StoreLayout'
import { Hero } from '../components/layout/Hero'
import { ProductGrid } from '../components/product/ProductGrid'

import {
  getProducts,
  type Product,
} from '../services/products'

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <>
      <StoreLayout>

        <main>
          <Hero />

          <section
            id="shop"
            className="mx-auto max-w-7xl px-6 py-16 lg:py-24"
          >
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Shop
                </p>

                <h2 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">
                  Latest pieces
                </h2>
              </div>

              <span className="text-sm text-neutral-500">
                {products.length} products
              </span>
            </div>

            {loading && (
              <p className="py-20 text-center text-sm text-neutral-500">
                Loading products...
              </p>
            )}

            {error && (
              <p className="py-20 text-center text-sm text-red-600">
                {error}
              </p>
            )}

            {!loading && !error && (
              <ProductGrid products={products} />
            )}
          </section>
        </main>

      </StoreLayout>
    </>
  )
}