export type UploadResponse = {
  success: true;
  fileUrl: string;
} | {
  success: false;
  error: string;
}

export interface PresignResponse {
  url: string;    // Presigned URL for upload
  key: string;    // File key/path in R2
}

export interface TriggerN8NRequest {
  fileUrl: string;    // Public URL of uploaded file
  fileKey: string;    // R2 file key/path
}

export type APIResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
}