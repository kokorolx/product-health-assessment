import ProductCard from './ProductCard';
import { DetailedProduct } from '@/types';
import React from 'react'; // Import React for RefCallback

interface ProductGridProps {
  products: DetailedProduct[];
  onProductClick: (product: DetailedProduct) => void;
  lastProductElementRef?: (node: HTMLDivElement | null) => void; // Optional ref callback
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick, lastProductElementRef }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No products found. Try adjusting your filters or check back later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-4">
      {products.map((product, index) => {
        if (products.length === index + 1 && lastProductElementRef) {
          // Attach ref to the last product card
          return (
            <div key={product.id || index} ref={lastProductElementRef}>
              <ProductCard
                {...product}
                onClick={() => onProductClick(product)}
              />
            </div>
          );
        } else {
          return (
            <ProductCard
              key={product.id || index}
              {...product}
              onClick={() => onProductClick(product)}
            />
          );
        }
      })}
    </div>
  );
};

export default ProductGrid;
