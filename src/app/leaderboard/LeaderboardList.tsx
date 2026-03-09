'use client'

import { useState } from 'react'
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
}

export default function LeaderboardList({ initialData, totalParticipants }: LeaderboardListProps) {
    const [items, setItems] = useState(initialData)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const hasMore = items.length < totalParticipants

    const loadMore = async () => {
        if (loading || !hasMore) return
        setLoading(true)
        setError(null)
        try {
            const nextPage = page + 1
            const res = await fetch(`${API_URL}/game/leaderboard?page=${nextPage}&limit=20`)
            if (!res.ok) throw new Error('Failed to fetch more data')
            const result = await res.json()
            setItems(prev => {
                // To prevent duplicates in case of double-fetch
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
                    No entries yet. Be the first to play!
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
                            <div className="font-semibold text-sm sm:text-base text-foreground truncate">{entry.full_name}</div>
                            <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{entry.place}, {entry.district} ({entry.msm_unit})</div>
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
