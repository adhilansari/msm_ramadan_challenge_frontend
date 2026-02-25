
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { API_URL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

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
        <div className="min-h-screen bg-transparent text-foreground flex flex-col items-center py-12 px-4 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-100/50 via-background to-background dark:from-emerald-900/20 dark:via-neutral-950/80 dark:to-neutral-950 -z-10" />

            <main className="max-w-3xl w-full space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">Surah Mulk Challenge</h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">Global Top 100 Leaderboard</p>
                    </div>
                    <Button asChild variant="outline" className="w-full sm:w-auto border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 dark:hover:bg-emerald-950/30">
                        <Link href="/play">Play Again</Link>
                    </Button>
                </div>

                <Card className="border-border bg-card/50 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-500 overflow-hidden shadow-xl">
                    <CardHeader className="border-b border-border/50 bg-muted/30">
                        <CardTitle className="text-base sm:text-lg text-foreground flex justify-between">
                            <span className="w-10 sm:w-12 text-center text-muted-foreground">Rank</span>
                            <span className="flex-1 px-2 sm:px-4">Participant</span>
                            <span className="w-20 sm:w-32 text-right">Time</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {error && <div className="p-6 text-red-500 dark:text-red-400 text-center font-medium">{error}</div>}

                        {!leaderboard?.length && !error && (
                            <div className="p-12 text-center text-muted-foreground">
                                No entries yet. Be the first to play!
                            </div>
                        )}

                        <div className="divide-y divide-border/50">
                            {leaderboard?.map((entry, index) => (
                                <div key={entry.user_id} className="flex justify-between items-center p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                                    <div className="w-10 sm:w-12 text-center font-mono text-lg sm:text-xl font-bold text-muted-foreground">
                                        {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </div>
                                    <div className="flex-1 px-2 sm:px-4 min-w-0">
                                        <div className="font-semibold text-sm sm:text-base text-foreground truncate">{entry.full_name}</div>
                                        <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{entry.place}, {entry.district} ({entry.msm_unit})</div>
                                    </div>
                                    <div className="w-20 sm:w-32 text-right font-mono text-sm sm:text-base text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                                        {entry.best_time}s
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
