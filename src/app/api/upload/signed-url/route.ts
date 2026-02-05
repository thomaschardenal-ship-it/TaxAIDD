import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, DOCUMENTS_BUCKET, isSupabaseConfigured } from '@/lib/supabase/client';
import { generateStoragePath, validateFile, UPLOAD_CONFIG } from '@/lib/upload/config';

interface SignedUrlRequest {
  projectId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Return mock response for development without Supabase
      const body: SignedUrlRequest = await request.json();
      const path = generateStoragePath(body.projectId, body.fileName);

      return NextResponse.json({
        signedUrl: `mock://upload/${path}`,
        path,
        token: 'mock-token',
        isMock: true,
      });
    }

    const body: SignedUrlRequest = await request.json();
    const { projectId, fileName, fileSize, mimeType } = body;

    // Validate request
    if (!projectId || !fileName) {
      return NextResponse.json(
        { error: 'projectId and fileName are required' },
        { status: 400 }
      );
    }

    // Validate file size
    if (fileSize > UPLOAD_CONFIG.maxSingleFileSize) {
      return NextResponse.json(
        { error: `File too large. Maximum: ${UPLOAD_CONFIG.maxSingleFileSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validate mime type
    const extValid = UPLOAD_CONFIG.allowedExtensions.some(ext =>
      fileName.toLowerCase().endsWith(ext)
    );
    const mimeValid = UPLOAD_CONFIG.allowedMimeTypes.includes(mimeType as typeof UPLOAD_CONFIG.allowedMimeTypes[number]);

    if (!extValid && !mimeValid) {
      return NextResponse.json(
        { error: 'File type not supported' },
        { status: 400 }
      );
    }

    // Generate storage path
    const path = generateStoragePath(projectId, fileName);

    // Get signed URL from Supabase
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUploadUrl(path);

    if (error) {
      console.error('[SignedUrl API] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create upload URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: data.path,
      token: data.token,
    });
  } catch (error) {
    console.error('[SignedUrl API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
