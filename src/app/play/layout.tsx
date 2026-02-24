import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { signout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'

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

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
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
        // If profile fetch fails (e.g., token invalid), redirect to login
        redirect('/login')
    }

    return (
        <div className="min-h-screen flex flex-col bg-transparent text-foreground relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute inset-0 bg-neutral-100/60 dark:bg-neutral-950/60 pointer-events-none -z-10" />

            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                            M
                        </div>
                        <span className="font-semibold hidden sm:inline-block text-foreground">Surah Mulk Challenge</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <span className="text-sm text-muted-foreground font-medium">
                            {profile?.full_name}
                        </span>
                        <form action={signout}>
                            <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                                Log Out
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl relative z-10 w-full">
                {children}
            </main>
        </div>
    )
}
