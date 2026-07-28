import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { fetchClassChallenge } from '@/lib/api'
import StudentLobby from './StudentLobby'
import { API_URL } from '@/lib/constants'

export default async function PlayPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
        redirect('/login')
    }

    let user = null

    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        })
        if (res.ok) {
            user = await res.json()
        } else {
            throw new Error('Failed to fetch user')
        }
    } catch (err) {
        redirect('/api/auth/logout')
    }


    if (!user.class || user.class.trim() === '') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                <div className="max-w-md w-full bg-amber-500/10 border border-amber-500/20 rounded-3xl p-8 text-center shadow-lg glass-panel animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mb-2">Class Not Assigned</h2>
                    <p className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed">
                        You need to assign your Madrasa class to your profile before you can participate in a challenge.
                    </p>
                    <Link href="/profile" className="inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-lg h-12 py-2 px-4 w-full group">
                        Update Profile
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                </div>
            </div>
        )
    }

    // Fetch challenge dynamically for user's class
    const challenge = await fetchClassChallenge(user.class, token)

    if (!challenge || !challenge.ayats || challenge.ayats.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-red-400">
                Failed to load Madrasa challenge. Please try again later.
            </div>
        )
    }

    // Fetch class leaderboard entries
    let leaderboard = { totalParticipants: 0, data: [] }
    try {
        const res = await fetch(`${API_URL}/game/leaderboard?limit=10&class=${encodeURIComponent(user.class || '')}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        })
        if (res.ok) {
            leaderboard = await res.json()
        }
    } catch (err) {
        console.error('Failed to fetch class leaderboard for lobby', err)
    }

    return (
        <StudentLobby 
            user={user}
            challenge={challenge}
            leaderboard={leaderboard}
        />
    )
}

