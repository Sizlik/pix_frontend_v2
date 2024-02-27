import { CheckToken } from '@/routes/routes';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server'
 
export async function middleware(request: NextRequest) {
  const token = cookies().get("token")?.value;
  if (token) {
    const response = await CheckToken({ token: token });
    if (response) return NextResponse.next()
  }
  
  return NextResponse.redirect(new URL('/', request.url))
}
 
export const config = {
  matcher: '/dashboard/:path*',
}