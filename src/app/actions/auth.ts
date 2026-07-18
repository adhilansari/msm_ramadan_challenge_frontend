'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { API_URL } from '@/lib/constants'
import { formatAndValidatePhone } from '@/lib/auth-utils'

export interface SignupActionState {
    error: string;
    first_name?: string;
    last_name?: string;
    place?: string;
    district?: string;
    country_code?: string;
    phone_number_local?: string;
    is_msm_member?: boolean;
    msm_unit?: string;
    dob?: string;
    class?: string;
}

export async function signup(state: SignupActionState | null, formData: FormData) {
    let returnedFormData = {};
    try {
        const data = Object.fromEntries(formData.entries()) as Record<string, any>;

        // Checkbox values
        data.is_msm_member = data.is_msm_member === 'on' || data.is_msm_member === 'true';

        returnedFormData = {
            first_name: data.first_name,
            last_name: data.last_name,
            place: data.place,
            district: data.district,
            country_code: data.country_code,
            phone_number_local: data.phone_number_local,
            is_msm_member: data.is_msm_member,
            msm_unit: data.msm_unit,
            dob: data.dob,
            class: data.class
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
        redirect(`/register/success?id=${body.user.student_id}`)
    } catch (err) {
        if (err instanceof Error && err.message === 'NEXT_REDIRECT') throw err
        console.error('Signup error:', err)
        return { error: 'An unexpected error occurred. Please try again.', ...returnedFormData }
    }
}

export interface LoginActionState {
    error: string;
    country_code?: string;
    phone_number_local?: string;
}

export async function login(state: LoginActionState | null, formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries()) as Record<string, string>;

        // Save these for returning to the frontend on an error
        const returnedPhoneNumberLocal = data.phone_number_local;
        const returnedCountryCode = data.country_code;
        const studentId = data.student_id;

        if (studentId && /^\d{4}$/.test(studentId.trim())) {
            data.phone_number = studentId.trim();
            delete data.student_id;
            delete data.country_code;
            delete data.phone_number_local;
        } else if (data.country_code && data.phone_number_local) {
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
        } else {
            return {
                error: 'Please enter a valid 10-digit Phone Number or 4-digit Student ID.',
                country_code: returnedCountryCode,
                phone_number_local: returnedPhoneNumberLocal
            };
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
    } catch (err) {
        if (err instanceof Error && err.message === 'NEXT_REDIRECT') throw err
        return { error: 'Connection failed. Please try again.' }
    }
}

export async function signout() {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function getProfile() {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) return null

    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        })
        if (!res.ok) return null
        return await res.json()
    } catch (err) {
        console.error('getProfile error:', err)
        return null
    }
}

export async function updateProfile(state: any, formData: FormData) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value
        if (!token) {
            return { error: 'Not authenticated.' }
        }

        const data = Object.fromEntries(formData.entries()) as Record<string, any>

        // Handle checkbox
        data.is_msm_member = data.is_msm_member === 'on' || data.is_msm_member === 'true';

        // Prepare return payload
        const returnedData = {
            first_name: data.first_name,
            last_name: data.last_name,
            place: data.place,
            district: data.district,
            msm_unit: data.msm_unit,
            is_msm_member: data.is_msm_member,
            dob: data.dob,
            class: data.class,
            country_code: data.country_code,
            phone_number_local: data.phone_number_local,
        }

        // Validate passwords if user attempts to change it
        if (data.password || data.confirm_password) {
            if (data.password !== data.confirm_password) {
                return { error: 'Passwords do not match.', ...returnedData }
            }
        } else {
            // Delete if empty
            delete data.password
        }
        delete data.confirm_password

        // Format phone number
        if (data.country_code && data.phone_number_local) {
            const { error: phoneError, formattedPhone } = formatAndValidatePhone(data.country_code, data.phone_number_local);
            if (phoneError) {
                return { error: phoneError, ...returnedData }
            }
            data.phone_number = formattedPhone;
            delete data.country_code;
            delete data.phone_number_local;
        }

        const res = await fetch(`${API_URL}/auth/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })

        const body = await res.json()

        if (!res.ok) {
            return { error: body.message || 'Failed to update profile', ...returnedData }
        }

        // Set cookies if a new token was returned
        const setCookieHeader = res.headers.get('set-cookie')
        if (setCookieHeader) {
            const newToken = setCookieHeader.split(';')[0].split('=')[1]
            cookieStore.set('access_token', newToken, {
                httpOnly: true,
                path: '/',
                maxAge: 7 * 24 * 60 * 60
            })
        }

        revalidatePath('/', 'layout')
        return { success: 'Profile updated successfully!', user: body.user }
    } catch (err) {
        console.error('updateProfile error:', err)
        return { error: 'An unexpected error occurred.' }
    }
}
