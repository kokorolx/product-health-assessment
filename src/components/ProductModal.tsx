import { DetailedProduct } from '@/types';
import { useEffect, useCallback } from 'react';
import MagnifyingGlass from './MagnifyingGlass';
import SuitabilityNotes from './SuitabilityNotes';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: DetailedProduct;
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [handleEscapeKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Modal backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Left column - Image */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-sm aspect-[4/3] relative">
                  <MagnifyingGlass
                    src={product.image_url}
                    alt={product.product_name}
                    width={384}
                    height={288}
                    magnification={2.5}
                  />
                </div>
              </div>

              {/* Right column - Details */}
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {product.product_name}
                </h2>
                <div className="text-gray-600 mb-4">
                  <p>Category: {product.category}</p>
                  <p className="mt-1">Suitable for: {product.suitable_for}</p>
                </div>

                {/* Source URL */}
                {product.source_url && (
                  <div className="mb-4">
                    <div className="font-semibold">Source</div>
                    <a
                      href={product.source_url}
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
                  <div className="mt-1">{product.health_score}/100</div>
                </div>

                {/* Ingredients */}
                <div className="mb-4">
                  <div className="font-semibold">Ingredients</div>
                  <pre className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                    {JSON.stringify(product.ingredients, null, 2)}
                  </pre>
                </div>

                {/* Suitability Notes */}
                {product.suitability_notes && (
                  <div className="mb-4">
                    <div className="font-semibold">Suitability Notes</div>
                    <div className="mt-1">
                      <SuitabilityNotes notes={product.suitability_notes} />
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="mb-4">
                  <div className="font-semibold">Summary</div>
                  <p className="text-sm text-gray-600 mt-1">{product.summary}</p>
                </div>

                {/* Careful Note */}
                {product.careful_note && (
                  <div className="mb-4">
                    <div className="font-semibold">Careful Note</div>
                    <p className="text-sm text-gray-600 mt-1">{product.careful_note}</p>
                  </div>
                )}

                {/* Detailed Reason */}
                {product.detailed_reason && (
                  <div className="mb-4">
                    <div className="font-semibold">Detailed Reason</div>
                    <p className="text-sm text-gray-600 mt-1">{product.detailed_reason}</p>
                  </div>
                )}

                {/* AI Disclaimer */}
                <div className="mt-4 p-2 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-700">
                  <p>
                    <strong>Disclaimer:</strong> Information generated by AI may contain inaccuracies. Verify critical details.
                  </p>
                </div>

                {/* Review Status & Creation Date */}
                <div className="text-sm text-gray-500 mt-6">
                  <div className="flex gap-2 mb-2">
                    <span className={`px-2 py-1 rounded ${
                      product.reviewed_by_ai ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                    }`}>
                      AI Reviewed
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      product.reviewed_by_human ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                    }`}>
                      Human Reviewed
                    </span>
                  </div>
                  Created: {new Date(product.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
