'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchProductsByName } from '@/lib/data';
import type { DetailedProduct } from '@/types';
import ProductCard from './ProductCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DetailedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer2 = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchProductsByName(debouncedQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  const router = useRouter();

  const handleProductClick = (product: DetailedProduct) => {
    onClose();
    router.push(`/products/${product.id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Modal backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-[10vh]">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mr-2" />
                Searching...
              </div>
            ) : searchQuery && searchResults.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No products found matching &ldquo;{searchQuery}&rdquo;
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;