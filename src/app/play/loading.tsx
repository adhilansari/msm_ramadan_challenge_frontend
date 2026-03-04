export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70 font-medium animate-pulse">Loading Game Assets...</p>
        </div>
    )
}
