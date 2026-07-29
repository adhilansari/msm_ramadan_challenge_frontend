import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cookies } from 'next/headers'
import { API_URL } from '@/lib/constants'

import MotivationCarousel from './MotivationCarousel'
import ShareChallenge from '@/components/ShareChallenge'
import FloatingShareButton from '@/components/FloatingShareButton'
import ClassWiseResults from './ClassWiseResults'

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

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col items-center justify-start pt-16 pb-24 px-4 relative overflow-x-hidden">
      {/* Background Madrasa Image with soft blur & overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center -z-20 opacity-[0.18] dark:opacity-[0.12] pointer-events-none filter blur-[1px]" 
        style={{ backgroundImage: `url('/village-madrasa.png')` }}
      />
      {/* Background Effects */}
      <main className="max-w-4xl w-full flex flex-col items-center space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Header Section */}
        <div className="text-center space-y-8 max-w-2xl">
          <div className="inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-emerald-900/5 dark:shadow-emerald-900/20 hover:scale-105 transition-transform">
            <Image src="/favicon.png" alt="Salafi Madrasa Attanikkal" width={80} height={80} className="rounded-2xl" />
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold tracking-wide border border-emerald-500/20 mb-2 animate-in fade-in slide-in-from-bottom-2">
              ✨ Salafi Madrasa Attanikkal
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400 drop-shadow-sm py-2 leading-tight">
              Quran Challenge <br className="hidden md:block" />
              <span className="text-emerald-600 dark:text-emerald-400 bg-none">Madrasa Portal</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium mx-auto leading-relaxed px-2">
              A premium word-ordering Quran challenge portal. <br />
              <span className="text-emerald-500 font-bold dark:text-emerald-400">🔥 Class-wise challenges are active</span>
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
                <Button asChild size="lg" variant="outline" className="w-full sm:w-1/2 glass-card hover:bg-muted text-foreground font-semibold py-6 text-lg rounded-xl transition-all">
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

        {/* Class Wise Results */}
        <ClassWiseResults />

        {/* Importance of Quranic Learning & Madrasa Section */}
        <div className="w-full max-w-4xl space-y-8 animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-white dark:to-neutral-400">
              Virtues of Quranic Knowledge
            </h2>
            <p className="text-muted-foreground text-sm font-medium">The high status of seeking Islamic education & memorizing the Quran</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Left Column: Natural Village Madrasa Card */}
            <div className="glass-panel rounded-3xl overflow-hidden flex flex-col group">
              <div className="relative h-64 w-full overflow-hidden">
                <Image 
                  src="/village-madrasa.png" 
                  alt="Serene Village Madrasa" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-w-720px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-emerald-500/30">
                  OUR MADRASA
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="font-bold text-white text-base leading-tight">Salafi Madrasa Attanikkal</h4>
                  <p className="text-xs text-neutral-300 mt-1">A peaceful center for spiritual growth & memorization.</p>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Attanikkal Salafi Madrasa stands as a beacon of classical Islamic education, cultivating a deep love for the Quran in young hearts. By offering structured class-wise challenges, our students learn correctly, build strong retention, and understand the correct ordering of Quranic words.
                </p>
                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/10 text-center">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    📖 &quot;Recite in the name of your Lord who created.&quot; (Surah Al-Alaq: 1)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Authenticated Sahih Hadees List */}
            <div className="space-y-4 flex flex-col justify-between">
              {/* Hadees 1 */}
              <div className="glass-card hover:bg-white/40 dark:hover:bg-neutral-900/40 rounded-3xl p-5 hover:shadow-md transition-all duration-300 relative group overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-6 -mt-6" />
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Sahih Bukhari
                  </span>
                  <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed italic">
                    &quot;The best of you is the one who learns the Qur&apos;an and teaches it.&quot;
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold font-mono text-right">— Sahih Al-Bukhari: 5027</p>
                </div>
              </div>

              {/* Hadees 2 */}
              <div className="glass-card hover:bg-white/40 dark:hover:bg-neutral-900/40 rounded-3xl p-5 hover:shadow-md transition-all duration-300 relative group overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-6 -mt-6" />
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Sahih Muslim
                  </span>
                  <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed italic">
                    &quot;Whoever takes a path seeking knowledge, Allah makes easy for him the path to Paradise.&quot;
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold font-mono text-right">— Sahih Muslim: 2699</p>
                </div>
              </div>

              {/* Hadees 3 */}
              <div className="glass-card hover:bg-white/40 dark:hover:bg-neutral-900/40 rounded-3xl p-5 hover:shadow-md transition-all duration-300 relative group overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-6 -mt-6" />
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Sunan Ibn Majah
                  </span>
                  <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed italic">
                    &quot;Seeking knowledge is an obligation upon every Muslim.&quot;
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold font-mono text-right">— Sunan Ibn Majah: 224</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Carousel */}
        <MotivationCarousel />

        {/* Share Challenge Section (logged-in non-admin users) */}
        {isAuthenticated && userRole !== 'ADMIN' && (
          <ShareChallenge />
        )}


      </main>

      <FloatingShareButton />

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
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-bold mt-1.5">
            An MSM Attanikkal Initiative
          </span>
        </div>
      </footer>
    </div>
  )
}
