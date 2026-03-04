'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center px-4">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Something went wrong!</h2>
                <p className="text-muted-foreground text-sm max-w-sm">We couldn't load the leaderboard data. This might be a temporary network issue.</p>
            </div>
            <Button
                onClick={() => reset()}
                variant="default"
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
            >
                Try again
            </Button>
        </div>
    )
}
