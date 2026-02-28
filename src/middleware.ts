import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const protectedRoutes = ['/play', '/admin']
const publicRoutes = ['/login', '/register', '/', '/leaderboard']

interface JWTPayload {
    id: string;
    full_name: string;
    role: 'USER' | 'ADMIN';
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
    const isPublicRoute = publicRoutes.some(route => path === route)

    const token = request.cookies.get('access_token')?.value

    let session: { payload: JWTPayload } | null = null
    if (token) {
        try {
            // Decode JWT without necessarily verifying signature (since Next doesn't have the secret locally without duplicating it)
            // For standard routing, just checking token existence valid shape is enough, backend APIs secure the data payload
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'mulk_jwt_challenge_secret_key')
            const result = await jwtVerify(token, secret)
            session = result as unknown as { payload: JWTPayload }
        } catch (e) {
            session = null
        }
    }

    // Handle admin route logic specifically
    if (path.startsWith('/admin')) {
        if (!session?.payload || session.payload.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.nextUrl))
        }
    }

    // Handle standard protected route logic
    if (isProtectedRoute && !session?.payload) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }

    // Handle public route logic (if logged in, redirect away from login/signup)
    // Exclude /leaderboard so logged-in users can still access it
    if (isPublicRoute && session?.payload && path !== '/' && path !== '/leaderboard') {
        return NextResponse.redirect(new URL('/play', request.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
