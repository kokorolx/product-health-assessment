import { useState, useEffect } from 'react';
import { Product, DetailedProduct } from '@/types';
import { getProductDetails } from '@/lib/data';
import Image from 'next/image';
import SuitabilityNotes from './SuitabilityNotes';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const [detailedProductData, setDetailedProductData] = useState<DetailedProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDetailedData = async () => {
      if (!isOpen || !product.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const details = await getProductDetails(product.id);
        if (isMounted) {
          setDetailedProductData(details);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load product details');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDetailedData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, product.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Modal backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Image */}
              <div>
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-red-600">{error}</div>
                  </div>
                ) : (
                  <div className="relative w-full h-64">
                    <Image
                      src={detailedProductData?.image_url || product.image_url}
                      alt={detailedProductData?.product_name || product.product_name}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Right column - Details */}
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {detailedProductData?.product_name || product.product_name}
                </h2>
                <div className="text-gray-600 mb-4">
                  <p>Category: {product.category}</p>
                  <p className="mt-1">Suitable for: {product.suitable_for}</p>
                </div>

                {!isLoading && !error && detailedProductData && (
                  <>
                    {/* Source URL */}
                    {detailedProductData.source_url && (
                      <div className="mb-4">
                        <div className="font-semibold">Source</div>
                        <a
                          href={detailedProductData.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Original
                        </a>
                      </div>
                    )}

                    {/* Health Score */}
                    <div className="mb-4">
                      <div className="font-semibold">Health Score</div>
                      <div className="mt-1">{detailedProductData.health_score}/100</div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-4">
                      <div className="font-semibold">Ingredients</div>
                      <pre className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                        {JSON.stringify(detailedProductData.ingredients, null, 2)}
                      </pre>
                    </div>

                    {/* Suitability Notes */}
                    {detailedProductData.suitability_notes && (
                      <div className="mb-4">
                        <div className="font-semibold">Suitability Notes</div>
                        <div className="mt-1">
                          <SuitabilityNotes notes={detailedProductData.suitability_notes} />
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="mb-4">
                      <div className="font-semibold">Summary</div>
                      <p className="text-sm text-gray-600 mt-1">{detailedProductData.summary}</p>
                    </div>

                    {/* Careful Note */}
                    {detailedProductData.careful_note && (
                      <div className="mb-4">
                        <div className="font-semibold">Careful Note</div>
                        <p className="text-sm text-gray-600 mt-1">{detailedProductData.careful_note}</p>
                      </div>
                    )}

                    {/* Detailed Reason */}
                    {detailedProductData.detailed_reason && (
                      <div className="mb-4">
                        <div className="font-semibold">Detailed Reason</div>
                        <p className="text-sm text-gray-600 mt-1">{detailedProductData.detailed_reason}</p>
                      </div>
                    )}

                    {/* Review Status & Creation Date */}
                    <div className="text-sm text-gray-500 mt-6">
                      <div className="flex gap-2 mb-2">
                        <span className={`px-2 py-1 rounded ${
                          detailedProductData.reviewed_by_ai ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                        }`}>
                          AI Reviewed
                        </span>
                        <span className={`px-2 py-1 rounded ${
                          detailedProductData.reviewed_by_human ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                        }`}>
                          Human Reviewed
                        </span>
                      </div>
                      Created: {new Date(detailedProductData.created_at).toLocaleDateString()}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;