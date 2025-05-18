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
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" // Increased opacity, added backdrop-blur
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"> {/* Enhanced shadow, rounded-xl, scrollbar */}
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-2 top-2 p-3 text-slate-400 hover:text-slate-600 bg-black/20 hover:bg-black/30 rounded-full transition-all z-[51]"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-6 md:p-8"> {/* Increased padding */}
            <div className={`grid ${(!product.image_url || !product.image_url.trim()) ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-8 items-start`}>
              {/* Left column - Image */}
              <div className={`flex items-center justify-center ${(!product.image_url || !product.image_url.trim()) ? 'max-w-2xl mx-auto' : ''}`}>
                <div className="w-full max-w-sm aspect-[4/3] relative rounded-lg overflow-hidden shadow-md">
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
              {(product.image_url && product.image_url.trim()) && (
                <div className="text-slate-700"> {/* Default text color for this section */}
                <h2 className="text-3xl font-bold mb-3 text-slate-900"> {/* Larger, bolder title */}
                  {product.product_name}
                </h2>
                <div className="text-slate-600 mb-6"> {/* Slightly lighter text for meta info */}
                  <p><span className="font-medium text-slate-700">Category:</span> {product.category}</p>
                  <p className="mt-1"><span className="font-medium text-slate-700">Suitable for:</span> {product.suitable_for}</p>
                </div>

                {/* Source URL */}
                {product.source_url && (
                  <div className="mb-5">
                    <div className="font-semibold text-slate-800">Source</div>
                    <a
                      href={product.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      View Original
                    </a>
                  </div>
                )}

                {/* Health Score */}
                <div className="mb-5">
                  <div className="font-semibold text-slate-800">Health Score</div>
                  <div className="mt-1 text-lg">{product.health_score}/100</div>
                </div>

                {/* Ingredients */}
                <div className="mb-5">
                  <div className="font-semibold text-slate-800">Ingredients</div>
                  <pre className="text-sm text-slate-600 mt-1 whitespace-pre-wrap bg-slate-50 p-3 rounded-md"> {/* Added background to pre */}
                    {JSON.stringify(product.ingredients, null, 2)}
                  </pre>
                </div>

                {/* Suitability Notes */}
                {product.suitability_notes && (
                  <div className="mb-5">
                    <div className="font-semibold text-slate-800">Suitability Notes</div>
                    <div className="mt-1 prose prose-sm max-w-none"> {/* Using prose for better typography */}
                      <SuitabilityNotes notes={product.suitability_notes} />
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="mb-5">
                  <div className="font-semibold text-slate-800">Summary</div>
                  <p className="text-sm text-slate-600 mt-1">{product.summary}</p>
                </div>

                {/* Careful Note */}
                {product.careful_note && (
                  <div className="mb-5">
                    <div className="font-semibold text-slate-800">Careful Note</div>
                    <p className="text-sm text-slate-600 mt-1">{product.careful_note}</p>
                  </div>
                )}

                {/* Detailed Reason */}
                {product.detailed_reason && (
                  <div className="mb-5">
                    <div className="font-semibold text-slate-800">Detailed Reason</div>
                    <p className="text-sm text-slate-600 mt-1">{product.detailed_reason}</p>
                  </div>
                )}

                {/* AI Disclaimer */}
                <div className="mt-6 p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-800"> {/* Changed to amber for softer warning */}
                  <p>
                    <strong>Disclaimer:</strong> Information generated by AI may contain inaccuracies. Verify critical details.
                  </p>
                </div>

                {/* Review Status & Creation Date */}
                <div className="text-xs text-slate-500 mt-6"> {/* Smaller text for footer info */}
                  <div className="flex gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${ // rounded-full for pill shape
                      product.reviewed_by_ai ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      AI Reviewed
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.reviewed_by_human ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      Human Reviewed
                    </span>
                  </div>
                  Created: {new Date(product.created_at).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
