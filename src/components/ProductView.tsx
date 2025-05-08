"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { DetailedProduct } from '@/types';
// import FilterBar from './FilterBar'; // Old filter bar
import ProductFilterSidebar from './ProductFilterSidebar'; // New filter sidebar
import ProductGrid from './ProductGrid';
import ProductModal from './ProductModal';
import Header from './Header';
import { getFilteredProducts, getUniqueCategories, getUniqueSuitableFor } from '@/lib/data';

interface ProductViewProps {
  initialProducts: DetailedProduct[];
}

const ProductView = ({ initialProducts }: ProductViewProps) => {
  const [products, setProducts] = useState<DetailedProduct[]>(initialProducts);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableSuitableFor, setAvailableSuitableFor] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<DetailedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoadingMore || isLoading) return; // Also check isLoading to prevent observer during initial load
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreProducts();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingMore, hasMore, isLoading]);


  // Fetch initial data: products and all available filter options
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch initial products (page 1)
        const initialProds = await getFilteredProducts(activeFilters, 1);
        setProducts(initialProds);
        setHasMore(initialProds.length === 20); // Assuming DEFAULT_LIMIT is 20

        // Fetch all unique categories and suitable_for values
        const [cats, suitableForVals] = await Promise.all([
          getUniqueCategories(),
          getUniqueSuitableFor()
        ]);
        setAvailableCategories(cats);
        setAvailableSuitableFor(suitableForVals);

      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load initial data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []); // Runs once on mount


  // Fetch products when activeFilters change
  useEffect(() => {
    // Skip initial fetch if activeFilters is empty, as initial data is handled above
    if (activeFilters.length === 0 && products.length > 0 && !isLoading) {
        // If filters are cleared, refetch initial set of all products for page 1
        const fetchAllProductsPageOne = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const prods = await getFilteredProducts([], 1);
                setProducts(prods);
                setHasMore(prods.length === 20);
                setCurrentPage(1); // Reset to page 1
            } catch (err) {
                console.error('Error fetching products after clearing filters:', err);
                setError('Failed to reload products.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllProductsPageOne();
        return;
    }


    if (activeFilters.length > 0) { // Only fetch if there are active filters
        const fetchFiltered = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const filteredProds = await getFilteredProducts(activeFilters, 1);
                setProducts(filteredProds);
                setHasMore(filteredProds.length === 20);
                setCurrentPage(1); // Reset to page 1 for new filter set
            } catch (err) {
                console.error('Error fetching filtered products:', err);
                setError('Failed to fetch filtered products.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchFiltered();
    }
  }, [activeFilters]);


  const handleFilterClick = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
    // Product fetching is handled by the useEffect hook listening to activeFilters
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
    // Product fetching for cleared filters is handled by the useEffect hook
  };

  const loadMoreProducts = async () => {
    if (isLoadingMore || !hasMore || isLoading) return;

    setIsLoadingMore(true);
    setError(null); // Clear previous errors
    try {
      const nextPageToFetch = currentPage + 1;
      const moreProds = await getFilteredProducts(activeFilters, nextPageToFetch);

      if (moreProds.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...moreProds]);
        setCurrentPage(nextPageToFetch);
        setHasMore(moreProds.length === 20);
      }
    } catch (err) {
      console.error('Error loading more products:', err);
      setError('Failed to load more products. Please try scrolling again.');
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
      {/* Add pt-16 (or header height) to this container to push content below sticky header */}
      <div className="flex min-h-screen"> {/* RE-ADD pt-16 HERE */}
        <ProductFilterSidebar
          availableCategories={availableCategories}
          availableSuitableFor={availableSuitableFor}
          activeFilters={activeFilters}
          onFilterClick={handleFilterClick}
          onClearFilters={handleClearFilters}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
        <main
          className={`flex-1 p-0 bg-slate-900 text-slate-200 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-72'}`}
        > {/* Main content area - dark background, light text, adjust margin based on sidebar state */}
          {error && (
            // Error message styling for dark background
            <div className="text-red-400 mb-4 p-4 bg-red-900/50 border border-red-700 rounded" role="alert">
              {error}
            </div>
          )}
          {isLoading && products.length === 0 ? ( // Show loading spinner only if no products are yet displayed
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> {/* Adjust min-h as needed */}
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400"></div> {/* Light spinner */}
            </div>
          ) : (
            <>
              <ProductGrid
                products={products}
                onProductClick={handleProductClick}
                lastProductElementRef={lastProductElementRef}
                isLoading={isLoading && products.length === 0} // Pass isLoading state
              />
              {isLoadingMore && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div> {/* Light spinner */}
                </div>
              )}
              {!isLoading && !isLoadingMore && !hasMore && products.length > 0 && (
                <div className="text-center text-slate-400 py-4"> {/* Light text */}
                  No more products to load.
                </div>
              )}
               {!isLoading && products.length === 0 && activeFilters.length > 0 && (
                 <div className="text-center text-slate-400 py-10"> {/* Light text */}
                   No products match your current filters.
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
        </main>
      </div>
    </>
  );
};

export default ProductView;
