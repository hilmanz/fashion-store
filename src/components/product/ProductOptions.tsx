import type { ProductVariant } from '../../services/products'

type ProductOptionsProps = {
  variants: ProductVariant[]
  selectedSize: string | null
  selectedColor: string | null
  onSizeChange: (size: string) => void
  onColorChange: (color: string) => void
}

export function ProductOptions({
  variants,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: ProductOptionsProps) {
  const sizes = [
    ...new Set(
      variants
        .map((variant) => variant.size)
        .filter(Boolean)
    ),
  ] as string[]

  const colors = [
    ...new Set(
      variants
        .map((variant) => variant.color)
        .filter(Boolean)
    ),
  ] as string[]

  return (
    <div className="space-y-8">
      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.15em]">
              Color
            </span>

            <span className="text-sm text-neutral-500">
              {selectedColor ?? 'Select'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onColorChange(color)}
                className={`border px-4 py-2 text-sm transition-colors ${selectedColor === color
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 hover:border-black'
                  }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.15em]">
              Size
            </span>

            <button
              type="button"
              className="text-xs underline underline-offset-4"
            >
              Size guide
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {sizes.map((size) => {
              const available = variants.some(
                (variant) =>
                  variant.size === size &&
                  variant.stock > 0
              )

              return (
                <button
                  key={size}
                  type="button"
                  disabled={!available}
                  onClick={() => onSizeChange(size)}
                  className={`border py-3 text-sm transition-colors ${selectedSize === size
                      ? 'border-black bg-black text-white'
                      : available
                        ? 'border-neutral-300 hover:border-black'
                        : 'cursor-not-allowed border-neutral-200 text-neutral-300 line-through'
                    }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}