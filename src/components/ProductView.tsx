"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { DetailedProduct } from '@/types';
import FilterBar from './FilterBar';
import ProductGrid from './ProductGrid';
import ProductModal from './ProductModal';
import Header from './Header';
import { getFilteredProducts } from '@/lib/data';

interface ProductViewProps {
  initialProducts: DetailedProduct[];
}

const ProductView = ({ initialProducts }: ProductViewProps) => {
  const [products, setProducts] = useState<DetailedProduct[]>(initialProducts);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<DetailedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingMore, hasMore]);

  // Derive available filters from initial products (Note: This only uses initial products. Consider fetching all possible filters separately if needed)
  const availableFilters = [
    // Categories
    ...Array.from(new Set(initialProducts
      .filter(product => product.category)
      .map(product => `category:${product.category}`))),
    // Suitable For
    ...Array.from(new Set(initialProducts
      .filter(product => product.suitable_for)
      .map(product => `suitable_for:${product.suitable_for}`)))
  ].sort();

  const handleFilterClick = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
    setProducts([]); // Clear products immediately for filter change
    setIsLoading(true); // Set loading state for filter change
    setCurrentPage(1); // Reset page number
    setHasMore(true); // Reset hasMore flag
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
    setProducts([]); // Clear products
    setIsLoading(true); // Set loading state for filter change
    setCurrentPage(1); // Reset page number
    setHasMore(true); // Reset hasMore flag
  };

  // Fetch filtered products when filters change (or initial load)
  useEffect(() => {
    console.log('Current activeFilters:', activeFilters); // Diagnostic log

    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filteredProducts = await getFilteredProducts(activeFilters, 1);
        setProducts(filteredProducts);
        setHasMore(filteredProducts.length === 20); // Using DEFAULT_LIMIT from data.ts
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching filtered products:', err);
        setError('Failed to fetch filtered products');
        setIsLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [activeFilters]);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const moreProducts = await getFilteredProducts(activeFilters, nextPage);

      if (moreProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...moreProducts]);
        setCurrentPage(nextPage);
        setHasMore(moreProducts.length === 20); // Using DEFAULT_LIMIT from data.ts
      }
    } catch (err) {
      console.error('Error loading more products:', err);
      setError('Failed to load more products');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleProductClick = (product: DetailedProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Header showTelegramButton={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          availableFilters={availableFilters}
          activeFilters={activeFilters}
          onFilterClick={handleFilterClick}
          onClearFilters={handleClearFilters}
        />

        <div className="mt-8">
          {error && (
            <div className="text-red-600 mb-4" role="alert">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <ProductGrid
                products={products}
                onProductClick={handleProductClick}
                lastProductElementRef={lastProductElementRef}
              />
              {isLoadingMore && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              )}
              {!hasMore && products.length > 0 && (
                <div className="text-center text-gray-600 py-4">
                  No more products to load
                </div>
              )}
              {selectedProduct && (
                <ProductModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  product={selectedProduct}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductView;
