'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { API_URL } from '@/lib/constants'

export async function saveSession(total_time: string) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (!token) {
            return { error: 'Unauthorized' }
        }

        const res = await fetch(`${API_URL}/game/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ total_time })
        })

        if (!res.ok) {
            const error = await res.json()
            return { error: error.message || 'Failed to save session' }
        }

        revalidatePath('/leaderboard')
        revalidatePath('/admin')
        revalidatePath('/')

        return { success: true }
    } catch (error: any) {
        console.error('Error saving session:', error)
        if (error?.message?.includes('fetch failed')) {
            return { error: 'Server is starting up (this can take up to 50s on the free tier). Please try again in a minute.' }
        }
        return { error: 'An unexpected error occurred' }
    }
}
