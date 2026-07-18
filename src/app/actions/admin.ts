'use server'

import { cookies } from 'next/headers'

import { API_URL } from '@/lib/constants'

export async function fetchAdminDashboard() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (!token) {
            return { error: 'Unauthorized' }
        }

        const res = await fetch(`${API_URL}/admin/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store' // Ensure fresh data
        })

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                return { error: 'Unauthorized' }
            }
            return { error: 'Failed to fetch dashboard data' }
        }

        const data = await res.json()
        return { data }

    } catch (err) {
        console.error('Fetch Admin Dashboard error:', err)
        return { error: 'An unexpected error occurred.' }
    }
}

export async function updateAdminConfig(class_name: string, surah_number: number, start_ayat: number, end_ayat: number) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (!token) {
            return { error: 'Unauthorized' }
        }

        const res = await fetch(`${API_URL}/admin/config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ class_name, surah_number, start_ayat, end_ayat })
        })


        if (!res.ok) {
            const data = await res.json()
            return { error: data.message || 'Failed to update config' }
        }

        return { success: true }
    } catch (err) {
        console.error('Update Admin Config error:', err)
        return { error: 'An unexpected error occurred while saving configuration.' }
    }
}

export async function resetAdminUserPassword(userId: string, newPassword: string) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (!token) {
            return { error: 'Unauthorized' }
        }

        const res = await fetch(`${API_URL}/admin/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId, newPassword })
        })

        if (!res.ok) {
            const data = await res.json()
            return { error: data.message || 'Failed to reset user password' }
        }

        return { success: true }
    } catch (err) {
        console.error('Reset Admin User Password error:', err)
        return { error: 'An unexpected error occurred while resetting the password.' }
    }
}
