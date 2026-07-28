'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Copy } from 'lucide-react'
import { useState } from 'react'

export default function RegisterSuccessPage() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get('id') || '----';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(studentId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-transparent text-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-100/50 via-background to-background dark:from-emerald-900/20 dark:via-neutral-950/80 dark:to-neutral-950 -z-10" />

            {/* Background Madrasa Image with soft blur & overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center -z-20 opacity-[0.18] dark:opacity-[0.12] pointer-events-none filter blur-[1px]"
                style={{ backgroundImage: `url('/village-madrasa.png')` }}
            />

            <Card className="max-w-md w-full glass-panel border-none animate-in scale-in duration-300 rounded-3xl text-center">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-900/30">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">Registration Successful!</CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">
                        Welcome to Salafi Madrasa Learning Portal
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground text-xs leading-relaxed">
                        Please save your 4-digit unique Student ID. Since siblings can share the same mobile number, you can use this ID to log in to your account.
                    </p>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 relative group transition-all hover:bg-emerald-500/15">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase block mb-1">Your Student ID</span>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-4xl font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 font-mono drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                                {studentId}
                            </span>
                            <button
                                onClick={handleCopy}
                                className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 transition-colors"
                                title="Copy Student ID"
                            >
                                {copied ? (
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Copied!</span>
                                ) : (
                                    <Copy className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-xl p-3 text-xs text-left">
                        <strong>💡 Tip:</strong> Please take a screenshot or write down this ID before continuing.
                    </div>

                    <Link href="/play" className="block w-full">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 text-base font-medium rounded-xl transition-colors">
                            Continue to Challenge
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
