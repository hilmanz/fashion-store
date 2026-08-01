import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

export function ShopPage() {
  return (
    <>
      <Header />

      <main className="mx-auto min-h-screen max-w-7xl px-6 py-16 lg:py-24">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Shop
        </p>

        <h1 className="mt-2 text-4xl font-medium tracking-tight">
          All Products
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500">
          Explore the complete ATELIER collection.
        </p>
      </main>

      <Footer />
    </>
  )
}