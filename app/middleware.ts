import { auth } from "./auth"
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
    const session = await auth();
    
    // 로그인되지 않은 경우
    if (!session) {
        // 현재 접근하려는 URL을 인코딩하여 리다이렉트 후 돌아올 수 있게 함
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.append('callbackUrl', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/upload/:path*',
        '/createNotion/:path*',
        '/projects/:path*',
        '/settings/:path*',
        '/admin/:path*'
    ]
}