import ProductCard from './ProductCard';
import { DetailedProduct } from '@/types';
import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';
import Masonry from 'react-masonry-css';

interface ProductGridProps {
  products: DetailedProduct[];
  onProductClick: (product: DetailedProduct) => void;
  lastProductElementRef?: (node: HTMLDivElement | null) => void;
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductClick,
  lastProductElementRef,
  isLoading = false,
}) => {
  // Breakpoint object for responsive layout
  const breakpointColumns = {
    default: 5, // Default column count
    2400: 6,    // 2xl screens
    1920: 5,    // xl screens
    1536: 4,    // lg screens
    1280: 3,    // md screens
    768: 2,     // sm screens
    640: 1      // xs screens
  };

  // Base styles for the masonry grid
  const masonryClassName = `
    masonry-grid
    flex w-auto p-4
    [&>div]:pl-1
    [&>div]:bg-clip-padding
    [&>div>div]:mb-1
  `;

  if (isLoading) {
    return (
      <Masonry
        breakpointCols={breakpointColumns}
        className={masonryClassName}
        columnClassName="masonry-grid_column"
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={`skeleton-${index}`}>
            <ProductCardSkeleton />
          </div>
        ))}
      </Masonry>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className={masonryClassName}
      columnClassName="masonry-grid_column"
    >
      {products.map((product, index) => {
        const cardElement = (
          <div key={product.id || `product-${index}`}>
            <ProductCard
              product={product}
              onClick={() => onProductClick(product)}
            />
          </div>
        );

        if (products.length === index + 1 && lastProductElementRef) {
          return (
            <div ref={lastProductElementRef} key={product.id || `product-${index}`}>
              {cardElement}
            </div>
          );
        }

        return cardElement;
      })}
    </Masonry>
  );
};

export default ProductGrid;
