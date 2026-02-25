'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { API_URL } from '@/lib/constants'
import { formatAndValidatePhone } from '@/lib/auth-utils'

export async function signup(state: any, formData: FormData) {
    let returnedFormData = {};
    try {
        const data = Object.fromEntries(formData.entries()) as Record<string, string>;

        returnedFormData = {
            full_name: data.full_name,
            place: data.place,
            district: data.district,
            country_code: data.country_code,
            phone_number_local: data.phone_number_local
        };

        if (data.password !== data.confirm_password) {
            return { error: 'Passwords do not match.', ...returnedFormData };
        }
        delete data.confirm_password; // Don't send confirm_password to the backend

        if (data.country_code && data.phone_number_local) {
            const { error: phoneError, formattedPhone } = formatAndValidatePhone(data.country_code, data.phone_number_local);

            if (phoneError) {
                return { error: phoneError, ...returnedFormData };
            }

            data.phone_number = formattedPhone as string;
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
            return { error: body.message || 'Failed to register', ...returnedFormData }
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
        return { error: 'An unexpected error occurred. Please try again.', ...returnedFormData }
    }
}

export async function login(state: any, formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries()) as Record<string, string>;

        // Save these for returning to the frontend on an error
        const returnedPhoneNumberLocal = data.phone_number_local;
        const returnedCountryCode = data.country_code;

        if (data.country_code && data.phone_number_local) {
            const { error: phoneError, formattedPhone } = formatAndValidatePhone(data.country_code, data.phone_number_local);

            if (phoneError) {
                return {
                    error: phoneError,
                    country_code: returnedCountryCode,
                    phone_number_local: returnedPhoneNumberLocal
                };
            }

            data.phone_number = formattedPhone as string;
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
        let userRole = 'USER'
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

            try {
                // Decode the JWT payload to check the role natively in NextJS edge/server
                const base64Url = token.split('.')[1]
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                }).join(''))
                const payload = JSON.parse(jsonPayload)
                userRole = payload.role || 'USER'
            } catch (e) {
                console.error('Failed to decode JWT role', e)
            }
        }

        revalidatePath('/', 'layout')

        if (userRole === 'ADMIN') {
            redirect('/admin')
        } else {
            redirect('/play')
        }
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
