import { useState } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '../lib/supabase'
import { StoreLayout } from '../components/layout/StoreLayout'

type OrderHistoryItem = {
  id: string
  order_number: string
  status: string
  subtotal: number
  shipping_fee: number
  total: number
  shipping_first_name: string
  shipping_last_name: string
  created_at: string
}

export function OrderHistoryPage() {
  const [email, setEmail] = useState('')

  const [orders, setOrders] =
    useState<OrderHistoryItem[]>([])

  const [loading, setLoading] =
    useState(false)

  const [searched, setSearched] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const handleSearch = async () => {
    setError(null)

    if (!email.trim()) {
      setError(
        'Please enter your email address.'
      )
      return
    }

    try {
      setLoading(true)
      setSearched(true)

      const { data, error } =
        await supabase.rpc(
          'get_order_history',
          {
            p_email: email.trim(),
          }
        )

      if (error) {
        throw error
      }

      if (!data?.success) {
        throw new Error(
          'We could not load your orders.'
        )
      }

      setOrders(data.orders ?? [])
    } catch (err) {
      console.error(
        'Failed to load order history:',
        err
      )

      setOrders([])

      setError(
        err instanceof Error
          ? err.message
          : 'We could not load your orders.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <StoreLayout>
      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-20">

        {/* Header */}

        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Orders
          </p>

          <h1 className="mt-2 text-4xl font-medium tracking-tight">
            Order history
          </h1>

          <p className="mt-4 text-sm leading-6 text-neutral-500">
            Enter the email address used when
            placing your order to view your
            previous purchases.
          </p>
        </div>

        {/* Search */}

        <div className="mt-10 max-w-xl">
          <label
            htmlFor="order-email"
            className="mb-2 block text-xs uppercase tracking-[0.1em]"
          >
            Email address
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="order-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch()
                }
              }}
              placeholder="you@example.com"
              className="min-w-0 flex-1 border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="bg-black px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80 disabled:cursor-wait disabled:opacity-50"
            >
              {loading
                ? 'Searching...'
                : 'Find my orders'}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Results */}

        {searched && !loading && !error && (
          <section className="mt-16">

            <div className="flex items-end justify-between border-b border-black pb-4">
              <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                Your orders
              </h2>

              <span className="text-xs text-neutral-500">
                {orders.length}{' '}
                {orders.length === 1
                  ? 'order'
                  : 'orders'}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-neutral-500">
                  No orders were found for this
                  email address.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">

                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-6 py-7 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>
                      <p className="font-mono text-sm">
                        {order.order_number}
                      </p>

                      <p className="mt-2 text-xs text-neutral-500">
                        {new Date(
                          order.created_at
                        ).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </p>

                      <p className="mt-2 text-xs capitalize text-neutral-500">
                        {order.status}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-8 sm:justify-end">

                      <p className="text-sm font-medium">
                        $
                        {Number(
                          order.total
                        ).toFixed(2)}
                      </p>

                      <Link
                        to={`/order-success/${order.order_number}`}
                        className="border border-black px-5 py-3 text-xs font-medium uppercase tracking-[0.15em] transition-colors hover:bg-black hover:text-white"
                      >
                        View order
                      </Link>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>
        )}

      </main>
    </StoreLayout>
  )
}