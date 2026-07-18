import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { API_URL } from '@/lib/constants'
import ShareChallenge from '@/components/ShareChallenge'
import { Users, GraduationCap } from 'lucide-react'
import { cookies } from 'next/headers'
import LeaderboardList from './LeaderboardList'
import LeaderboardFilter from './LeaderboardFilter'

export const dynamic = 'force-dynamic'

interface PageProps {
    searchParams: Promise<{ class?: string }>
}

export default async function LeaderboardPage({ searchParams }: PageProps) {
    const params = await searchParams
    const selectedClass = params.class || 'All'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let leaderboardData: { totalParticipants: number, data: any[] } | null = null
    let error = null

    const cookieStore = await cookies()
    const isLoggedIn = !!cookieStore.get('access_token')?.value

    try {
        const classQuery = selectedClass !== 'All' ? `&class=${encodeURIComponent(selectedClass)}` : ''
        const res = await fetch(`${API_URL}/game/leaderboard?page=1&limit=100${classQuery}`, { next: { revalidate: 15 } })
        if (!res.ok) throw new Error('Failed to fetch leaderboard')
        leaderboardData = await res.json()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        error = err.message
    }

    const participantCount = leaderboardData?.totalParticipants ?? 0
    const initialItems = leaderboardData?.data ?? []

    return (
        <div className="min-h-screen bg-transparent text-foreground flex flex-col items-center py-12 px-4 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-100/50 via-background to-background dark:from-emerald-900/20 dark:via-neutral-950/80 dark:to-neutral-950 -z-10" />
            
            {/* Background Madrasa Image with soft blur & overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center -z-20 opacity-[0.18] dark:opacity-[0.12] pointer-events-none filter blur-[1px]" 
                style={{ backgroundImage: `url('/village-madrasa.png')` }}
            />

            <main className="max-w-3xl w-full space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">Salafi Madrasa Attanikkal</h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">Class-wise Challenge Leaderboard</p>
                    </div>
                    {isLoggedIn ? (
                        <Button asChild variant="outline" className="w-full sm:w-auto border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 dark:hover:bg-emerald-950/30">
                            <Link href="/play">Play Challenge</Link>
                        </Button>
                    ) : (
                        <Button asChild className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl">
                            <Link href="/register">Join the Challenge</Link>
                        </Button>
                    )}
                </div>

                {/* Class Filter Dropdown */}
                <LeaderboardFilter currentClass={selectedClass} />

                {/* Participant Count Badge */}
                {participantCount > 0 && (
                    <div className="flex items-center gap-3 glass-card border-emerald-500/30 rounded-2xl px-5 py-3 w-fit animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="p-2 rounded-xl bg-emerald-500/15">
                            {selectedClass === 'All' ? (
                                <Users className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <GraduationCap className="w-4 h-4 text-emerald-500" />
                            )}
                        </div>
                        <div>
                            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{participantCount}</span>
                            <span className="text-sm font-medium text-muted-foreground ml-1.5">
                                {participantCount === 1 ? 'Student' : 'Students'} completed the {selectedClass === 'All' ? 'global' : selectedClass} challenge
                            </span>
                        </div>
                    </div>
                )}

                <Card className="glass-panel border-none animate-in slide-in-from-bottom-4 duration-500 overflow-hidden rounded-3xl">
                    <CardHeader className="border-b border-border/50 bg-muted/30">
                        <CardTitle className="text-base sm:text-lg text-foreground flex justify-between">
                            <span className="w-10 sm:w-12 text-center text-muted-foreground">Rank</span>
                            <span className="flex-1 px-2 sm:px-4">Student</span>
                            <span className="w-20 sm:w-32 text-right">Time</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {error ? (
                            <div className="p-6 text-red-500 dark:text-red-400 text-center font-medium">{error}</div>
                        ) : (
                            <LeaderboardList
                                initialData={initialItems}
                                totalParticipants={participantCount}
                                classFilter={selectedClass}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Share Section */}
                <ShareChallenge />
            </main>
        </div>
    )
}
