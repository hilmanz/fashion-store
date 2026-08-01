import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { StoreLayout } from '../components/layout/StoreLayout'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductOptions } from '../components/product/ProductOptions'
import { useCart } from '../context/CartContext'

import {
  getProductBySlug,
  type Product,
} from '../services/products'

export function ProductPage() {
  const { slug } = useParams()

  const { addToCart } = useCart()

  const [product, setProduct] =
    useState<Product | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedSize, setSelectedSize] =
    useState<string | null>(null)

  const [selectedColor, setSelectedColor] =
    useState<string | null>(null)

  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return

      try {
        const data = await getProductBySlug(slug)

        setProduct(data)
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

    loadProduct()
  }, [slug])

  const selectedVariant = useMemo(() => {
    if (!product) return null

    return (
      product.variants.find(
        (variant) =>
          (!selectedSize ||
            variant.size === selectedSize) &&
          (!selectedColor ||
            variant.color === selectedColor)
      ) ?? null
    )
  }, [
    product,
    selectedSize,
    selectedColor,
  ])

  if (loading) {
    return (
      <>
        <StoreLayout>

          <main className="flex min-h-[70vh] items-center justify-center">
            <p className="text-sm text-neutral-500">
              Loading product...
            </p>
          </main>

        </StoreLayout>
      </>
    )
  }

  if (error) {
    return (
      <>
        <StoreLayout>

          <main className="flex min-h-[70vh] items-center justify-center px-6">
            <div className="text-center">
              <p className="text-sm text-red-600">
                {error}
              </p>

              <Link
                to="/"
                className="mt-5 inline-block text-sm underline underline-offset-4"
              >
                Back to store
              </Link>
            </div>
          </main>

        </StoreLayout>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <StoreLayout>

          <main className="flex min-h-[70vh] items-center justify-center px-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                404
              </p>

              <h1 className="mt-3 text-3xl font-medium">
                Product not found
              </h1>

              <Link
                to="/"
                className="mt-5 inline-block text-sm underline underline-offset-4"
              >
                Back to store
              </Link>
            </div>
          </main>

        </StoreLayout>
      </>
    )
  }

  const currentPrice =
    selectedVariant?.price ?? product.price

  const maxStock =
    selectedVariant?.stock ?? 0

  return (
    <>
      <StoreLayout>

        <main className="mx-auto max-w-7xl px-6 py-10 lg:py-16">
          <div className="mb-8">
            <Link
              to="/"
              className="text-xs uppercase tracking-[0.15em] text-neutral-500 hover:text-black"
            >
              ← Back to shop
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Gallery */}
            <ProductGallery
              images={product.images}
              productName={product.name}
            />

            {/* Product information */}
            <div className="lg:py-8">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                {product.category?.name}
              </p>

              <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <span className="text-lg">
                  ${currentPrice.toFixed(2)}
                </span>

                {product.compare_at_price && (
                  <span className="text-sm text-neutral-400 line-through">
                    $
                    {product.compare_at_price.toFixed(
                      2
                    )}
                  </span>
                )}
              </div>

              {product.description && (
                <p className="mt-6 max-w-lg text-sm leading-7 text-neutral-500">
                  {product.description}
                </p>
              )}

              <div className="my-8 border-t border-neutral-200" />

              <ProductOptions
                variants={product.variants}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSizeChange={setSelectedSize}
                onColorChange={setSelectedColor}
              />

              <div className="my-8 border-t border-neutral-200" />

              {/* Quantity */}
              <div>
                <span className="text-xs uppercase tracking-[0.15em]">
                  Quantity
                </span>

                <div className="mt-3 flex w-32 items-center border border-neutral-300">
                  <button
                    type="button"
                    className="flex h-11 w-10 items-center justify-center"
                    onClick={() =>
                      setQuantity((value) =>
                        Math.max(1, value - 1)
                      )
                    }
                  >
                    −
                  </button>

                  <span className="flex-1 text-center text-sm">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    className="flex h-11 w-10 items-center justify-center"
                    onClick={() =>
                      setQuantity((value) =>
                        Math.min(
                          maxStock || 99,
                          value + 1
                        )
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                type="button"
                disabled={
                  product.variants.length > 0 &&
                  (!selectedVariant ||
                    selectedVariant.stock <= 0)
                }
                onClick={() => {
                  addToCart(
                    product,
                    selectedVariant,
                    quantity
                  )
                }}
                className="mt-8 w-full bg-black px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                Add to bag
              </button>

              {selectedVariant && (
                <p className="mt-3 text-center text-xs text-neutral-500">
                  {selectedVariant.stock} available
                </p>
              )}
            </div>
          </div>
        </main>

      </StoreLayout>
    </>
  )
}