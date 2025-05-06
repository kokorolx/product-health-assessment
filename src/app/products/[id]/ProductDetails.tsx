'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DetailedProduct } from '@/types';
import HealthScoreIndicator from '@/components/HealthScoreIndicator';
import SuitabilityNotes from '@/components/SuitabilityNotes';
import ImageUploadForm from '@/components/ImageUploadForm';

interface ProductDetailsProps {
  product: DetailedProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(product.image_url);

  const handleImageUpdate = (newImageUrl: string) => {
    setCurrentImageUrl(newImageUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/products" className="text-blue-600 hover:text-blue-800">
            ← Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Image */}
              <div>
                <div className="relative w-full h-96">
                  <Image
                    src={currentImageUrl}
                    alt={product.product_name}
                    fill
                    className="object-contain rounded-lg"
                  />
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Update Image
                  </button>
                </div>
              </div>

              {/* Right Column - Details */}
              <div>
                <h1 className="text-3xl font-bold mb-4">{product.product_name}</h1>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <HealthScoreIndicator score={product.health_score} />
                  </div>
                  <div>
                    <div className="text-gray-600">Health Score</div>
                    <div className="text-2xl font-bold">{product.health_score}/100</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-gray-700">Category</div>
                    <div className="mt-1 text-gray-600">{product.category}</div>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-700">Suitable For</div>
                    <div className="mt-1 text-gray-600">{product.suitable_for}</div>
                  </div>

                  {product.source_url && (
                    <div>
                      <div className="font-semibold text-gray-700">Source</div>
                      <a
                        href={product.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-blue-600 hover:text-blue-800"
                      >
                        View Original Source
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="mt-12 space-y-8">
              {/* Summary */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Summary</h2>
                <p className="text-gray-600">{product.summary}</p>
              </div>

              {/* Ingredients */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(product.ingredients, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Suitability Notes */}
              {product.suitability_notes && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Suitability Notes</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <SuitabilityNotes notes={product.suitability_notes} />
                  </div>
                </div>
              )}

              {/* Careful Note */}
              {product.careful_note && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Careful Note</h2>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-gray-800">{product.careful_note}</p>
                  </div>
                </div>
              )}

              {/* Detailed Reason */}
              {product.detailed_reason && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Detailed Analysis</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600">{product.detailed_reason}</p>
                  </div>
                </div>
              )}

              {/* AI Disclaimer */}
              <div className="mt-6 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
                <p>
                  <strong>Disclaimer:</strong> Product information, including health scores and analysis, is generated by AI. While we strive for accuracy, AI can make mistakes. Please verify critical information independently.
                </p>
              </div>

              {/* Review Status & Creation Date */}
              <div className="border-t pt-6">
                <div className="flex flex-wrap gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    product.reviewed_by_ai ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    AI Reviewed
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    product.reviewed_by_human ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    Human Reviewed
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                    Created: {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageUploadForm
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        productId={product.id}
        onSuccess={handleImageUpdate}
      />
    </div>
  );
}