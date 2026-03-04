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
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center px-4">
            <div className="space-y-3">
                <h2 className="text-3xl font-black tracking-tight text-foreground">Oops!</h2>
                <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed">
                    The game session encountered an unexpected issue. Please try restarting the round.
                </p>
            </div>
            <Button
                onClick={() => reset()}
                variant="default"
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full max-w-[200px]"
            >
                Restart Game
            </Button>
        </div>
    )
}
