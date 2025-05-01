import { getInitialProducts } from '@/lib/data'
import ProductView from '@/components/ProductView'

export default async function ProductsPage() {
  const products = await getInitialProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductView initialProducts={products} />
    </div>
  )
}