'use client'

import { useState } from 'react'
import { Share2, X } from 'lucide-react'
import ShareChallenge from './ShareChallenge'

export default function FloatingShareButton() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-xl hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.7)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center"
                aria-label="Share Challenge"
            >
                <Share2 className="w-6 h-6" />
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute -top-12 right-0 sm:-right-4 sm:-top-4 p-2 bg-background border border-border rounded-full shadow-lg hover:bg-muted text-foreground transition-colors z-20"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Interactive Share Component */}
                        <ShareChallenge />
                    </div>
                </div>
            )}
        </>
    )
}
