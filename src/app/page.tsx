import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent text-neutral-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/30 via-neutral-950/80 to-neutral-950 -z-10" />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-800/10 rounded-full blur-[128px] pointer-events-none" />

      <main className="max-w-2xl w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Header Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/40 text-emerald-400 mb-2 border border-emerald-500/20 shadow-2xl shadow-emerald-900/20 backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /><path d="M8 7h6" /><path d="M8 11h8" /></svg>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 drop-shadow-sm">
              Surah Mulk <br className="hidden md:block" />
              <span className="text-emerald-400 bg-none">Challenge</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-400 font-medium max-w-xl mx-auto leading-relaxed">
              A premium, gamified word-ordering challenge to test and perfect your memory of Surah Al-Mulk.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 pb-8 max-w-3xl mx-auto text-sm text-neutral-400">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/50 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>
            <span className="font-medium">Timed Trials</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/50 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
            <span className="font-medium">Global Leaderboard</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/50 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
            <span className="font-medium">Accuracy Tracking</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-6 max-w-md mx-auto">
          <Button asChild size="lg" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-7 text-xl rounded-xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
            <Link href="/register">
              Begin Journey
            </Link>
          </Button>

          <div className="flex items-center justify-center gap-2 text-neutral-400 text-base">
            <span>Already have an account?</span>
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1 group">
              Log in
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="absolute bottom-6 text-center text-sm text-neutral-600 font-medium tracking-widest">
        MSM • PREMIUM ID CARD
      </footer>
    </div>
  )
}
