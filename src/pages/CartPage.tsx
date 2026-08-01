import { Link } from 'react-router-dom'

import { StoreLayout } from '../components/layout/StoreLayout'
import { useCart } from '../context/CartContext'

export function CartPage() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeFromCart,
  } = useCart()

  if (items.length === 0) {
    return (
      <StoreLayout>
        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-16">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Your bag
            </p>

            <h1 className="mt-3 text-3xl font-medium">
              Your bag is empty
            </h1>

            <Link
              to="/shop"
              className="mt-7 inline-flex bg-black px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white"
            >
              Continue shopping
            </Link>
          </div>
        </main>
      </StoreLayout>
    )
  }

  return (
    <StoreLayout>
      <main className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Your bag
          </p>

          <h1 className="mt-2 text-4xl font-medium tracking-tight">
            Shopping Bag
          </h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* Items */}
          <div className="divide-y divide-neutral-200">
            {items.map((item) => {
              const price =
                item.variant?.price ??
                item.product.price

              const image =
                [...item.product.images].sort(
                  (a, b) =>
                    a.sort_order - b.sort_order
                )[0]

              return (
                <div
                  key={`${item.product.id}-${item.variant?.id}`}
                  className="flex gap-5 py-6 first:pt-0"
                >
                  <div className="h-32 w-24 shrink-0 overflow-hidden bg-neutral-100 sm:h-40 sm:w-32">
                    {image && (
                      <img
                        src={image.image_url}
                        alt={
                          item.product.name
                        }
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h2 className="text-sm font-medium">
                          {item.product.name}
                        </h2>

                        {item.variant?.color && (
                          <p className="mt-1 text-xs text-neutral-500">
                            Color:{' '}
                            {item.variant.color}
                          </p>
                        )}

                        {item.variant?.size && (
                          <p className="mt-1 text-xs text-neutral-500">
                            Size:{' '}
                            {item.variant.size}
                          </p>
                        )}
                      </div>

                      <span className="text-sm">
                        $
                        {(
                          price *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-6">
                      <div className="flex border border-neutral-300">
                        <button
                          type="button"
                          className="h-9 w-9"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.variant?.id ??
                              null,
                              item.quantity - 1
                            )
                          }
                        >
                          −
                        </button>

                        <span className="flex h-9 w-9 items-center justify-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          className="h-9 w-9"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.variant?.id ??
                              null,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.product.id,
                            item.variant?.id ??
                            null
                          )
                        }
                        className="text-xs text-neutral-500 underline underline-offset-4 hover:text-black"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <aside className="h-fit border-t border-black pt-6 lg:border-t-0 lg:pt-0">
            <h2 className="text-xs uppercase tracking-[0.15em]">
              Summary
            </h2>

            <div className="mt-6 flex justify-between text-sm">
              <span>Subtotal</span>

              <span>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-neutral-500">
              Shipping and taxes will be calculated
              during checkout.
            </p>

            <Link
              to="/checkout"
              className="mt-8 flex w-full justify-center bg-black px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80"
            >
              Proceed to checkout
            </Link>

            <Link
              to="/shop"
              className="mt-4 flex w-full justify-center border border-neutral-300 px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] transition-colors hover:border-black"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </main>
    </StoreLayout>
  )
}