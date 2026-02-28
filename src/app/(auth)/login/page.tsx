'use client'

import { useActionState, useState } from 'react'
import { login } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

interface ActionState {
    error: string;
    country_code?: string;
    phone_number_local?: string;
}

const initialState: ActionState = { error: '', country_code: '+91', phone_number_local: '' }

export default function LoginPage() {
    const [countryCode, setCountryCode] = useState('+91');
    const [phoneLocal, setPhoneLocal] = useState('');
    const [password, setPassword] = useState('');

    const [state, formAction, isPending] = useActionState<ActionState, FormData>(async (prevState: any, formData: FormData) => {
        const result = await login(prevState, formData);
        if (result?.error) {
            // Restore state if backend returns it
            if (result.country_code) setCountryCode(result.country_code);
            if (result.phone_number_local) setPhoneLocal(result.phone_number_local);
            return result as ActionState;
        }
        return initialState;
    }, initialState)

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-transparent text-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-100/50 via-background to-background dark:from-emerald-900/20 dark:via-neutral-950/80 dark:to-neutral-950 -z-10" />

            <Card className="max-w-md w-full border-border bg-card/50 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="space-y-1 flex flex-col items-center text-center">
                    <Image src="/msm-challenge-logo.png" alt="Surah Mulk Challenge" width={100} height={100} className="mb-2 drop-shadow-md rounded-2xl" />
                    <CardTitle className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">Welcome Back</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Sign in with your phone number to continue the challenge.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="phone_number_input" className="text-foreground">Phone Number</Label>
                            <div className="flex gap-2">
                                <select
                                    className="bg-background dark:bg-neutral-900/50 border border-border text-foreground rounded-lg h-12 px-3 w-[100px] focus:ring-2 focus:ring-emerald-500 outline-none"
                                    name="country_code"
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                >
                                    <option value="+91">🇮🇳 +91</option>
                                    <option value="+971">🇦🇪 +971</option>
                                    <option value="+966">🇸🇦 +966</option>
                                    <option value="+1">🇺🇸 +1</option>
                                    <option value="+44">🇬🇧 +44</option>
                                    <option value="+60">🇲🇾 +60</option>
                                    <option value="+65">🇸🇬 +65</option>
                                </select>
                                <Input
                                    id="phone_number_input"
                                    name="phone_number_local"
                                    type="tel"
                                    required
                                    className="bg-background dark:bg-neutral-900/50 flex-1 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12"
                                    placeholder="9876543210"
                                    value={phoneLocal}
                                    onChange={(e) => setPhoneLocal(e.target.value.replace(/\D/g, ''))}
                                    maxLength={countryCode === '+65' ? 8 : (countryCode === '+971' || countryCode === '+966' ? 9 : 10)}
                                    minLength={countryCode === '+65' ? 8 : (countryCode === '+971' || countryCode === '+966' || countryCode === '+60' ? 9 : 10)}
                                    pattern="[0-9]*"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-foreground">Password</Label>
                                <a
                                    href="https://wa.me/919526492238?text=Assalamu%20alaikum%2C%20I%20need%20to%20reset%20my%20password%20for%20the%20Mulk%20Challenge."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                                    title="Contact Admin on WhatsApp"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {state?.error && (
                            <div className="text-red-500 dark:text-red-400 text-sm bg-red-100/50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-900/50">
                                {state.error}
                            </div>
                        )}

                        <Button type="submit" disabled={isPending} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 text-base font-medium transition-colors">
                            {isPending ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 font-medium underline underline-offset-4">
                            Register here
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
