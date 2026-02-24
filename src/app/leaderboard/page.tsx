
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default async function LeaderboardPage() {
    let leaderboard: any[] | null = null
    let error = null

    try {
        const res = await fetch(`${API_URL}/game/leaderboard`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch leaderboard')
        leaderboard = await res.json()
    } catch (err: any) {
        error = err.message
    }

    return (
        <div className="min-h-screen bg-transparent text-neutral-50 flex flex-col items-center py-12 px-4 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-950/80 to-neutral-950 -z-10" />

            <main className="max-w-3xl w-full space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-emerald-400">Surah Mulk Challenge</h1>
                        <p className="text-neutral-400 mt-1">Global Top 100 Leaderboard</p>
                    </div>
                    <Button asChild variant="outline" className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/30">
                        <Link href="/play">Play Again</Link>
                    </Button>
                </div>

                <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-500 overflow-hidden">
                    <CardHeader className="border-b border-neutral-800/50 bg-neutral-900/30">
                        <CardTitle className="text-lg text-neutral-200 flex justify-between">
                            <span className="w-12 text-center text-neutral-500">Rank</span>
                            <span className="flex-1">Participant</span>
                            <span className="w-32 text-right">Best Time</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {error && <div className="p-6 text-red-400 text-center">Failed to load leaderboard.</div>}

                        {!leaderboard?.length && !error && (
                            <div className="p-12 text-center text-neutral-500">
                                No entries yet. Be the first to play!
                            </div>
                        )}

                        <div className="divide-y divide-neutral-800/50">
                            {leaderboard?.map((entry, index) => (
                                <div key={entry.user_id} className="flex justify-between items-center p-4 hover:bg-neutral-800/20 transition-colors">
                                    <div className="w-12 text-center font-mono text-xl font-bold text-neutral-600">
                                        {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </div>
                                    <div className="flex-1 px-4">
                                        <div className="font-semibold text-neutral-200">{entry.full_name}</div>
                                        <div className="text-xs text-neutral-500">{entry.place}, {entry.district} ({entry.msm_unit})</div>
                                    </div>
                                    <div className="w-32 text-right font-mono text-emerald-400 font-medium">
                                        {/* Interval format roughly matches "HH:MM:SS" or "00:00:45" depending on Postgres/Supabase output */}
                                        {entry.best_time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
