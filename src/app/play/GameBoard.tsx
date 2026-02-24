'use client'

import { useState, useEffect, useCallback } from 'react'
import { Ayat, QuranWord } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

// Simple synthesizer for audio feedback
class AudioFeedback {
    private ctx: AudioContext | null = null;

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    playSuccess() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }

    playError() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }
}

interface WordChunk {
    id: string; // unique chunk ID
    orderIndex: number; // correct position in the sentence
    htmlText: string; // The combined arabic text with tajweed
}

function chunkWords(words: QuranWord[], chunkSize: number = 2): WordChunk[] {
    const chunks: WordChunk[] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        const chunkSlice = words.slice(i, i + chunkSize);
        // Add a space between words in the chunk
        const htmlText = chunkSlice.map(w => w.text_uthmani_tajweed || w.text_uthmani || w.text).join(' &nbsp; ');
        chunks.push({
            id: `chunk-${i}`,
            orderIndex: chunks.length,
            htmlText
        });
    }
    return chunks;
}

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
}

export default function GameBoard({ ayats, userId }: { ayats: Ayat[], userId: string }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Game State
    const [availableChunks, setAvailableChunks] = useState<WordChunk[]>([])
    const [selectedChunks, setSelectedChunks] = useState<WordChunk[]>([])

    // Timer states
    const [startTime, setStartTime] = useState<number | null>(null)
    const [elapsed, setElapsed] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [saving, setSaving] = useState(false)
    const [audio] = useState(() => typeof window !== 'undefined' ? new AudioFeedback() : null)

    const router = useRouter()

    const currentAyat = ayats[currentIndex]
    // Filter actual valid words (no end markers)
    const validWords = currentAyat ? currentAyat.words.filter(w => w.char_type_name === 'word') : []

    useEffect(() => {
        if (startTime === null && ayats.length > 0) {
            setStartTime(Date.now())
        }
    }, [startTime, ayats])

    useEffect(() => {
        if (startTime && !isFinished) {
            const interval = setInterval(() => {
                setElapsed(Math.floor((Date.now() - startTime) / 1000))
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [startTime, isFinished])

    useEffect(() => {
        if (validWords.length > 0) {
            // Group the words into chunks of 2 so the player isn't dragging tiny fragments
            const chunks = chunkWords(validWords, 2);
            let shuffled = shuffleArray(chunks);
            if (shuffled.length > 1 && shuffled.every((val, i) => val.id === chunks[i].id)) {
                shuffled = shuffleArray(chunks);
            }
            setAvailableChunks(shuffled);
            setSelectedChunks([]); // reset selections for new ayat
        }
    }, [currentIndex])

    // Initialize audio context on first user interaction to bypass browser autoplay policies
    useEffect(() => {
        const initAudio = () => audio?.init();
        window.addEventListener('click', initAudio, { once: true });
        window.addEventListener('touchstart', initAudio, { once: true });
        return () => {
            window.removeEventListener('click', initAudio);
            window.removeEventListener('touchstart', initAudio);
        };
    }, [audio]);

    const handleSelect = (chunk: WordChunk) => {
        setAvailableChunks(prev => prev.filter(c => c.id !== chunk.id));
        setSelectedChunks(prev => [...prev, chunk]);
    }

    const handleDeselect = (chunk: WordChunk) => {
        setSelectedChunks(prev => prev.filter(c => c.id !== chunk.id));
        setAvailableChunks(prev => [...prev, chunk]);
    }

    const verifyOrder = async () => {
        if (availableChunks.length > 0) {
            toast.error('Please move all words to the Answer box first!');
            return;
        }

        const isCorrect = selectedChunks.every((chunk, index) => chunk.orderIndex === index);

        if (isCorrect) {
            audio?.playSuccess();
            toast.success('Correct! Masha Allah.', { icon: '✨' });

            if (currentIndex < ayats.length - 1) {
                setTimeout(() => {
                    setCurrentIndex(c => c + 1)
                }, 1000)
            } else {
                setIsFinished(true)
                setSaving(true)

                const totalTimeSeconds = Math.floor((Date.now() - (startTime || Date.now())) / 1000)
                const intervalString = `${totalTimeSeconds} seconds`

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/game/session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ total_time: intervalString })
                })

                if (res.ok) {
                    toast.success('Challenge completed and time saved!')
                    router.push('/leaderboard')
                } else {
                    toast.error('Failed to save score. Please try again.')
                    setSaving(false)
                }
            }
        } else {
            audio?.playError();
            toast.error('Incorrect ordering, try again!', { icon: '❌' })
        }
    }

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0')
        const s = (secs % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    if (!ayats.length) return null

    const translationText = (currentAyat?.translations?.[0]?.text || '').replace(/<[^>]*>?/gm, '')

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-100">
                        Ayat {currentIndex + 1} <span className="text-neutral-500 text-lg">/ {ayats.length}</span>
                    </h2>
                    <p className="text-neutral-400 text-xs md:text-sm mt-1">Surah Al-Mulk</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 font-mono text-lg md:text-xl flex items-center justify-center min-w-[80px] md:min-w-[100px] shadow-inner">
                    {formatTime(elapsed)}
                </div>
            </div>

            <Card className="p-4 md:p-8 border-neutral-800 bg-neutral-900/50 backdrop-blur-sm shadow-xl min-h-[350px] flex flex-col items-center justify-between space-y-6 md:space-y-8">

                <div className="w-full space-y-4">
                    <p className="text-neutral-400 text-center font-medium text-sm md:text-base">
                        Your Answer (Tap a word to remove):
                    </p>

                    {/* Selected Box */}
                    <div
                        className="flex flex-wrap gap-2 md:gap-4 justify-center p-4 bg-neutral-950/80 border border-neutral-800/80 rounded-2xl min-h-[120px] items-center text-right shadow-inner transition-all"
                        dir="rtl"
                    >
                        {selectedChunks.length === 0 ? (
                            <span className="text-neutral-600 italic text-sm md:text-base">Tap the words below to move them here...</span>
                        ) : (
                            selectedChunks.map(chunk => (
                                <div
                                    key={`selected-${chunk.id}`}
                                    onClick={() => handleDeselect(chunk)}
                                    className="cursor-pointer font-arabic text-3xl md:text-4xl lg:text-5xl p-3 md:p-5 rounded-2xl border border-emerald-500/50 bg-emerald-900/30 text-emerald-100 shadow-sm transition-all hover:bg-red-900/40 hover:border-red-500/50 hover:text-red-200"
                                    dangerouslySetInnerHTML={{ __html: chunk.htmlText }}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div className="w-full space-y-4">
                    <p className="text-neutral-400 text-center font-medium text-sm md:text-base">
                        Available Words (Tap to select):
                    </p>

                    {/* Available Pool */}
                    <div
                        className="flex flex-wrap gap-2 md:gap-4 justify-center p-4 min-h-[140px] items-center text-right"
                        dir="rtl"
                    >
                        {availableChunks.map(chunk => (
                            <div
                                key={`available-${chunk.id}`}
                                onClick={() => handleSelect(chunk)}
                                className="cursor-pointer font-arabic text-3xl md:text-4xl lg:text-5xl p-3 md:p-5 rounded-2xl border border-neutral-700 bg-neutral-800 text-neutral-200 shadow-lg transition-all hover:scale-105 hover:bg-neutral-700 hover:border-neutral-500 active:scale-95"
                                dangerouslySetInnerHTML={{ __html: chunk.htmlText }}
                            />
                        ))}
                    </div>
                </div>

                <Button
                    size="lg"
                    onClick={verifyOrder}
                    disabled={saving || availableChunks.length > 0}
                    className="w-full sm:w-auto min-w-[200px] h-12 md:h-14 text-base md:text-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check Answer'}
                </Button>
            </Card>

            <div className="bg-neutral-900/40 border border-neutral-800/60 p-4 md:p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 blur-[1px] select-none pointer-events-none transition-opacity hover:opacity-20 flex">
                    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="text-xs font-bold tracking-widest text-emerald-500/80 uppercase mb-3 md:mb-4 relative z-10">
                    Malayalam Translation
                </h3>
                <p className="text-neutral-300 leading-relaxed font-malayalam text-base md:text-lg relative z-10">
                    {translationText || 'Translation loading...'}
                </p>
            </div>
        </div>
    )
}
