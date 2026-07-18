'use client'

import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'

const CLASSES = [
    "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", 
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", 
    "Class 11", "Class 12"
];

interface LeaderboardFilterProps {
    currentClass: string;
}

export default function LeaderboardFilter({ currentClass }: LeaderboardFilterProps) {
    const router = useRouter()

    const handleClassChange = (val: string) => {
        if (val === 'All') {
            router.push('/leaderboard')
        } else {
            router.push(`/leaderboard?class=${encodeURIComponent(val)}`)
        }
    }

    return (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-card/40 border border-border p-4 rounded-2xl backdrop-blur-md shadow-sm">
            <div className="flex-1">
                <Label htmlFor="leaderboardClassSelect" className="text-sm font-semibold text-foreground">Select Madrasa Class</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Filter the leaderboard to view rankings by class.</p>
            </div>
            <select
                id="leaderboardClassSelect"
                value={currentClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full sm:w-48 rounded-xl border border-border bg-background text-foreground px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
                <option value="All">All Classes (Global)</option>
                {CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                ))}
            </select>
        </div>
    )
}
