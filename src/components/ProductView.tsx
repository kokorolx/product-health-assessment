"use client";

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import FilterBar from './FilterBar';
import ProductGrid from './ProductGrid';
import ProductModal from './ProductModal';
import Header from './Header';
import ImageUploadForm from './ImageUploadForm';
import { getFilteredProducts, getInitialProducts } from '@/lib/data';

interface ProductViewProps {
  initialProducts: Product[];
}

const ProductView = ({ initialProducts }: ProductViewProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setActiveFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      }
      return [...prev, filter];
    });
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  // Fetch filtered products when filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filteredProducts = await getFilteredProducts(activeFilters);
        setProducts(filteredProducts);
      } catch (err) {
        setError('Failed to fetch filtered products');
        console.error('Error fetching filtered products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [activeFilters]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleOpenUploadForm = () => {
    setIsUploadFormOpen(true);
  };

  const handleCloseUploadForm = () => {
    setIsUploadFormOpen(false);
  };

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      const latestProducts = await getInitialProducts();
      setProducts(latestProducts);
    } catch (err) {
      console.error('Error refreshing products:', err);
      setError('Failed to refresh products');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header onUploadClick={handleOpenUploadForm} />
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
              <ProductGrid products={products} onProductClick={handleProductClick} />
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