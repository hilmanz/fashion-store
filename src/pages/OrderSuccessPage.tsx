import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type Order = {
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

type Payment = {
  payment_method: string
  transaction_reference: string
  amount: number
  status: string
}

type OrderItem = {
  product_name: string
  sku: string | null
  size: string | null
  color: string | null
  quantity: number
  unit_price: number
  subtotal: number
}

export function OrderSuccessPage() {
  const { orderNumber } = useParams<{
    orderNumber: string
  }>()

  const [order, setOrder] =
    useState<Order | null>(null)

  const [payment, setPayment] =
    useState<Payment | null>(null)

  const [items, setItems] =
    useState<OrderItem[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderNumber) {
        setError('Order number is missing.')
        setLoading(false)
        return
      }

      try {
        const { data, error } =
          await supabase.rpc(
            'get_order_confirmation',
            {
              p_order_number: orderNumber,
            }
          )

        if (error) {
          throw error
        }

        if (!data?.success) {
          throw new Error(
            data?.message || 'Order not found.'
          )
        }

        setOrder(data.order)
        setPayment(data.payment)
        setItems(data.items ?? [])
      } catch (err) {
        console.error(
          'Failed to load order:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'We could not find this order.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderNumber])

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <p className="text-sm text-neutral-500">
          Loading your order...
        </p>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-medium">
            Order not found
          </h1>

          <p className="mt-3 text-sm text-neutral-500">
            {error}
          </p>

          <Link
            to="/"
            className="mt-8 inline-block bg-black px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="px-6 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-2xl">

        {/* Success icon */}

        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-black">
            <span className="text-lg">
              ✓
            </span>
          </div>
        </div>

        {/* Heading */}

        <div className="mt-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Order confirmed
          </p>

          <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
            Thank you for your order.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-neutral-500">
            Your order has been successfully
            placed. We&apos;ve received your payment
            and will begin processing your order
            shortly.
          </p>
        </div>

        {/* Order number */}

        <div className="mt-12 border-y border-neutral-200 py-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Order number
          </p>

          <p className="mt-2 font-mono text-sm">
            {order.order_number}
          </p>
        </div>

        {/* Order details */}

        <div className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
            Order details
          </h2>

          <div className="mt-6 space-y-4 border-t border-neutral-200 pt-6">

            <div className="flex justify-between gap-6 text-sm">
              <span className="text-neutral-500">
                Customer
              </span>

              <span className="text-right">
                {order.shipping_first_name}{' '}
                {order.shipping_last_name}
              </span>
            </div>

            <div className="flex justify-between gap-6 text-sm">
              <span className="text-neutral-500">
                Payment
              </span>

              <span className="text-right capitalize">
                {payment?.payment_method
                  ? payment.payment_method.replace('_', ' ')
                  : '—'}
              </span>
            </div>

            <div className="flex justify-between gap-6 text-sm">
              <span className="text-neutral-500">
                Payment status
              </span>

              <span className="capitalize">
                {payment?.status}
              </span>
            </div>

            <div className="flex justify-between gap-6 text-sm">
              <span className="text-neutral-500">
                Order status
              </span>

              <span className="capitalize">
                {order.status}
              </span>
            </div>

          </div>
        </div>

        {/* Items */}

        <div className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
            Items
          </h2>

          <div className="mt-6 divide-y divide-neutral-200 border-t border-neutral-200">
            {items.map((item, index) => (
              <div
                key={`${item.sku ?? item.product_name}-${index}`}
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
                  </div>

                  <p className="mt-1 text-xs text-neutral-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="text-right text-sm">
                  ${Number(item.subtotal).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price summary */}

        <div className="mt-10 border-t border-neutral-200 pt-6">

          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">
              Subtotal
            </span>

            <span>
              ${Number(order.subtotal).toFixed(2)}
            </span>
          </div>

          <div className="mt-3 flex justify-between text-sm">
            <span className="text-neutral-500">
              Shipping
            </span>

            <span>
              {Number(order.shipping_fee) === 0
                ? 'Free'
                : `$${Number(
                  order.shipping_fee
                ).toFixed(2)}`}
            </span>
          </div>

          <div className="mt-5 flex justify-between border-t border-neutral-200 pt-5 text-base font-medium">
            <span>Total</span>

            <span>
              ${Number(order.total).toFixed(2)}
            </span>
          </div>

        </div>

        {/* Actions */}

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">

          <Link
            to="/"
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

      </div>
    </main>
  )
}