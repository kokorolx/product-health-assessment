import { S3Client } from '@aws-sdk/client-s3';

if (!process.env.R2_ACCESS_KEY) throw new Error('R2_ACCESS_KEY is required');
if (!process.env.R2_SECRET_KEY) throw new Error('R2_SECRET_KEY is required');
if (!process.env.R2_ENDPOINT) throw new Error('R2_ENDPOINT is required');

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

export const BUCKET_NAME = process.env.R2_BUCKET_NAME;