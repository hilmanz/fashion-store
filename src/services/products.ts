import { supabase } from '../lib/supabase'

export type ProductVariant = {
  id: string
  sku: string
  size: string | null
  color: string | null
  stock: number
  price: number | null
}

export type ProductImage = {
  id: string
  image_url: string
  storage_path: string | null
  alt_text: string | null
  sort_order: number
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  image_url: string | null
  status: string

  category: {
    id: string
    name: string
    slug: string
  } | null

  variants: ProductVariant[]
  images: ProductImage[]
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      price,
      compare_at_price,
      image_url,
      status,

      category:categories (
        id,
        name,
        slug
      ),

      variants:product_variants (
        id,
        sku,
        size,
        color,
        stock,
        price
      ),

      images:product_images (
        id,
        image_url,
        storage_path,
        alt_text,
        sort_order
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as Product[]
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      price,
      compare_at_price,
      image_url,
      status,

      category:categories (
        id,
        name,
        slug
      ),

      variants:product_variants (
        id,
        sku,
        size,
        color,
        stock,
        price
      ),

      images:product_images (
        id,
        image_url,
        storage_path,
        alt_text,
        sort_order
      )
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data as Product | null
}