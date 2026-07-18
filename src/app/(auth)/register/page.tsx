'use client'

import { useActionState, useState } from 'react'
import { signup, SignupActionState } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'

const initialState: SignupActionState = {
    error: '',
    first_name: '',
    last_name: '',
    place: '',
    district: '',
    country_code: '+91',
    phone_number_local: '',
    is_msm_member: false,
    msm_unit: '',
    dob: '',
    class: 'Class 1'
}

const CLASSES = [
    "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", 
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", 
    "Class 11", "Class 12"
];

export default function RegisterPage() {
    const [countryCode, setCountryCode] = useState('+91');
    const [phoneLocal, setPhoneLocal] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [place, setPlace] = useState('');
    const [district, setDistrict] = useState('');
    const [dob, setDob] = useState('');
    const [studentClass, setStudentClass] = useState('Class 1');
    const [isMsmMember, setIsMsmMember] = useState(false);
    const [msmUnit, setMsmUnit] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [state, formAction, isPending] = useActionState<SignupActionState, FormData>(async (prevState: SignupActionState | null, formData: FormData) => {
        const result = await signup(prevState, formData);
        if (result?.error) return result as SignupActionState;
        return initialState;
    }, initialState)

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-transparent text-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/50 via-background to-background dark:from-emerald-900/20 dark:via-neutral-950/80 dark:to-neutral-950 -z-10" />
            
            {/* Background Madrasa Image with soft blur & overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center -z-20 opacity-[0.18] dark:opacity-[0.12] pointer-events-none filter blur-[1px]" 
                style={{ backgroundImage: `url('/village-madrasa.png')` }}
            />

            <Card className="max-w-md w-full glass-panel border-none animate-in slide-in-from-bottom-4 duration-500 my-8 rounded-3xl">
                <CardHeader className="space-y-1 flex flex-col items-center text-center">
                    <Image src="/msm-challenge-logo.png" alt="Salafi Madrasa Attanikkal" width={100} height={100} className="mb-2 drop-shadow-md rounded-2xl" />
                    <CardTitle className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">Madrasa Student Register</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Register for Salafi Madrasa Attanikkal Quran Challenge portal.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="text-foreground">First Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    required
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12"
                                    placeholder="Muhammed"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="text-foreground">Last Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    required
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12"
                                    placeholder="Ali"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone_number_input" className="text-foreground">Phone Number <span className="text-red-500">*</span></Label>
                            <div className="flex gap-2">
                                <select
                                    className="bg-background dark:bg-neutral-900/50 border border-border text-foreground rounded-lg h-12 px-3 w-[100px] focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
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
                                    placeholder="Athanikkal"
                                    value={place}
                                    onChange={(e) => setPlace(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="district" className="text-foreground">District <span className="text-muted-foreground font-normal text-xs ml-1">(Optional)</span></Label>
                                <Input
                                    id="district"
                                    name="district"
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12"
                                    placeholder="Malappuram"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dob" className="text-foreground">Date of Birth <span className="text-red-500">*</span></Label>
                                <Input
                                    id="dob"
                                    name="dob"
                                    type="date"
                                    required
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground rounded-lg h-12"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="class" className="text-foreground">Class <span className="text-red-500">*</span></Label>
                                <select
                                    id="class"
                                    name="class"
                                    required
                                    className="flex w-full rounded-lg border border-border bg-background dark:bg-neutral-900/50 text-foreground px-3 h-12 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                    value={studentClass}
                                    onChange={(e) => setStudentClass(e.target.value)}
                                >
                                    {CLASSES.map((cls) => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 py-2">
                            <input
                                id="is_msm_member"
                                name="is_msm_member"
                                type="checkbox"
                                className="h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500 bg-background dark:bg-neutral-900/50 accent-emerald-600 cursor-pointer"
                                checked={isMsmMember}
                                onChange={(e) => setIsMsmMember(e.target.checked)}
                            />
                            <Label htmlFor="is_msm_member" className="text-foreground text-sm font-medium cursor-pointer">
                                Is MSM Member?
                            </Label>
                        </div>

                        {isMsmMember && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Label htmlFor="msm_unit" className="text-foreground">MSM Unit <span className="text-red-500">*</span></Label>
                                <Input
                                    id="msm_unit"
                                    name="msm_unit"
                                    required={isMsmMember}
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12"
                                    placeholder="e.g. Athanikkal Unit"
                                    value={msmUnit}
                                    onChange={(e) => setMsmUnit(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">Password <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12 pr-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm_password" className="text-foreground">Confirm Password <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-12 pr-10"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
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

