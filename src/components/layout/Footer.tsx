export function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.04em]">
            ATELIER
          </h2>

          <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-500">
            Thoughtful everyday clothing and accessories
            designed to last beyond the season.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.15em]">
            Shop
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-neutral-600">
            <a href="#shop">All products</a>
            <a href="#collections">New arrivals</a>
            <a href="#collections">Clothing</a>
            <a href="#collections">Accessories</a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.15em]">
            Information
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-neutral-600">
            <a href="#about">About</a>
            <a href="#shipping">Shipping</a>
            <a href="#returns">Returns</a>
            <a href="#contact">Contact</a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.15em]">
            Newsletter
          </h3>

          <p className="mt-5 text-sm leading-6 text-neutral-500">
            Receive occasional updates about new collections
            and studio news.
          </p>

          <form className="mt-5 flex border-b border-black">
            <input
              type="email"
              placeholder="Email address"
              className="min-w-0 flex-1 py-3 text-sm outline-none placeholder:text-neutral-400"
            />

            <button
              type="submit"
              className="text-xs font-medium uppercase tracking-wider"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-neutral-200 px-6 py-6">
        <div className="mx-auto max-w-7xl text-xs text-neutral-500">
          © 2026 ATELIER. All rights reserved.
        </div>
      </div>
    </footer>
  )
}