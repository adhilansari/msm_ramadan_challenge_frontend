import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { API_URL } from '@/lib/constants'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (!token) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const res = await fetch(`${API_URL}/admin/download-csv`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!res.ok) {
            return new NextResponse('Failed to fetch CSV', { status: res.status })
        }

        const csvBlob = await res.blob()

        return new NextResponse(csvBlob, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="surah_mulk_challenge_users.csv"',
            },
        })

    } catch (err) {
        console.error('Download CSV error:', err)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
