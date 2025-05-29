'use client';

import { useState } from 'react';
import type { UploadResponse } from '@/types/api';

interface UseUploadReturn {
  uploadFile: (file: File) => Promise<void>;
  isUploading: boolean;
  error: string | null;
  reset: () => void;
  progress?: number;
}

export function useUpload(): UseUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>();

  const reset = () => {
    setIsUploading(false);
    setError(null);
    setProgress(undefined);
  };

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          setProgress(percentCompleted);
        }
      });

      // Create Promise to handle the XHR request
      const uploadPromise = new Promise<UploadResponse>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText) as UploadResponse;
            resolve(response);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error occurred'));
      });

      // Start the upload
      xhr.open('POST', '/api/upload');
      xhr.send(formData);

      const response = await uploadPromise;

      if (!response.success) {
        throw new Error(response.error);
      }

      setProgress(100);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    error,
    reset,
    progress,
  };
}