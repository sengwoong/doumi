import { authMiddleware } from "@/auth"
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
    const session = await authMiddleware(request);
    
    // 로그인/회원가입 페이지 경로 확인
    const isAuthPage = request.nextUrl.pathname === '/login' || 
                      request.nextUrl.pathname === '/signup' ||
                      request.nextUrl.pathname === '/register';

    if (session && isAuthPage) {
        return NextResponse.redirect(new URL('/home', request.url));
    }
    
    const isProtectedRoute = config.matcher.some(pattern => {
        const regex = new RegExp(`^${pattern.replace('*', '.*')}$`);
        return regex.test(request.nextUrl.pathname);
    });

    if (!session && isProtectedRoute) {
        const redirectUrl = new URL('/login', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/createNotion/:path*',
    '/home/:path*',
    '/projects/:path*',
    '/upload/:path*',
    '/login',
    '/signup',
    '/register'
  ]
}