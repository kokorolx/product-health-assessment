import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, BUCKET_NAME } from '@/lib/r2Config';
import type { UploadResponse } from '@/types/api';

export const runtime = 'edge';

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      } as UploadResponse);
    }

    const fileBuffer = await file.arrayBuffer();
    const fileKey = `uploads/${Date.now()}-${file.name}`;

    // Upload to R2
    await r2Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: new Uint8Array(fileBuffer),
      ContentType: file.type
    }));

    // Generate public URL
    const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileKey}`;

    // Trigger N8N webhook
    await fetch(process.env.N8N_WEBHOOK_URL as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileUrl,
        fileKey,
      }),
    });

    return NextResponse.json({
      success: true,
      fileUrl
    } as UploadResponse);

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file'
    } as UploadResponse);
  }
}