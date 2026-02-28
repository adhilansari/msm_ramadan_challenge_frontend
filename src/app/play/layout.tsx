import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { API_URL } from '@/lib/constants'

export default async function PlayLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
        redirect('/login')
    }

    let profile = null

    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        })
        if (!res.ok) {
            throw new Error('Failed to fetch profile')
        }
        profile = await res.json()
    } catch (err) {
        // If profile fetch fails (e.g., token invalid), clear cookie and redirect
        redirect('/api/auth/logout')
    }

    return (
        <div className="min-h-screen flex flex-col bg-transparent text-foreground relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute inset-0 bg-neutral-100/60 dark:bg-neutral-950/60 pointer-events-none -z-10" />


            <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl relative z-10 w-full">
                {children}
            </main>
        </div>
    )
}
