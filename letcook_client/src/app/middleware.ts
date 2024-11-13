import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply to /api/cloudinary route
  if (request.nextUrl.pathname === '/api/cloudinary') {
    // Set maximum file size (100MB)
    const contentLength = parseInt(request.headers.get('content-length') || '0');
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB

    if (contentLength > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds limit (100MB)' },
        { status: 413 }
      );
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: '/api/cloudinary'
};