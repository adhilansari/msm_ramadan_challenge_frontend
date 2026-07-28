'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'

export function PWAInstallPrompt() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault()
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e)

            // Check if user dismissed it recently
            if (localStorage.getItem('pwa-prompt-dismissed') === 'true') {
                return
            }

            // Show a custom toast asking the user to install
            toast('Install Salafi Madrasa Learning Portal', {
                description: 'Add this app to your home screen for quick access and full-screen experience.',
                duration: 10000,
                position: 'bottom-center',
                action: {
                    label: 'Install',
                    onClick: async () => {
                        // The deferredPrompt must be used immediately when the user clicks
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (e as any).prompt();
                        // Wait for the user to respond to the prompt
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const { outcome } = await (e as any).userChoice;
                        if (outcome === 'accepted') {
                            setDeferredPrompt(null)
                        }
                    }
                },
                cancel: {
                    label: 'Later',
                    onClick: () => {
                        localStorage.setItem('pwa-prompt-dismissed', 'true');
                        console.log('PWA installation dismissed');
                    }
                }
            })
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        // Cleanup listener
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        }
    }, [])

    return null // This component doesn't render anything itself, just triggers toasts
}
