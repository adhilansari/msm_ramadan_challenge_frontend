'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const initialState = { error: '' }

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const error = await login(prevState, formData);
        if (error?.error) return error;
        return initialState;
    }, initialState)

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-transparent text-neutral-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-950/80 to-neutral-950 -z-10" />

            <Card className="max-w-md w-full border-neutral-800 bg-neutral-900/50 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-emerald-400">Welcome Back</CardTitle>
                    <CardDescription className="text-neutral-400">
                        Sign in with your phone number to continue the challenge.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="phone_number_input" className="text-neutral-300">Phone Number</Label>
                            <div className="flex gap-2">
                                <select
                                    className="bg-neutral-900/50 border border-neutral-700 text-white rounded-lg h-12 px-3 w-[100px] focus:ring-2 focus:ring-emerald-500 outline-none"
                                    name="country_code"
                                    defaultValue="+91"
                                >
                                    <option value="+91">🇮🇳 +91</option>
                                    <option value="+971">🇦🇪 +971</option>
                                    <option value="+966">🇸🇦 +966</option>
                                    <option value="+1">🇺🇸 +1</option>
                                    <option value="+44">🇬🇧 +44</option>
                                    <option value="+60">🇲🇾 +60</option>
                                    <option value="+65">🇸🇬 +65</option>
                                </select>
                                <Input id="phone_number_input" name="phone_number_local" type="tel" required className="bg-neutral-900/50 flex-1 border-neutral-700 text-white placeholder:text-neutral-500 rounded-lg h-12" placeholder="1234567890" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-neutral-300">Password</Label>
                            <Input id="password" name="password" type="password" required className="bg-neutral-900/50 border-neutral-700 text-white placeholder:text-neutral-500 rounded-lg h-12" placeholder="••••••••" />
                        </div>

                        {state?.error && (
                            <div className="text-red-400 text-sm bg-red-950/20 p-3 rounded-lg border border-red-900/50">
                                {state.error}
                            </div>
                        )}

                        <Button type="submit" disabled={isPending} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 text-base font-medium transition-colors">
                            {isPending ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-neutral-400">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4">
                            Register here
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
