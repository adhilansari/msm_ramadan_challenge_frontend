import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cookies } from 'next/headers'
import { API_URL } from '@/lib/constants'

import MotivationCarousel from './MotivationCarousel'



function formatTime(totalSeconds: number) {
  if (!totalSeconds) return '0s';
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  const isAuthenticated = !!token

  let userRole = 'USER'
  if (isAuthenticated && token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      userRole = JSON.parse(jsonPayload).role || 'USER'
    } catch (e) { }
  }

  let topPerformers: any[] = []
  try {
    const res = await fetch(`${API_URL}/game/leaderboard/top`, {
      cache: 'no-store'
    })
    if (res.ok) {
      topPerformers = await res.json()
    }
  } catch (error) {
    console.error('Failed to fetch top performers for landing page', error)
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col items-center justify-start pt-16 pb-24 px-4 relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/50 via-background to-background dark:from-emerald-900/30 dark:via-neutral-950/80 dark:to-neutral-950 -z-10" />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none fade-in-out" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-800/10 rounded-full blur-[128px] pointer-events-none fade-in-out" />

      <main className="max-w-4xl w-full flex flex-col items-center space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Header Section */}
        <div className="text-center space-y-8 max-w-2xl">
          <div className="inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-emerald-900/5 dark:shadow-emerald-900/20 hover:scale-105 transition-transform">
            <Image src="/msm-logo.png" alt="MSM Feroke Zone" width={80} height={80} className="rounded-2xl" />
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold tracking-wide border border-emerald-500/20 mb-2 animate-in fade-in slide-in-from-bottom-2">
              ✨ MSM Feroke Presents
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400 drop-shadow-sm py-2 leading-tight">
              Surah Mulk <br className="hidden md:block" />
              <span className="text-emerald-600 dark:text-emerald-400 bg-none">Challenge</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium mx-auto leading-relaxed px-2">
              A premium, gamified word-ordering challenge to test and perfect your memory.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
            {isAuthenticated ? (
              <>
                {userRole === 'ADMIN' ? (
                  <Button asChild size="lg" className="w-full sm:w-1/2 bg-amber-600 hover:bg-amber-500 text-white font-semibold py-6 text-lg rounded-xl shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] transition-all hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.7)] hover:-translate-y-1">
                    <Link href="/admin">Admin Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="w-full sm:w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-6 text-lg rounded-xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
                    <Link href="/play">Start Challenge</Link>
                  </Button>
                )}
                <Button asChild size="lg" variant="outline" className="w-full sm:w-1/2 border-border bg-card/50 hover:bg-muted text-foreground font-semibold py-6 text-lg rounded-xl backdrop-blur-md transition-all">
                  <Link href="/leaderboard">Leaderboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-7 text-xl rounded-xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
                  <Link href="/register">Begin Journey</Link>
                </Button>
                <div className="w-full flex items-center justify-center gap-2 text-muted-foreground text-sm pt-2">
                  <span>Already have an account?</span>
                  <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1 group">
                    Log in
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Live Top 7 Leaderboard */}
        {topPerformers.length > 0 && (
          <div className="w-full max-w-2xl bg-card/50 border border-border shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-700 delay-200 fill-mode-both">
            {/* Header */}
            <div className="bg-muted/30 px-4 sm:px-6 py-4 border-b border-border/50 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">Live Leaderboard</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Top 7 Fastest Performers</p>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>
            </div>

            {/* Column headers */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-2 bg-muted/20 border-b border-border/30 text-xs font-semibold text-muted-foreground">
              <span className="w-10 sm:w-12 text-center">Rank</span>
              <span className="flex-1 px-2 sm:px-4">Participant</span>
              <span className="w-20 sm:w-28 text-right">Time</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border/50">
              {topPerformers.map((user, idx) => (
                <div key={idx} className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 hover:bg-muted/50 transition-colors">
                  <div className="w-10 sm:w-12 text-center font-mono text-lg sm:text-xl font-bold text-muted-foreground">
                    {idx === 0 ? '🏆' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </div>
                  <div className="flex-1 px-2 sm:px-4 min-w-0">
                    <div className="font-semibold text-sm sm:text-base text-foreground truncate">{user.full_name}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{user.place}, {user.district} ({user.msm_unit})</div>
                  </div>
                  <div className="w-20 sm:w-28 text-right font-mono text-sm sm:text-base text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                    {formatTime(user.best_time)}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-muted/20 border-t border-border/30 text-center">
              <Link href="/leaderboard" className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 flex items-center justify-center gap-2 transition-colors">
                View Full Leaderboard
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        )}

        {/* Islamic Quotes Section */}
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 mt-8 animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          <div className="bg-card/40 hover:bg-card/60 shadow-lg border border-border backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden group transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150" />
            <div className="flex flex-col gap-4 relative z-10">
              <div className="w-fit rounded-2xl overflow-hidden">
                <Image src="/msm-logo.png" alt="MSM Feroke Zone" width={44} height={44} className="rounded-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-3 tracking-tight">The Noble Qur'an</h3>
                <p className="text-3xl text-right font-serif leading-relaxed text-emerald-700 dark:text-emerald-400 mb-4 tracking-wide" dir="rtl">
                  اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
                </p>
                <div className="border-l-2 border-emerald-500/30 pl-4 py-1">
                  <p className="text-sm text-foreground italic leading-relaxed font-medium">
                    "Read! In the name of your Lord who created"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5 font-semibold">Surah Al-Alaq: 1</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card/40 hover:bg-card/60 shadow-lg border border-border backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden group transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150" />
            <div className="flex flex-col gap-4 relative z-10">
              <div className="p-3 bg-emerald-500/10 w-fit text-emerald-600 dark:text-emerald-400 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight">Prophetic Wisdom</h3>
                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/10">
                  <p className="text-[15px] text-foreground/90 leading-relaxed italic font-medium">
                    "The best among you are those who learn the Quran and teach it."
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-3 font-semibold flex items-center gap-1.5 font-mono">
                  <span className="w-4 h-[1px] bg-emerald-500/50"></span> Sahih Bukhari
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Carousel */}
        <MotivationCarousel />
      </main>

      {/* Footer Branding */}
      <footer className="absolute bottom-6 w-full px-4 text-center z-20">
        <div className="flex flex-col items-center justify-center gap-1">
          <a
            href="https://wa.me/919526492238?text=I%20am%20interested%20to%20join%20msm%20whatsapp%20groups"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold tracking-wide text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors bg-emerald-500/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-emerald-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            Join MSM WhatsApp Group
          </a>
          <span className="text-xs text-muted-foreground font-medium mt-1">
            Questions? Contact: +91 9526 492 238
          </span>
        </div>
      </footer>
    </div>
  )
}
