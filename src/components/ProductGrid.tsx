import ProductCard from './ProductCard';
import { DetailedProduct } from '@/types';

interface ProductGridProps {
  products: DetailedProduct[];
  onProductClick: (product: DetailedProduct) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          {...product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;