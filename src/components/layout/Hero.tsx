export function Hero() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-neutral-100">
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
        alt="Fashion collection"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative flex min-h-[70vh] items-end px-6 py-10 sm:px-10 lg:px-16">
        <div className="max-w-xl text-white">
          <p className="mb-3 text-xs uppercase tracking-[0.25em]">
            New collection
          </p>

          <h1 className="text-5xl font-medium tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Everyday,
            <br />
            considered.
          </h1>

          <p className="mt-6 max-w-md text-sm leading-6 text-white/85">
            Thoughtful essentials designed for everyday
            movement, made with quality materials and a
            timeless point of view.
          </p>

          <a
            href="#shop"
            className="mt-8 inline-flex bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-80"
          >
            Shop collection
          </a>
        </div>
      </div>
    </section>
  )
}