import { useState } from 'react'
import type { ProductImage } from '../../services/products'

type ProductGalleryProps = {
  images: ProductImage[]
  productName: string
}

export function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const sortedImages = [...images].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  const [activeImage, setActiveImage] = useState(
    sortedImages[0]?.image_url ?? ''
  )

  if (!sortedImages.length) {
    return (
      <div className="aspect-4/5 bg-neutral-100" />
    )
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="aspect-4/5 overflow-hidden bg-neutral-100">
        <img
          src={activeImage}
          alt={productName}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {sortedImages.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() =>
                setActiveImage(image.image_url)
              }
              className={`aspect-square overflow-hidden bg-neutral-100 ${activeImage === image.image_url
                  ? 'ring-1 ring-black'
                  : ''
                }`}
            >
              <img
                src={image.image_url}
                alt={
                  image.alt_text ?? productName
                }
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}