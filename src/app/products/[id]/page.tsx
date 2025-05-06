import { getInitialProducts } from '@/lib/data';
import { DetailedProduct } from '@/types';
import Link from 'next/link';
import ProductDetails from './ProductDetails';

export default async function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  let product: DetailedProduct;

  try {
    const products = await getInitialProducts();
    product = products.find(p => p.id === params.id)!;

    if (!product) {
      throw new Error('Product not found');
    }
  } catch (error: unknown) {
    console.error('Error loading product:', error instanceof Error ? error.message : 'Unknown error');
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-red-600 text-xl font-semibold">Error</h1>
            <p className="mt-2">Failed to load product details. Product may not exist.</p>
            <Link href="/products" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
