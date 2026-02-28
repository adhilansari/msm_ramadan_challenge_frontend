'use client'

import { useActionState, useState } from 'react'
import { signup, SignupActionState } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

const initialState: SignupActionState = {
    error: '',
    full_name: '',
    place: '',
    district: '',
    country_code: '+91',
    phone_number_local: ''
}

export default function RegisterPage() {
    const [countryCode, setCountryCode] = useState('+91');
    const [phoneLocal, setPhoneLocal] = useState('');
    const [fullName, setFullName] = useState('');
    const [place, setPlace] = useState('');
    const [district, setDistrict] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [state, formAction, isPending] = useActionState<SignupActionState, FormData>(async (prevState: SignupActionState | null, formData: FormData) => {
        const result = await signup(prevState, formData);
        if (result?.error) return result as SignupActionState;
        return initialState;
    }, initialState)

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-transparent text-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/50 via-background to-background dark:from-emerald-900/20 dark:via-neutral-950/80 dark:to-neutral-950 -z-10" />

            <Card className="max-w-md w-full border-border bg-card/50 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="space-y-1 flex flex-col items-center text-center">
                    <Image src="/msm-challenge-logo.png" alt="Surah Mulk Challenge" width={100} height={100} className="mb-2 drop-shadow-md rounded-2xl" />
                    <CardTitle className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">Join the Challenge</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Create an account to track your Surah Mulk memorization progress.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name" className="text-foreground">Full Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                required
                                className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12"
                                placeholder="Muhammed Ali"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone_number_input" className="text-foreground">Phone Number <span className="text-red-500">*</span></Label>
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
                                    title="Please enter only numbers"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="place" className="text-foreground">Place <span className="text-red-500">*</span></Label>
                                <Input
                                    id="place"
                                    name="place"
                                    required
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12"
                                    placeholder="Feroke"
                                    value={place}
                                    onChange={(e) => setPlace(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="district" className="text-foreground">District <span className="text-red-500">*</span></Label>
                                <Input
                                    id="district"
                                    name="district"
                                    required
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12"
                                    placeholder="Kozhikode"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                />
                            </div>
                        </div>



                        <div className="space-y-2">
                            <Label htmlFor="msm_unit" className="text-foreground">MSM Unit <span className="text-muted-foreground font-normal text-xs ml-1">(Optional)</span></Label>
                            <Input
                                id="msm_unit"
                                name="msm_unit"
                                className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12"
                                placeholder="e.g. Farook College"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">Password <span className="text-red-500">*</span></Label>
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

                        <div className="space-y-2">
                            <Label htmlFor="confirm_password" className="text-foreground">Confirm Password <span className="text-red-500">*</span></Label>
                            <Input
                                id="confirm_password"
                                name="confirm_password"
                                type="password"
                                required
                                className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {state?.error && (
                            <div className="text-red-500 dark:text-red-400 text-sm bg-red-100/50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-900/50">
                                {state.error}
                            </div>
                        )}

                        <Button type="submit" disabled={isPending} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 text-base font-medium transition-colors">
                            {isPending ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 font-medium underline underline-offset-4">
                            Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
