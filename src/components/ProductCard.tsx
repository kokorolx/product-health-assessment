import Image from 'next/image';
import HealthScoreIndicator from './HealthScoreIndicator';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const {
    image_url,
    product_name,
    health_score,
    category,
    suitable_for,
  } = product;
  return (
    <div
      className="relative rounded shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group aspect-[3/2] bg-slate-200" // Added aspect ratio, group for hover
      onClick={onClick}
    >
      {/* Product Image */}
      <Image
        src={image_url}
        alt={product_name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105" // Slight zoom on hover
      />


      {/* Info Overlay: Hidden by default, shown on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
        <h3 className="text-lg font-semibold text-white truncate mb-1">{product_name}</h3>
        <div className="flex items-center justify-between mb-2">
          <HealthScoreIndicator score={health_score} />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-200 space-x-2">
            <span className="bg-slate-500/50 px-2 py-0.5 rounded">{category}</span>
            <span className="bg-indigo-500/50 px-2 py-0.5 rounded">{suitable_for}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
