import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const config = {
  matcher: '/admin/:path*',
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const url = request.nextUrl.clone();

  // If user is not logged in and is trying to access a protected admin page
  if (!session && url.pathname !== '/admin/login') {
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // If user is logged in and tries to access the login page, redirect them to the dashboard
  if (session && url.pathname === '/admin/login') {
    url.pathname = '/admin/manage-inventory';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
