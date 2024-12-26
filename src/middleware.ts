import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // const subdomain = request.url.split('.')[0];

  console.log(request.nextUrl.host);

  return NextResponse.next();
}
