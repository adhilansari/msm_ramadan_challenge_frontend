'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { API_URL } from '@/lib/constants'
import { Loader2 } from 'lucide-react'

function formatTime(totalSeconds: number) {
    if (!totalSeconds) return '0s';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins > 0) {
        return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
}

interface LeaderboardListProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData: any[];
    totalParticipants: number;
    classFilter: string;
}

export default function LeaderboardList({ initialData, totalParticipants, classFilter }: LeaderboardListProps) {
    const [items, setItems] = useState(initialData)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Sync state if initialData changes from parent filtering
    useEffect(() => {
        setItems(initialData)
        setPage(1)
        setError(null)
    }, [initialData])

    const hasMore = items.length < totalParticipants

    const loadMore = async () => {
        if (loading || !hasMore) return
        setLoading(true)
        setError(null)
        try {
            const nextPage = page + 1
            const classQuery = classFilter !== 'All' ? `&class=${encodeURIComponent(classFilter)}` : '';
            const res = await fetch(`${API_URL}/game/leaderboard?page=${nextPage}&limit=20${classQuery}`)
            if (!res.ok) throw new Error('Failed to fetch more data')
            const result = await res.json()
            setItems(prev => {
                const existingIds = new Set(prev.map(i => i.user_id))
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newItems = result.data.filter((i: any) => !existingIds.has(i.user_id))
                return [...prev, ...newItems]
            })
            setPage(nextPage)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Failed to load more')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            {error && <div className="p-4 text-red-500 dark:text-red-400 text-center font-medium text-sm">{error}</div>}

            {!items.length && !error && (
                <div className="p-12 text-center text-muted-foreground">
                    No entries yet for this category.
                </div>
            )}

            <div className="divide-y divide-border/50">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {items.map((entry: any, index: number) => (
                    <div key={`${entry.user_id}-${index}`} className="flex justify-between items-center p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                        <div className="w-10 sm:w-12 text-center font-mono text-lg sm:text-xl font-bold text-muted-foreground">
                            {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div className="flex-1 px-2 sm:px-4 min-w-0">
                            <div className="font-semibold text-sm sm:text-base text-foreground truncate">
                                {entry.full_name || `${entry.first_name || ''} ${entry.last_name || ''}`.trim()}
                            </div>
                            <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 items-center">
                                <span className="font-medium">{entry.place}</span>
                                {entry.class && (
                                    <>
                                        <span className="text-emerald-500/30 font-bold">•</span>
                                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase">
                                            {entry.class}
                                        </span>
                                    </>
                                )}
                                {entry.is_msm_member && (
                                    <>
                                        <span className="text-emerald-500/30 font-bold">•</span>
                                        <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase">
                                            MSM
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="w-20 sm:w-32 text-right font-mono text-sm sm:text-base text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                            {formatTime(entry.best_time)}
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="p-4 flex justify-center border-t border-border/50">
                    <Button
                        variant="ghost"
                        onClick={loadMore}
                        disabled={loading}
                        className="w-full sm:w-auto text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                    >
                        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading...</> : 'Load More'}
                    </Button>
                </div>
            )}
        </div>
    )
}

