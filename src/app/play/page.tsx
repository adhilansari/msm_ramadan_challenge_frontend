import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { fetchSurahMulk } from '@/lib/api'
import GameBoard from './GameBoard'
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

    // Fetch all ayats before rendering GameBoard
    const ayats = await fetchSurahMulk()

    if (!ayats || ayats.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-red-400">
                Failed to load Ayats. Please try again later.
            </div>
        )
    }

    return (
        <div className="fade-in animate-in">
            <GameBoard ayats={ayats} userId={user.id} />
        </div>
    )
}
