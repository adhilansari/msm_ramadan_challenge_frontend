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
    } catch (error) {
        console.error('Error saving session:', error)
        return { error: 'An unexpected error occurred' }
    }
}
