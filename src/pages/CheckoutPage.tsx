import { useState } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { supabase } from '../lib/supabase'

import { StoreLayout } from '../components/layout/StoreLayout'
import { useCart } from '../context/CartContext'

export function CheckoutPage() {
  const {
    items,
    subtotal,
    clearCart,
  } = useCart()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Indonesia',
  })

  const [paymentMethod, setPaymentMethod] =
    useState('demo_card')

  const [showPayment, setShowPayment] =
    useState(false)

  const [isProcessing, setIsProcessing] =
    useState(false)

  const [paymentError, setPaymentError] =
    useState<string | null>(null)  

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const navigate = useNavigate()

  const handlePayment = async () => {
    setPaymentError(null)

    if (!form.name.trim()) {
      setPaymentError(
        'Please enter your full name.'
      )
      return
    }

    if (!form.email.trim()) {
      setPaymentError(
        'Please enter your email address.'
      )
      return
    }

    if (!form.phone.trim()) {
      setPaymentError(
        'Please enter your phone number.'
      )
      return
    }

    if (!form.address.trim()) {
      setPaymentError(
        'Please enter your shipping address.'
      )
      return
    }

    if (!form.city.trim()) {
      setPaymentError(
        'Please enter your city.'
      )
      return
    }

    if (!form.postalCode.trim()) {
      setPaymentError(
        'Please enter your postal code.'
      )
      return
    }

    const nameParts = form.name
      .trim()
      .split(/\s+/)

    const firstName = nameParts[0]

    const lastName =
      nameParts.slice(1).join(' ') || ''

    const rpcItems = items.map((item) => ({
      product_id: item.product.id,
      variant_id: item.variant?.id ?? null,
      quantity: item.quantity,
    }))

    try {
      setIsProcessing(true)




      const { data, error } =
        await supabase.rpc(
          'create_demo_order',
          {
            p_first_name: firstName,
            p_last_name: lastName,
            p_email: form.email.trim(),
            p_phone: form.phone.trim(),
            p_shipping_address:
              form.address.trim(),
            p_shipping_city:
              form.city.trim(),
            p_shipping_postal_code:
              form.postalCode.trim(),
            p_shipping_country:
              form.country,
            p_payment_method:
              paymentMethod,
            p_items: rpcItems,
          }
        )

      if (error) {
        throw error
      }

      if (!data?.success) {
        throw new Error(
          'The order could not be completed.'
        )
      }

      clearCart()

      navigate(
        `/order-success/${data.order_number}`
      )
    } catch (error) {
      console.error(
        'Payment error:',
        error
      )

      setPaymentError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while processing your order.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <StoreLayout>
        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Checkout
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
            Checkout
          </p>

          <h1 className="mt-2 text-4xl font-medium tracking-tight">
            Complete your order
          </h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Customer information */}
          <section>
            <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
              Customer information
            </h2>

            <div className="mt-8 grid gap-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs uppercase tracking-[0.1em]"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      'name',
                      event.target.value
                    )
                  }
                  placeholder="Your full name"
                  className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs uppercase tracking-[0.1em]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      'email',
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-xs uppercase tracking-[0.1em]"
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      'phone',
                      event.target.value
                    )
                  }
                  placeholder="+62..."
                  className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                />
              </div>
            </div>

            <div className="my-12 border-t border-neutral-200" />

            {/* Shipping */}
            <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
              Shipping information
            </h2>

            <div className="mt-8 grid gap-6">
              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-xs uppercase tracking-[0.1em]"
                >
                  Address
                </label>

                <textarea
                  id="address"
                  rows={4}
                  value={form.address}
                  onChange={(event) =>
                    updateField(
                      'address',
                      event.target.value
                    )
                  }
                  placeholder="Street address"
                  className="w-full resize-none border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-xs uppercase tracking-[0.1em]"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={(event) =>
                      updateField(
                        'city',
                        event.target.value
                      )
                    }
                    placeholder="City"
                    className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                  />
                </div>

                {/* Postal code */}
                <div>
                  <label
                    htmlFor="postalCode"
                    className="mb-2 block text-xs uppercase tracking-[0.1em]"
                  >
                    Postal code
                  </label>

                  <input
                    id="postalCode"
                    type="text"
                    value={form.postalCode}
                    onChange={(event) =>
                      updateField(
                        'postalCode',
                        event.target.value
                      )
                    }
                    placeholder="Postal code"
                    className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-xs uppercase tracking-[0.1em]"
                >
                  Country
                </label>

                <select
                  id="country"
                  value={form.country}
                  onChange={(event) =>
                    updateField(
                      'country',
                      event.target.value
                    )
                  }
                  className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                >
                  <option>Indonesia</option>
                  <option>Singapore</option>
                  <option>Malaysia</option>
                  <option>Australia</option>
                </select>
              </div>
            </div>
          </section>

          {/* Order summary */}
          {showPayment && (
            <section className="border-t border-black pt-8 lg:col-span-2">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Payment
                </p>

                <h2 className="mt-2 text-2xl font-medium">
                  Choose payment method
                </h2>

                <div className="mt-8 space-y-3">
                  <label className="flex cursor-pointer items-center gap-4 border border-neutral-300 p-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="demo_card"
                      checked={
                        paymentMethod === 'demo_card'
                      }
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                    />

                    <div>
                      <p className="text-sm font-medium">
                        Credit / Debit Card
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Demo payment — no real card required
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-4 border border-neutral-300 p-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={
                        paymentMethod === 'bank_transfer'
                      }
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                    />

                    <div>
                      <p className="text-sm font-medium">
                        Bank Transfer
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Demo payment — no real transfer required
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-4 border border-neutral-300 p-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="e_wallet"
                      checked={
                        paymentMethod === 'e_wallet'
                      }
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                    />

                    <div>
                      <p className="text-sm font-medium">
                        E-Wallet
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Demo payment — no real payment required
                      </p>
                    </div>
                  </label>
                </div>

                {paymentError && (
                  <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {paymentError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="mt-8 w-full bg-black px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing
                    ? 'Processing...'
                    : `Pay $${subtotal.toFixed(2)}`}
                </button>
              </div>
            </section>
          )}

          <aside className="h-fit border-t border-black pt-6 lg:sticky lg:top-28">
            <h2 className="text-xs uppercase tracking-[0.15em]">
              Order summary
            </h2>

            <div className="mt-6 divide-y divide-neutral-200">
              {items.map((item) => {
                const price =
                  item.variant?.price ??
                  item.product.price

                return (
                  <div
                    key={`${item.product.id}-${item.variant?.id}`}
                    className="flex justify-between gap-4 py-4 first:pt-0"
                  >
                    <div>
                      <p className="text-sm">
                        {item.product.name}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Qty {item.quantity}
                      </p>

                      {item.variant?.size && (
                        <p className="text-xs text-neutral-500">
                          Size: {item.variant.size}
                        </p>
                      )}

                      {item.variant?.color && (
                        <p className="text-xs text-neutral-500">
                          Color: {item.variant.color}
                        </p>
                      )}
                    </div>

                    <span className="text-sm">
                      $
                      {(
                        price * item.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="my-6 border-t border-neutral-200" />

            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="my-6 border-t border-black" />

            <div className="flex justify-between">
              <span className="text-sm font-medium">
                Total
              </span>

              <span className="text-lg font-medium">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowPayment(true)}
              className="mt-8 w-full bg-black px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80"
            >
              Continue to payment
            </button>
          </aside>
        </div>
      </main>
    </StoreLayout>
  )
}