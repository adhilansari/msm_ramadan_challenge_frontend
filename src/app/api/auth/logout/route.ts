import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')

    // Redirect back to login page
    return NextResponse.redirect(new URL('/login', request.url))
}
