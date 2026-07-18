'use client'

import { useState, useEffect } from 'react'
import { Trophy, Medal, GraduationCap, Loader2, Sparkles } from 'lucide-react'
import { API_URL } from '@/lib/constants'

const CLASSES = [
    "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", 
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", 
    "Class 11", "Class 12"
];

function formatTime(totalSeconds: number) {
    if (!totalSeconds) return '0s';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins > 0) {
        return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
}

export default function ClassWiseResults() {
    const [selectedClass, setSelectedClass] = useState("Class 10")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [performers, setPerformers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchClassPerformers = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch(`${API_URL}/game/leaderboard/top?class=${encodeURIComponent(selectedClass)}`)
                if (!res.ok) throw new Error('Failed to fetch class records')
                const data = await res.json()
                // Take top 3
                setPerformers(data.slice(0, 3))
            } catch (err: any) {
                console.error(err)
                setError(err.message || 'Error loading records')
            } finally {
                setLoading(false)
            }
        }

        fetchClassPerformers()
    }, [selectedClass])

    return (
        <div className="w-full max-w-4xl space-y-8 animate-in slide-in-from-bottom-10 duration-700">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    Class Standings
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 dark:from-white dark:to-neutral-400">
                    Top Performers by Class
                </h2>
                <p className="text-muted-foreground font-medium">Select a class below to view the current leaders.</p>
            </div>

            {/* Class Selector Pills */}
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto p-2 bg-muted/20 border border-border/50 rounded-3xl backdrop-blur-md">
                {CLASSES.map((cls) => (
                    <button
                        key={cls}
                        onClick={() => setSelectedClass(cls)}
                        className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                            selectedClass === cls
                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                    >
                        {cls}
                    </button>
                ))}
            </div>

            {/* Results Display */}
            <div className="max-w-xl mx-auto relative min-h-[220px]">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            <p className="text-xs text-muted-foreground font-medium">Loading {selectedClass} records...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500 dark:text-red-400 font-medium">
                        {error}
                    </div>
                ) : performers.length === 0 ? (
                    <div className="p-8 text-center bg-card/40 border border-dashed border-border rounded-3xl backdrop-blur-md">
                        <GraduationCap className="w-10 h-10 text-muted-foreground/60 mx-auto mb-3" />
                        <h4 className="font-bold text-foreground">No Records Yet</h4>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                            Be the first to complete the challenge for <span className="text-emerald-500 font-bold">{selectedClass}</span> and establish a record!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                        {performers.map((champ, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center gap-4 bg-card/60 backdrop-blur-md border p-4 rounded-3xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group ${
                                    idx === 0 
                                        ? "border-amber-500/30 dark:border-amber-500/20" 
                                        : idx === 1 
                                        ? "border-slate-300/30 dark:border-slate-500/20" 
                                        : "border-orange-500/30 dark:border-orange-500/20"
                                }`}
                            >
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner border-2 ${
                                    idx === 0 
                                        ? 'bg-gradient-to-br from-yellow-200 to-amber-500 border-amber-300' 
                                        : idx === 1 
                                        ? 'bg-gradient-to-br from-slate-200 to-slate-400 border-slate-300' 
                                        : 'bg-gradient-to-br from-orange-200 to-orange-500 border-orange-300'
                                }`}>
                                    {idx === 0 ? '🏆' : idx === 1 ? '🥈' : '🥉'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-foreground text-sm sm:text-base truncate group-hover:text-emerald-500 transition-colors">
                                        {champ.full_name}
                                    </h4>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {champ.place} {champ.msm_unit ? `(${champ.msm_unit})` : ''}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 shadow-inner">
                                        {formatTime(champ.best_time)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
