'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'
import { User } from 'lucide-react'
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
                            src="/favicon.png"
                            alt="Salafi Madrasa Learning Portal Logo"
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full hover:opacity-80 transition-opacity"
                        />
                        <span className="font-bold text-lg tracking-tight text-emerald-500 hidden sm:inline-block">
                            Salafi Madrasa Learning Portal
                        </span>
                        <span className="font-bold text-lg tracking-tight text-emerald-500 sm:hidden">
                            SMLP
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {user ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link href="/profile" title="View Profile" className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group">
                                <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-xs sm:text-sm font-semibold hidden xs:inline-block">
                                    {user.full_name.split(' ')[0]}
                                </span>
                            </Link>
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
