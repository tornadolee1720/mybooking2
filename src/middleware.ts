import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware has been intentionally disabled by setting an empty matcher.
// The previous implementations caused persistent logout issues during client-side
// navigation in the admin panel.
// Authentication is now handled solely by the login form.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [], // An empty matcher effectively disables the middleware.
};
