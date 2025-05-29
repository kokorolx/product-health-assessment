'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useUpload } from '@/hooks/useUpload';
import { CountdownTimer } from './CountdownTimer';

export default function UploadComponent() {
  const { uploadFile, isUploading, error, reset, progress } = useUpload();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRefresh, setShowRefresh] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      reset();
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      reset();
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    // Create preview URL
    const newPreviewUrl = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(newPreviewUrl);
    reset(); // Reset any previous upload state
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      await uploadFile(file);
      // Start processing state after successful upload
      setIsProcessing(true);
      // Keep the preview during processing
    } catch (err) {
      // Error is handled by the hook
      console.error('Upload failed:', err);
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleProcessingComplete = useCallback(() => {
    setIsProcessing(false);
    setShowRefresh(true);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  // Cleanup preview URL when component unmounts or when preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-1/2 p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl transition-all duration-300 ease-in-out">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
        {/* File input section */}
        <div className="flex flex-col items-center gap-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-white hover:bg-gray-50 text-blue-600 font-medium py-2 px-4 rounded-md border border-blue-300 shadow-sm transition-colors"
          >
            Select Image
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </label>

          {/* Preview section */}
          {previewUrl && (
            <div className="relative w-32 h-32">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* Processing state with countdown */}
          {isProcessing && (
            <div className="w-full text-center">
              <CountdownTimer
                duration={60}
                onComplete={handleProcessingComplete}
              />
            </div>
          )}

          {/* Refresh button */}
          {showRefresh && (
            <button
              onClick={handleRefresh}
              className="w-full py-2 px-4 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Click to see results
            </button>
          )}

          {/* Progress bar */}
          {isUploading && typeof progress === 'number' && (
            <div className="w-full">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center mt-1">
                {progress}%
              </p>
            </div>
          )}

          {/* Upload button */}
          {!isProcessing && !showRefresh && (
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
                file && !isUploading
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                'Upload Image'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}