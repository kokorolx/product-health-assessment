import { getProducts } from '@/lib/data'
import ProductView from '@/components/ProductView'

export default async function ProductsPage() {
  // Fetch the first page of products initially
  const initialProducts = await getProducts(1)

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductView initialProducts={initialProducts} />
    </div>
  )
}
