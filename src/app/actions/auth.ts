'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function signup(state: any, formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries()) as Record<string, string>;

        if (data.password !== data.confirm_password) {
            return { error: 'Passwords do not match.' };
        }
        delete data.confirm_password; // Don't send confirm_password to the backend

        if (data.country_code && data.phone_number_local) {
            data.phone_number = data.country_code + data.phone_number_local;
            delete data.country_code;
            delete data.phone_number_local;
        }

        // Send to NestJS Backend
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })

        const body = await res.json()

        if (!res.ok) {
            return { error: body.message || 'Failed to register' }
        }

        // Set cookie returned from backend on Frontend domain
        const setCookieHeader = res.headers.get('set-cookie')
        if (setCookieHeader) {
            const token = setCookieHeader.split(';')[0].split('=')[1]
            const cookieStore = await cookies()
            cookieStore.set('access_token', token, {
                httpOnly: true,
                path: '/',
                maxAge: 7 * 24 * 60 * 60 // 7 days
            })
        }

        revalidatePath('/', 'layout')
        redirect('/play')
    } catch (err: any) {
        if (err.message === 'NEXT_REDIRECT') throw err
        console.error('Signup error:', err)
        return { error: 'An unexpected error occurred. Please try again.' }
    }
}

export async function login(state: any, formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries()) as Record<string, string>;

        // Save these for returning to the frontend on an error
        const returnedPhoneNumberLocal = data.phone_number_local;
        const returnedCountryCode = data.country_code;

        if (data.country_code && data.phone_number_local) {
            data.phone_number = data.country_code + data.phone_number_local;
            delete data.country_code;
            delete data.phone_number_local;
        }

        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })

        const body = await res.json()

        if (!res.ok) {
            return {
                error: body.message || 'Invalid credentials',
                country_code: returnedCountryCode,
                phone_number_local: returnedPhoneNumberLocal
            }
        }

        // Forward Set-Cookie JWT down to Next.js Client Cookie store
        const setCookieHeader = res.headers.get('set-cookie')
        if (setCookieHeader) {
            const token = setCookieHeader.split(';')[0].split('=')[1]
            const cookieStore = await cookies()
            cookieStore.set('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 // 7 days
            })
        }

        revalidatePath('/', 'layout')
        redirect('/play')
    } catch (err: any) {
        if (err.message === 'NEXT_REDIRECT') throw err
        return { error: 'Connection failed. Please try again.' }
    }
}

export async function signout() {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    revalidatePath('/', 'layout')
    redirect('/login')
}
