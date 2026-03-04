export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70 font-medium animate-pulse">Loading Leaderboard...</p>
        </div>
    )
}
