import { NextResponse } from 'next/server';
import { APIResponse } from '@/types/api';
import type { TriggerN8NRequest } from '@/types/api';

if (!process.env.N8N_WEBHOOK_URL) {
  throw new Error('N8N_WEBHOOK_URL is required');
}

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    let body: TriggerN8NRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<APIResponse<never>>({
        success: false,
        error: 'Invalid request body'
      }, { status: 400 });
    }

    const { fileUrl, fileKey } = body;

    if (!fileUrl || !fileKey) {
      return NextResponse.json<APIResponse<never>>({
        success: false,
        error: 'fileUrl and fileKey are required'
      }, { status: 400 });
    }

    // Trigger N8N webhook
    const response = await fetch(process.env.N8N_WEBHOOK_URL as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileUrl,
        fileKey,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.statusText}`);
    }

    return NextResponse.json<APIResponse<{ message: string }>>({
      success: true,
      data: { message: 'N8N webhook triggered successfully' }
    });

  } catch (error) {
    console.error('Error triggering N8N webhook:', error);
    return NextResponse.json<APIResponse<never>>({
      success: false,
      error: 'Failed to trigger N8N webhook'
    }, { status: 500 });
  }
}