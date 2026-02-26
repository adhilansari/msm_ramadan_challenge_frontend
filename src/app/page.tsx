import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cookies } from 'next/headers'
import { API_URL } from '@/lib/constants'
import { Trophy, Clock, Medal } from 'lucide-react'
import MotivationCarousel from './MotivationCarousel'

// Map position to a medal color
const getMedalColor = (index: number) => {
  if (index === 0) return 'text-yellow-500 dark:text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.3)] dark:drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
  if (index === 1) return 'text-slate-400 dark:text-neutral-300 drop-shadow-[0_0_8px_rgba(148,163,184,0.3)] dark:drop-shadow-[0_0_8px_rgba(212,212,212,0.5)]'
  if (index === 2) return 'text-amber-600 dark:text-amber-700 drop-shadow-[0_0_8px_rgba(217,119,6,0.3)] dark:drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]'
  // For 4th to 7th place
  return 'text-emerald-600/50 dark:text-emerald-500/50'
}

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
          <div className="inline-flex items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 dark:from-emerald-500/20 dark:to-emerald-900/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xl shadow-emerald-900/5 dark:shadow-emerald-900/20 backdrop-blur-md hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /><path d="M8 7h6" /><path d="M8 11h8" /></svg>
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
          <div className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-700 delay-200 fill-mode-both">
            <div className="bg-muted/50 p-6 flex items-center justify-between border-b border-border">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                  <Trophy className="w-6 h-6 text-emerald-500" />
                  Live Leaderboard
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Top 7 Fastest Performers</p>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Tracker
              </div>
            </div>

            <div className="divide-y divide-border">
              {topPerformers.map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 sm:p-6 hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-8 flex justify-center text-xl font-black">
                      <span className={getMedalColor(idx)}>
                        {idx < 3 ? <Medal size={28} className="drop-shadow-sm" /> : `#${idx + 1}`}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {user.full_name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 line-clamp-1">
                        {user.msm_unit}, {user.district}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-foreground drop-shadow-sm">
                      {formatTime(user.best_time)}
                    </div>
                    <div className="text-[10px] sm:text-xs text-emerald-600 font-semibold uppercase tracking-wider flex items-center gap-1 justify-end mt-1">
                      <Clock size={12} /> Best Time
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-muted/30 border-t border-border text-center">
              <Link href="/leaderboard" className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 flex items-center justify-center gap-2 transition-colors">
                View Full Global Rank <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        )}

        {/* Islamic Quotes Section */}
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 mt-8 animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          <div className="bg-card/40 hover:bg-card/60 shadow-lg border border-border backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden group transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150" />
            <div className="flex flex-col gap-4 relative z-10">
              <div className="p-3 bg-emerald-500/10 w-fit text-emerald-600 dark:text-emerald-400 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /><path d="M8 7h6" /><path d="M8 11h8" /></svg>
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
