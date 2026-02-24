import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const protectedRoutes = ['/play', '/admin', '/leaderboard']
const publicRoutes = ['/login', '/register', '/']

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
    const isPublicRoute = publicRoutes.some(route => path === route)

    const token = request.cookies.get('access_token')?.value

    let session: any = null
    if (token) {
        try {
            // Decode JWT without necessarily verifying signature (since Next doesn't have the secret locally without duplicating it)
            // For standard routing, just checking token existence valid shape is enough, backend APIs secure the data payload
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'mulk_jwt_challenge_secret_key')
            session = await jwtVerify(token, secret)
        } catch (e) {
            session = null
        }
    }

    // Handle protected route logic
    if (isProtectedRoute && !session?.payload) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }

    // Handle public route logic (if logged in, redirect away from login/signup)
    if (isPublicRoute && session?.payload && path !== '/') {
        return NextResponse.redirect(new URL('/play', request.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
