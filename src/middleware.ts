import { CheckToken } from "@/routes/routes";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log(request.url);

  const token = cookies().get("token")?.value;
  if (token) {
    const userData = await CheckToken({ token: token });
    const response = NextResponse.next();
    response.cookies.set("user", JSON.stringify(userData));
    if (userData) return response;
  }
  
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    {
      source: "/dashboard/:path*",
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
        { type: 'header', key: 'Next-Router-State-Tree'},
      ],
    }
  ]
};
