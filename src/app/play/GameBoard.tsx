'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Ayat, QuranWord } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

// Sortable Item Component
function SortableWord({ word }: { word: QuranWord }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: word.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`touch-none cursor-grab active:cursor-grabbing font-arabic text-4xl md:text-5xl p-4 md:p-6 rounded-xl border border-neutral-700 select-none shadow-sm transition-colors ${isDragging ? 'bg-emerald-900/50 border-emerald-500 shadow-emerald-500/20' : 'bg-neutral-800 hover:bg-neutral-700'
                }`}
            dangerouslySetInnerHTML={{ __html: word.text_uthmani_tajweed || word.text_uthmani || word.text }}
        />
    )
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
    const [words, setWords] = useState<QuranWord[]>([])

    // Timer states
    const [startTime, setStartTime] = useState<number | null>(null)
    const [elapsed, setElapsed] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [saving, setSaving] = useState(false)

    const router = useRouter()

    // Extract actual readable words from the verse (skip end markers)
    const currentAyat = ayats[currentIndex]
    const validWords = currentAyat ? currentAyat.words.filter(w => w.char_type_name === 'word') : []

    useEffect(() => {
        // Start timer on initial mount
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
        // When ayat changes, shuffle the correct words and set in state
        if (validWords.length > 0) {
            let shuffled = shuffleArray(validWords)
            // Ensure it's not the correct order by default (unless it's just 1 word)
            if (shuffled.length > 1 && shuffled.every((val, i) => val.id === validWords[i].id)) {
                shuffled = shuffleArray(validWords) // try again
            }
            setWords(shuffled)
        }
    }, [currentIndex])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            setWords((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over?.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }, [])

    const verifyOrder = async () => {
        const isCorrect = words.every((word, index) => word.id === validWords[index].id)

        if (isCorrect) {
            toast.success('Correct! Masha Allah.', { icon: '✨' })
            if (currentIndex < ayats.length - 1) {
                // Move to next ayat
                setTimeout(() => {
                    setCurrentIndex(c => c + 1)
                }, 1000)
            } else {
                // Game Finished
                setIsFinished(true)
                setSaving(true)

                const totalTimeSeconds = Math.floor((Date.now() - (startTime || Date.now())) / 1000)
                // Format as interval or logic
                const intervalString = `${totalTimeSeconds} seconds`

                // Get jwt for authentication to backend (this assumes page.tsx passes it)
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/game/session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // By default Next App dir proxy passes cookies down, but to ensure let's rely on standard fetch cookie inclusion
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
            toast.error('Incorrect ordering, keep trying!', { icon: '❌' })
        }
    }

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0')
        const s = (secs % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    if (!ayats.length) return null

    // Malayalam translation cleanup (removing HTML tags that the API sends sometimes)
    const malayalamTranslationRaw = currentAyat?.translations?.[0]?.text || ''
    const translationText = malayalamTranslationRaw.replace(/<[^>]*>?/gm, '')

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-100">
                        Ayat {currentIndex + 1} <span className="text-neutral-500 text-lg">/ {ayats.length}</span>
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">Surah Al-Mulk</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 font-mono text-xl flex items-center justify-center min-w-[100px] shadow-inner">
                    {formatTime(elapsed)}
                </div>
            </div>

            <Card className="p-6 md:p-8 border-neutral-800 bg-neutral-900/50 backdrop-blur-sm shadow-xl min-h-[350px] flex flex-col items-center justify-between space-y-8">

                <div className="flex-1 w-full flex flex-col items-center justify-center space-y-8">
                    <div className="w-full bg-neutral-950/40 border border-neutral-800/60 p-6 rounded-2xl flex items-center justify-center min-h-[100px] shadow-inner mb-4">
                        <p
                            className="font-arabic text-3xl md:text-5xl text-neutral-200 text-center leading-relaxed"
                            dir="rtl"
                            dangerouslySetInnerHTML={{
                                __html: words.map(w => w.text_uthmani_tajweed || w.text_uthmani || w.text).join(' ')
                            }}
                        />
                    </div>

                    <p className="text-neutral-400 text-center font-medium">
                        Drag the words into their correct <span className="text-emerald-400">Right-to-Left</span> order:
                    </p>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={words.map(w => w.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div
                                className="flex flex-wrap gap-4 justify-center p-4 bg-neutral-950/50 rounded-2xl border border-neutral-800/80 min-h-[140px] items-center text-right"
                                dir="rtl"
                            >
                                {words.map(word => (
                                    <SortableWord key={word.id} word={word} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

                <Button
                    size="lg"
                    onClick={verifyOrder}
                    disabled={saving}
                    className="w-full sm:w-auto min-w-[200px] h-14 text-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check Answer'}
                </Button>
            </Card>

            <div className="bg-neutral-900/40 border border-neutral-800/60 p-6 md:p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 blur-[1px] select-none pointer-events-none transition-opacity hover:opacity-20 flex">
                    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="text-xs font-bold tracking-widest text-emerald-500/80 uppercase mb-4 relative z-10">
                    Malayalam Translation
                </h3>
                <p className="text-neutral-300 leading-relaxed font-malayalam text-lg relative z-10">
                    {translationText || 'Translation loading...'}
                </p>
            </div>
        </div>
    )
}
