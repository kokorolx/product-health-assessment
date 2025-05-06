import { useState, useEffect } from 'react';
import { uploadProductImage, createProductRecord, updateProductImage } from '@/lib/storage';

interface ImageUploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  onSuccess?: (imageUrl: string) => void;
}

const ImageUploadForm = ({ isOpen, onClose, productId, onSuccess }: ImageUploadFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [healthScore, setHealthScore] = useState(50);
  const [suitableFor, setSuitableFor] = useState('General');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Create and cleanup image preview URL
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  // Reset form state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setProductName('');
      setCategory('');
      setHealthScore(50);
      setSuitableFor('General');
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (!selectedFile) {
        throw new Error('Please select an image file');
      }

      let image_url: string;

      if (productId) {
        // Update existing product's image
        image_url = await updateProductImage(productId, selectedFile);
        setSuccessMessage('Image updated successfully!');
      } else {
        // Create new product
        if (!productName.trim()) {
          throw new Error('Please enter a product name');
        }
        if (!category) {
          throw new Error('Please select a category');
        }

        image_url = await uploadProductImage(selectedFile);
        await createProductRecord({
          product_name: productName,
          category,
          image_url,
          health_score: healthScore,
          suitable_for: suitableFor,
        });
        setSuccessMessage('Product created successfully!');
      }

      if (onSuccess) {
        onSuccess(image_url);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">
              {productId ? 'Update Product Image' : 'Upload Product Image'}
            </h2>

            {/* Status Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Input */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {/* Image Preview */}
                {previewUrl && (
                  <div className="mt-2 relative w-full h-48">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="rounded-md object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>

              {!productId && (
                <>
                  {/* Product Name */}
                  <div>
                    <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="product_name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a category</option>
                      <option value="detergent">Detergent</option>
                      <option value="cleanser">Cleanser</option>
                      <option value="soap">Soap</option>
                      <option value="sanitizer">Sanitizer</option>
                    </select>
                  </div>

                  {/* Health Score */}
                  <div>
                    <label htmlFor="health_score" className="block text-sm font-medium text-gray-700 mb-2">
                      Health Score (0-100)
                    </label>
                    <input
                      type="number"
                      id="health_score"
                      value={healthScore}
                      onChange={(e) => setHealthScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Suitable For */}
                  <div>
                    <label htmlFor="suitable_for" className="block text-sm font-medium text-gray-700 mb-2">
                      Suitable For
                    </label>
                    <select
                      id="suitable_for"
                      value={suitableFor}
                      onChange={(e) => setSuitableFor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="General">General</option>
                      <option value="Sensitive">Sensitive</option>
                      <option value="Baby">Baby</option>
                      <option value="Pets">Pets</option>
                    </select>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Uploading...' : (productId ? 'Update Image' : 'Submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadForm;