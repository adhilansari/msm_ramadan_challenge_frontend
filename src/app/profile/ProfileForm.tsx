'use client'

import { useActionState, useState } from 'react'
import { updateProfile } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, User, MapPin, Calendar, BookOpen, Shield, Phone, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'

const CLASSES = [
    "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
    "Class 11", "Class 12"
];

interface ProfileFormProps {
    initialProfile: {
        student_id: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        place: string;
        district?: string | null;
        msm_unit?: string | null;
        is_msm_member: boolean;
        dob?: string | null;
        class: string;
    };
}

const parsePhoneNumber = (phone: string) => {
    let clean = phone.replace(/\D/g, ''); // only digits

    // Check Indian code: starts with 91
    if (clean.length === 12 && clean.startsWith('91')) {
        return { country: '+91', local: clean.slice(2) };
    }
    // UAE: starts with 971
    if (clean.length === 12 && clean.startsWith('971')) {
        return { country: '+971', local: clean.slice(3) };
    }
    // Saudi: starts with 966
    if (clean.length === 12 && clean.startsWith('966')) {
        return { country: '+966', local: clean.slice(3) };
    }

    // Fallback: try to see if it starts with any known code
    for (const code of ['91', '971', '966', '1', '44', '60', '65']) {
        if (clean.startsWith(code) && clean.length > code.length) {
            return { country: `+${code}`, local: clean.slice(code.length) };
        }
    }

    return { country: '+91', local: clean };
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
    const parsedPhone = parsePhoneNumber(initialProfile.phone_number);

    const [countryCode, setCountryCode] = useState(parsedPhone.country);
    const [phoneLocal, setPhoneLocal] = useState(parsedPhone.local);
    const [firstName, setFirstName] = useState(initialProfile.first_name);
    const [lastName, setLastName] = useState(initialProfile.last_name);
    const [place, setPlace] = useState(initialProfile.place);
    const [district, setDistrict] = useState(initialProfile.district || '');
    const [dob, setDob] = useState(initialProfile.dob ? new Date(initialProfile.dob).toISOString().split('T')[0] : '');
    const [studentClass, setStudentClass] = useState(initialProfile.class);
    const [isMsmMember, setIsMsmMember] = useState(initialProfile.is_msm_member);
    const [msmUnit, setMsmUnit] = useState(initialProfile.msm_unit || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [state, formAction, isPending] = useActionState<any, FormData>(async (prevState: any, formData: FormData) => {
        const result = await updateProfile(prevState, formData);
        if (result?.success) {
            // Keep passwords empty after save
            setPassword('');
            setConfirmPassword('');
        }
        return result;
    }, null);

    return (
        <div className="w-full relative py-4 sm:py-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/50 via-background to-background dark:from-emerald-900/20 dark:via-neutral-950/80 dark:to-neutral-950 -z-10 rounded-2xl sm:rounded-3xl" />

            {/* Background Madrasa Image overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center -z-20 opacity-[0.18] dark:opacity-[0.12] pointer-events-none filter blur-[1px] rounded-2xl sm:rounded-3xl"
                style={{ backgroundImage: `url('/village-madrasa.png')` }}
            />

            <div className="mb-4 px-1">
                <Link href="/play" className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to
                </Link>
            </div>

            <Card className="w-full bg-card/40 dark:bg-card/25 backdrop-blur-md border border-border/20 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden animate-in fade-in duration-300">
                <CardHeader className="space-y-1 flex flex-col items-center text-center pb-4 border-b border-border/20 px-4 sm:px-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-500/15 flex items-center justify-center border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mb-2 shadow-inner">
                        <User className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">Update Profile</CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                        Update your Salafi Madrasa student credentials and account info.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 px-4 sm:px-6">
                    {state?.error && (
                        <div className="mb-5 p-3 sm:p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-center gap-3 animate-in shake duration-300">
                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span>{state.error}</span>
                        </div>
                    )}

                    {state?.success && (
                        <div className="mb-5 p-3 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm flex items-center gap-3 animate-in zoom-in-95 duration-200">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span>{state.success}</span>
                        </div>
                    )}

                    <form action={formAction} className="space-y-4 sm:space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label className="text-xs sm:text-sm text-foreground flex items-center gap-1.5 font-semibold">
                                    <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    Student ID (Unique)
                                </Label>
                                <Input
                                    readOnly
                                    disabled
                                    className="bg-emerald-500/5 dark:bg-emerald-950/15 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg h-11 sm:h-12 text-sm font-mono font-bold tracking-widest cursor-not-allowed shadow-[0_0_8px_rgba(16,185,129,0.05)]"
                                    value={initialProfile.student_id}
                                />
                                <span className="text-[10px] sm:text-xs text-muted-foreground block mt-1">
                                    This is your unique 4-digit ID. You can use it to log in instead of your phone number.
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="first_name" className="text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                                    First Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    required
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-11 sm:h-12 text-sm"
                                    placeholder="Muhammed"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="last_name" className="text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                                    Last Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    required
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-11 sm:h-12 text-sm"
                                    placeholder="Ali"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phone_number_input" className="text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                Phone Number <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex gap-2">
                                <select
                                    className="bg-background dark:bg-neutral-900/50 border border-border text-foreground rounded-lg h-11 sm:h-12 px-2.5 w-[85px] sm:w-[100px] focus:ring-2 focus:ring-emerald-500 outline-none text-xs sm:text-sm"
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
                                    className="bg-background dark:bg-neutral-900/50 flex-1 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-11 sm:h-12 text-sm"
                                    placeholder="9876543210"
                                    value={phoneLocal}
                                    onChange={(e) => setPhoneLocal(e.target.value.replace(/\D/g, ''))}
                                    maxLength={countryCode === '+65' ? 8 : (countryCode === '+971' || countryCode === '+966' ? 9 : 10)}
                                    minLength={countryCode === '+65' ? 8 : (countryCode === '+971' || countryCode === '+966' || countryCode === '+60' ? 9 : 10)}
                                    pattern="[0-9]*"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="place" className="text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                    Place <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="place"
                                    name="place"
                                    required
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-11 sm:h-12 text-sm"
                                    placeholder="Athanikkal"
                                    value={place}
                                    onChange={(e) => setPlace(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="district" className="text-xs sm:text-sm text-foreground">District <span className="text-muted-foreground font-normal text-xs ml-1">(Optional)</span></Label>
                                <Input
                                    id="district"
                                    name="district"
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-11 sm:h-12 text-sm"
                                    placeholder="Malappuram"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="dob" className="text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                    Date of Birth <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="dob"
                                    name="dob"
                                    type="date"
                                    required
                                    className="bg-background dark:bg-neutral-900/50 border-border text-foreground rounded-lg h-11 sm:h-12 text-sm"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="class" className="text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                                    Class <span className="text-red-500">*</span>
                                </Label>
                                <select
                                    id="class"
                                    name="class"
                                    required
                                    className="flex w-full rounded-lg border border-border bg-background dark:bg-neutral-900/50 text-foreground px-3 h-11 sm:h-12 focus:ring-2 focus:ring-emerald-500 outline-none text-xs sm:text-sm"
                                    value={studentClass}
                                    onChange={(e) => setStudentClass(e.target.value)}
                                >
                                    {CLASSES.map((cls) => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="p-3 sm:p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_msm_member"
                                    name="is_msm_member"
                                    className="w-4 h-4 text-emerald-600 border-border rounded focus:ring-emerald-500 cursor-pointer"
                                    checked={isMsmMember}
                                    onChange={(e) => setIsMsmMember(e.target.checked)}
                                />
                                <Label htmlFor="is_msm_member" className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    Are you an MSM Member?
                                </Label>
                            </div>

                            {isMsmMember && (
                                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                                    <Label htmlFor="msm_unit" className="text-[11px] sm:text-xs font-semibold text-foreground">MSM Unit Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="msm_unit"
                                        name="msm_unit"
                                        required={isMsmMember}
                                        className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-10 text-xs sm:text-sm"
                                        placeholder="Athanikkal Unit"
                                        value={msmUnit}
                                        onChange={(e) => setMsmUnit(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="border-t border-border/20 pt-4 space-y-3 sm:space-y-4">
                            <h4 className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                Change Password <span className="text-[10px] sm:text-xs font-normal text-muted-foreground">(optional)</span>
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-xs sm:text-sm text-foreground">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-11 sm:h-12 text-sm pr-10"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="confirm_password" className="text-xs sm:text-sm text-foreground">Confirm New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirm_password"
                                            name="confirm_password"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className="bg-background dark:bg-neutral-900/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg h-11 sm:h-12 text-sm pr-10"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required={!!password}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg h-11 sm:h-12 text-sm sm:text-base font-bold tracking-wide shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 transition-all mt-4"
                        >
                            {isPending ? 'Updating...' : 'Update Profile'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
