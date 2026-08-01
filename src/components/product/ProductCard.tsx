import type { Product } from '../../services/products'

type ProductCardProps = {
  product: Product
}

export function ProductCard({
  product,
}: ProductCardProps) {
  const image = product.images
    ?.sort(
      (a, b) => a.sort_order - b.sort_order
    )[0]

  return (
    <article className="group">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {image && (
          <img
            src={image.image_url}
            alt={image.alt_text ?? product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}

        {product.compare_at_price && (
          <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] uppercase tracking-wider">
            Sale
          </span>
        )}
      </div>

      <div className="pt-4">
        <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-500">
          {product.category?.name}
        </p>

        <h3 className="mt-1 text-sm font-medium">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <span>
            ${product.price.toFixed(2)}
          </span>

          {product.compare_at_price && (
            <span className="text-neutral-400 line-through">
              ${product.compare_at_price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}