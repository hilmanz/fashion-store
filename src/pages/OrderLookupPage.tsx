import { useState } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '../lib/supabase'
import { StoreLayout } from '../components/layout/StoreLayout'

type Order = {
  id: string
  order_number: string
  status: string
  subtotal: number
  shipping_fee: number
  total: number
  shipping_first_name: string
  shipping_last_name: string
  shipping_phone: string | null
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  shipping_country: string
  created_at: string
}

type Payment = {
  payment_method: string
  transaction_reference: string
  amount: number
  status: string
}

type OrderItem = {
  id: string
  product_id: string
  variant_id: string | null
  product_name: string
  sku: string | null
  size: string | null
  color: string | null
  quantity: number
  unit_price: number
  subtotal: number
}

type LookupResult = {
  success: boolean
  message?: string
  order?: Order
  payment?: Payment | null
  items?: OrderItem[]
}

export function OrderLookupPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')

  const [result, setResult] =
    useState<LookupResult | null>(null)

  const [isLoading, setIsLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const handleLookup = async () => {
    setError(null)
    setResult(null)

    if (!orderNumber.trim()) {
      setError('Please enter your order number.')
      return
    }

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    try {
      setIsLoading(true)

      const { data, error } =
        await supabase.rpc(
          'lookup_order',
          {
            p_order_number:
              orderNumber.trim(),
            p_email: email.trim(),
          }
        )

      if (error) {
        throw error
      }

      if (!data?.success) {
        setError(
          data?.message ||
          'We could not find an order matching those details.'
        )
        return
      }

      setResult(data)
    } catch (err) {
      console.error(
        'Order lookup failed:',
        err
      )

      setError(
        'We could not retrieve your order right now. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <StoreLayout>
      <main className="mx-auto max-w-5xl px-6 py-12 lg:py-20">

        {/* Header */}

        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Order lookup
          </p>

          <h1 className="mt-2 text-4xl font-medium tracking-tight">
            Find your order
          </h1>

          <p className="mt-4 text-sm leading-6 text-neutral-500">
            Enter your order number and the email
            address used during checkout to view
            your order details.
          </p>
        </div>

        {/* Lookup form */}

        <section className="mt-12 max-w-xl border-t border-black pt-8">
          <div className="space-y-6">

            {/* Order number */}

            <div>
              <label
                htmlFor="orderNumber"
                className="mb-2 block text-xs uppercase tracking-[0.1em]"
              >
                Order number
              </label>

              <input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(event) =>
                  setOrderNumber(event.target.value)
                }
                placeholder="AT-20260801-A375D1"
                className="w-full border border-neutral-300 px-4 py-3 text-sm uppercase outline-none transition-colors focus:border-black"
              />
            </div>

            {/* Email */}

            <div>
              <label
                htmlFor="lookupEmail"
                className="mb-2 block text-xs uppercase tracking-[0.1em]"
              >
                Email address
              </label>

              <input
                id="lookupEmail"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
              />
            </div>

            {/* Error */}

            {error && (
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Button */}

            <button
              type="button"
              onClick={handleLookup}
              disabled={isLoading}
              className="w-full bg-black px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80 disabled:cursor-wait disabled:opacity-50"
            >
              {isLoading
                ? 'Finding order...'
                : 'Find my order'}
            </button>
          </div>
        </section>

        {/* Result */}

        {result?.success && result.order && (
          <section className="mt-16 max-w-3xl border-t border-black pt-8">

            {/* Result heading */}

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Order found
              </p>

              <h2 className="mt-2 font-mono text-lg">
                {result.order.order_number}
              </h2>
            </div>

            {/* Order information */}

            <div className="mt-8 grid gap-10 md:grid-cols-2">

              {/* Customer */}

              <div>
                <h3 className="text-xs uppercase tracking-[0.15em]">
                  Customer
                </h3>

                <div className="mt-4 text-sm leading-6">
                  <p>
                    {result.order.shipping_first_name}{' '}
                    {result.order.shipping_last_name}
                  </p>

                  <p className="text-neutral-500">
                    {result.order.shipping_phone}
                  </p>
                </div>
              </div>

              {/* Shipping */}

              <div>
                <h3 className="text-xs uppercase tracking-[0.15em]">
                  Shipping
                </h3>

                <div className="mt-4 text-sm leading-6 text-neutral-500">
                  <p>
                    {result.order.shipping_address}
                  </p>

                  <p>
                    {result.order.shipping_city},{' '}
                    {result.order.shipping_postal_code}
                  </p>

                  <p>
                    {result.order.shipping_country}
                  </p>
                </div>
              </div>

              {/* Order status */}

              <div>
                <h3 className="text-xs uppercase tracking-[0.15em]">
                  Order status
                </h3>

                <p className="mt-4 text-sm capitalize">
                  {result.order.status}
                </p>
              </div>

              {/* Payment */}

              <div>
                <h3 className="text-xs uppercase tracking-[0.15em]">
                  Payment
                </h3>

                <div className="mt-4 text-sm">
                  <p className="capitalize">
                    {result.payment?.payment_method
                      ? result.payment.payment_method.replace(
                        '_',
                        ' '
                      )
                      : '—'}
                  </p>

                  <p className="mt-1 capitalize text-neutral-500">
                    {result.payment?.status ?? '—'}
                  </p>

                  {result.payment
                    ?.transaction_reference && (
                      <p className="mt-1 font-mono text-xs text-neutral-500">
                        {result.payment.transaction_reference}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Items */}

            <div className="mt-12">
              <h3 className="text-xs uppercase tracking-[0.15em]">
                Items
              </h3>

              <div className="mt-5 divide-y divide-neutral-200 border-t border-neutral-200">
                {result.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-6 py-5"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {item.product_name}
                      </p>

                      {item.sku && (
                        <p className="mt-2 text-xs text-neutral-500">
                          SKU: {item.sku}
                        </p>
                      )}

                      <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-neutral-500">
                        {item.size && (
                          <span>
                            Size: {item.size}
                          </span>
                        )}

                        {item.color && (
                          <span>
                            Color: {item.color}
                          </span>
                        )}

                        <span>
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <span className="text-sm">
                      $
                      {Number(
                        item.subtotal
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price summary */}

            <div className="mt-8 border-t border-neutral-200 pt-6">

              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">
                  Subtotal
                </span>

                <span>
                  $
                  {Number(
                    result.order.subtotal
                  ).toFixed(2)}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-neutral-500">
                  Shipping
                </span>

                <span>
                  {Number(
                    result.order.shipping_fee
                  ) === 0
                    ? 'Free'
                    : `$${Number(
                      result.order.shipping_fee
                    ).toFixed(2)}`}
                </span>
              </div>

              <div className="mt-5 flex justify-between border-t border-neutral-200 pt-5 text-base font-medium">
                <span>Total</span>

                <span>
                  $
                  {Number(
                    result.order.total
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="flex-1 bg-black px-6 py-4 text-center text-xs font-medium uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80"
              >
                Continue shopping
              </Link>

              <Link
                to="/"
                className="flex-1 border border-black px-6 py-4 text-center text-xs font-medium uppercase tracking-[0.15em] transition-colors hover:bg-black hover:text-white"
              >
                Back to home
              </Link>
            </div>

          </section>
        )}
      </main>
    </StoreLayout>
  )
}