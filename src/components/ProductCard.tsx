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
      {/* Product Image or Error Message */}
      {image_url && image_url.trim() ? (
        <Image
          src={image_url}
          alt={product_name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105" // Slight zoom on hover
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100">
          <div className="relative w-24 h-24 mb-3">
            <Image
              src="/something-went-wrong.png"
              alt="Image not available"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-sm text-slate-600 font-medium">Product not available</p>
        </div>
      )}


      {/* Info Overlay: Hidden by default, shown on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis mb-1">{product_name}</h3>
        </div>
        {image_url && image_url.trim() && (
          <div className="flex items-center justify-between mb-2">
            <HealthScoreIndicator score={health_score} />
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-200 space-x-2 max-w-full">
            <span className="bg-slate-500/50 px-2 py-0.5 rounded inline-block">{category}</span>
            <span className="bg-indigo-500/50 px-2 py-0.5 rounded inline-block max-w-[60%] whitespace-nowrap overflow-hidden text-ellipsis">{suitable_for}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
