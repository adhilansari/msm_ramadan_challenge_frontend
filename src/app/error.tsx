'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary caught:', error)
  }, [error])

  const isFetchError = error.message.toLowerCase().includes('fetch') || error.message.toLowerCase().includes('network')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass-panel border-red-500/30 p-8 rounded-3xl max-w-md w-full text-center space-y-6 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mx-auto w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/20 shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isFetchError ? 'Server is waking up...' : 'Something went wrong!'}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isFetchError 
              ? 'Our free backend server might have gone to sleep due to inactivity. It usually takes about 50-60 seconds to wake up. Please wait a moment and try again.'
              : 'An unexpected error occurred while loading this page. Our team has been notified.'}
          </p>
        </div>

        {/* Display the exact error in development (optional, can be hidden) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-black/10 dark:bg-black/30 p-3 rounded-xl border border-red-500/10 text-xs text-red-500 font-mono text-left overflow-x-auto">
            {error.message}
          </div>
        )}

        <Button 
          onClick={() => reset()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 rounded-xl"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  )
}
