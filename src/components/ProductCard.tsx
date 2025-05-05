import Image from 'next/image';
import HealthScoreIndicator from './HealthScoreIndicator';
import { Product } from '../types';

interface ProductCardProps extends Product {
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image_url,
  product_name,
  health_score,
  category,
  suitable_for,
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
      onClick={onClick}
    >
      {/* Product Image */}
      <div className="w-full h-48 relative">
        <Image
          src={image_url}
          alt={product_name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Name and Score */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product_name}</h3>
          <HealthScoreIndicator score={health_score} />
        </div>

        {/* Badges */}
        <div className="space-y-2">
          {/* Category */}
          <div className="flex flex-wrap gap-1">
            <span
              className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800"
            >
              {category}
            </span>
          </div>

          {/* Suitable For */}
          <div className="flex flex-wrap gap-1">
            <span
              className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800"
            >
              {suitable_for}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;