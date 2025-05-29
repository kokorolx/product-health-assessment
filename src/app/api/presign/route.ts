import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, BUCKET_NAME } from '@/lib/r2Config';
import { APIResponse, PresignResponse } from '@/types/api';

export async function GET(request: Request) {
  try {
    // Get filename from query params
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json<APIResponse<never>>({
        success: false,
        error: 'Filename is required'
      }, { status: 400 });
    }

    // Generate unique key
    const key = `uploads/${Date.now()}-${filename}`;

    // Create command for PutObject
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    // Generate presigned URL
    const url = await getSignedUrl(r2Client, command, { expiresIn: 3600 }); // 1 hour expiry

    const response: PresignResponse = {
      url,
      key,
    };

    return NextResponse.json<APIResponse<PresignResponse>>({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json<APIResponse<never>>({
      success: false,
      error: 'Failed to generate upload URL'
    }, { status: 500 });
  }
}