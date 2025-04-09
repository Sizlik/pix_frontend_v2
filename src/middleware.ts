import { CheckToken } from "@/routes/routes";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("_rsc")) {
    return NextResponse.next();
  }

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
  matcher: "/dashboard/:path*",
};
