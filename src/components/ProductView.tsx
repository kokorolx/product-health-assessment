"use client";

import { useEffect, useState } from 'react';
import { DetailedProduct } from '@/types';
import FilterBar from './FilterBar';
import ProductGrid from './ProductGrid';
import ProductModal from './ProductModal';
import Header from './Header';
import ImageUploadForm from './ImageUploadForm';
import { getFilteredProducts, getInitialProducts } from '@/lib/data';

interface ProductViewProps {
  initialProducts: DetailedProduct[];
}

const ProductView = ({ initialProducts }: ProductViewProps) => {
  const [state, setState] = useState({
    products: initialProducts,
    activeFilters: [] as string[],
    isLoading: false,
    error: null as string | null,
    selectedProduct: null as DetailedProduct | null,
    isModalOpen: false,
  });
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);

  // Derive available filters from initial products
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
    setState(prev => {
      const activeFilters = prev.activeFilters.includes(filter)
        ? prev.activeFilters.filter(f => f !== filter)
        : [...prev.activeFilters, filter];
      return { ...prev, activeFilters };
    });
  };

  const handleClearFilters = () => {
    setState(prev => ({ ...prev, activeFilters: [] }));
  };

  // Fetch filtered products when filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const filteredProducts = await getFilteredProducts(state.activeFilters);
        setState(prev => ({ ...prev, products: filteredProducts, isLoading: false }));
      } catch (err) {
        console.error('Error fetching filtered products:', err);
        setState(prev => ({
          ...prev,
          error: 'Failed to fetch filtered products',
          isLoading: false
        }));
      }
    };

    fetchFilteredProducts();
  }, [state.activeFilters]);

  const handleProductClick = (product: DetailedProduct) => {
    setState(prev => ({
      ...prev,
      selectedProduct: product,
      isModalOpen: true
    }));
  };

  const handleCloseModal = () => {
    setState(prev => ({
      ...prev,
      selectedProduct: null,
      isModalOpen: false
    }));
  };

  const handleOpenUploadForm = () => {
    setIsUploadFormOpen(true);
  };

  const handleCloseUploadForm = () => {
    setIsUploadFormOpen(false);
  };

  const refreshProducts = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const latestProducts = await getInitialProducts();
      setState(prev => ({ ...prev, products: latestProducts, isLoading: false }));
    } catch (err) {
      console.error('Error refreshing products:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to refresh products',
        isLoading: false
      }));
    }
  };

  return (
    <>
      <Header onUploadClick={handleOpenUploadForm} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          availableFilters={availableFilters}
          activeFilters={state.activeFilters}
          onFilterClick={handleFilterClick}
          onClearFilters={handleClearFilters}
        />

        <div className="mt-8">
          {state.error && (
            <div className="text-red-600 mb-4" role="alert">
              {state.error}
            </div>
          )}
          {state.isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <ProductGrid products={state.products} onProductClick={handleProductClick} />
              {state.selectedProduct && (
                <ProductModal
                  isOpen={state.isModalOpen}
                  onClose={handleCloseModal}
                  product={state.selectedProduct}
                />
              )}
            </>
          )}
        </div>
        <ImageUploadForm
          isOpen={isUploadFormOpen}
          onClose={() => {
            handleCloseUploadForm();
            refreshProducts();
          }}
        />
      </div>
    </>
  );
};

export default ProductView;