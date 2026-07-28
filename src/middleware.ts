import { NextResponse, type NextRequest } from 'next/server'
import { decodeJwt } from 'jose'

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
            // Decode JWT without verifying signature (backend secures APIs, middleware just needs role/existence)
            const payload = decodeJwt(token)
            session = { payload: payload as unknown as JWTPayload }
        } catch (e) {
            console.error('Middleware JWT decode error:', e)
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
        const target = session.payload.role === 'ADMIN' ? '/admin' : '/profile'
        return NextResponse.redirect(new URL(target, request.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
