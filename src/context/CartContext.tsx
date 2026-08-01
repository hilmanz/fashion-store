import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type {
  Product,
  ProductVariant,
} from '../services/products'

export type CartItem = {
  product: Product
  variant: ProductVariant | null
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addToCart: (
    product: Product,
    variant: ProductVariant | null,
    quantity: number
  ) => void
  updateQuantity: (
    productId: string,
    variantId: string | null,
    quantity: number
  ) => void
  removeFromCart: (
    productId: string,
    variantId: string | null
  ) => void
  clearCart: () => void
}

const CartContext =
  createContext<CartContextType | null>(null)

export function CartProvider({
  children,
}: {
  children: ReactNode
}) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (
    product: Product,
    variant: ProductVariant | null,
    quantity: number
  ) => {
    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.variant?.id === variant?.id
      )

      if (existingIndex === -1) {
        return [
          ...currentItems,
          {
            product,
            variant,
            quantity,
          },
        ]
      }

      return currentItems.map((item, index) =>
        index === existingIndex
          ? {
            ...item,
            quantity: item.quantity + quantity,
          }
          : item
      )
    })
  }

  const updateQuantity = (
    productId: string,
    variantId: string | null,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId &&
          item.variant?.id === variantId
          ? {
            ...item,
            quantity,
          }
          : item
      )
    )
  }

  const removeFromCart = (
    productId: string,
    variantId: string | null
  ) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.variant?.id === variantId
          )
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [items]
  )

  const subtotal = useMemo(
    () =>
      items.reduce((total, item) => {
        const price =
          item.variant?.price ?? item.product.price

        return total + price * item.quantity
      }, 0),
    [items]
  )

  const value = {
    items,
    itemCount,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    )
  }

  return context
}