'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'
import { signout } from '@/app/actions/auth'

interface NavbarProps {
    user?: {
        id: string;
        full_name: string;
        role?: string;
    } | null;
}

export default function Navbar({ user }: NavbarProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/msm-challenge-logo.png"
                            alt="MSM Sura Al-Mulk Challenge Logo"
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full hover:opacity-80 transition-opacity"
                        />
                        <span className="font-bold text-lg tracking-tight text-emerald-500 hidden sm:inline-block">
                            Surah Mulk Challenge
                        </span>
                        <span className="font-bold text-lg tracking-tight text-emerald-500 sm:hidden">
                            SMC
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {user ? (
                        <div className="flex items-center gap-3 sm:gap-4">
                            <span className="text-sm text-muted-foreground font-medium hidden xs:inline-block">
                                {user.full_name}
                            </span>
                            {user.role === 'ADMIN' && (
                                <Link href="/admin">
                                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-emerald-500/50 text-emerald-600 dark:text-emerald-400">
                                        Admin
                                    </Button>
                                </Link>
                            )}
                            <form action={() => signout()}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    type="submit"
                                    className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                                >
                                    Log Out
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-500 text-white">
                                    Register
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
