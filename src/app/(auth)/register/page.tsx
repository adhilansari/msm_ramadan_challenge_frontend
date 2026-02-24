'use client'

import { useActionState } from 'react'
import { signup } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const initialState = { error: '' }

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const error = await signup(prevState, formData);
        if (error?.error) return error;
        return initialState;
    }, initialState)

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-transparent text-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/50 via-background to-background dark:from-emerald-900/20 dark:via-neutral-950/80 dark:to-neutral-950 -z-10" />

            <Card className="max-w-md w-full border-border bg-card/50 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">Join the Challenge</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Create an account to track your Surah Mulk memorization progress.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name" className="text-foreground">Full Name</Label>
                            <Input id="full_name" name="full_name" required className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12" placeholder="Muhammed Ali" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone_number_input" className="text-foreground">Phone Number</Label>
                            <div className="flex gap-2">
                                <select
                                    className="bg-background dark:bg-neutral-900/50 border border-border text-foreground rounded-lg h-12 px-3 w-[100px] focus:ring-2 focus:ring-emerald-500 outline-none"
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
                                <Input id="phone_number_input" name="phone_number_local" type="tel" required className="bg-background dark:bg-neutral-900/50 flex-1 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12" placeholder="9876543210" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="place" className="text-foreground">Place</Label>
                                <Input id="place" name="place" required className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12" placeholder="Feroke" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="district" className="text-foreground">District</Label>
                                <Input id="district" name="district" required className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12" placeholder="Kozhikode" />
                            </div>
                        </div>



                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">Password</Label>
                            <Input id="password" name="password" type="password" required className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12" placeholder="••••••••" />
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
