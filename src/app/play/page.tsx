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

    // Fetch challenge dynamically for user's class
    const challenge = await fetchClassChallenge(user.class || '', token)

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

