'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Copy, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mulkchallenge.msm.org'

const ISLAMIC_QUOTES = [
    {
        type: 'ayat',
        arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        translation: '"Blessed is He in whose hand is dominion, and He is over all things competent."',
        source: 'Surah Al-Mulk: 1',
    },
    {
        type: 'ayat',
        arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
        translation: '"Read! In the name of your Lord who created."',
        source: 'Surah Al-Alaq: 1',
    },
    {
        type: 'ayat',
        arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
        translation: '"And whoever fears Allah — He will make for him a way out."',
        source: 'Surah At-Talaq: 2',
    },
    {
        type: 'ayat',
        arabic: 'كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۗ وَإِنَّمَا تُوَفَّوْنَ أُجُورَكُمْ يَوْمَ الْقِيَامَةِ',
        translation: '"Every soul shall taste death. And your full reward will be given on the Day of Resurrection."',
        source: 'Surah Aal-Imran: 185',
    },
    {
        type: 'ayat',
        arabic: 'وَوَصَّيْنَا الْإِنسَانَ بِوَالِدَيْهِ إِحْسَانًا',
        translation: '"And We have enjoined upon man goodness to his parents."',
        source: 'Surah Al-Ahqaf: 15',
    },
    {
        type: 'hadees',
        arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
        translation: '"The best among you are those who learn the Quran and teach it to others."',
        source: 'Sahih Bukhari',
    },
    {
        type: 'hadees',
        arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
        translation: '"Seeking knowledge is an obligation upon every Muslim."',
        source: 'Sunan Ibn Majah',
    },
    {
        type: 'hadees',
        arabic: 'كُلُّ بَنِي آدَمَ خَطَّاءٌ وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ',
        translation: '"Every son of Adam makes mistakes, and the best of those who make mistakes are those who repent."',
        source: 'Sunan Ibn Majah',
    },
    {
        type: 'hadees',
        arabic: 'أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا',
        translation: '"The most complete of the believers in faith are those with the best character."',
        source: 'Sunan Abu Dawud',
    },
    {
        type: 'hadees',
        arabic: 'مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ وَيُنْسَأَ لَهُ فِي أَثَرِهِ فَلْيَصِلْ رَحِمَهُ',
        translation: '"Whoever wishes to have his provision expanded and his life prolonged should maintain ties of kinship."',
        source: 'Sahih Bukhari',
    },
    {
        type: 'hadees',
        arabic: 'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ',
        translation: '"This world is a prison for the believer and a paradise for the disbeliever."',
        source: 'Sahih Muslim',
    },
    {
        type: 'hadees',
        arabic: 'إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ',
        translation: '"Allah does not look at your forms and wealth but He looks at your hearts and deeds."',
        source: 'Sahih Muslim',
    },
]

const SHARE_ICONS = {
    whatsapp: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    ),
    instagram: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    ),
    facebook: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    twitter: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
}

export default function ShareChallenge() {
    const [quote, setQuote] = useState(ISLAMIC_QUOTES[0])
    const [canNativeShare, setCanNativeShare] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        // Pick a random quote on mount
        const idx = Math.floor(Math.random() * ISLAMIC_QUOTES.length)
        setQuote(ISLAMIC_QUOTES[idx])
        setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
    }, [])

    const buildShareText = () => {
        return `🕌 *Surah Mulk Challenge*\n\nCan you arrange the words of Surah Al-Mulk? Test your memory and earn your reward!\n\n✨ ${quote.translation}\n— ${quote.source}\n\n🎯 Join me: ${SITE_URL}`
    }

    const handleWhatsApp = () => {
        const text = encodeURIComponent(buildShareText())
        window.open(`https://wa.me/?text=${text}`, '_blank')
    }

    const handleInstagram = () => {
        const text = buildShareText()
        // Instagram doesn't support direct URL sharing via web — copy to clipboard instead
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Caption copied! Open Instagram and paste it in your story/post.', { duration: 4000 })
        })
        // Try to open Instagram app
        setTimeout(() => {
            window.open('https://www.instagram.com', '_blank')
        }, 500)
    }

    const handleFacebook = () => {
        const url = encodeURIComponent(SITE_URL)
        const quote_text = encodeURIComponent(buildShareText())
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote_text}`, '_blank')
    }

    const handleTwitter = () => {
        const text = encodeURIComponent(buildShareText())
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(buildShareText()).then(() => {
            setCopied(true)
            toast.success('Challenge link copied to clipboard!')
            setTimeout(() => setCopied(false), 2500)
        })
    }

    const handleNativeShare = async () => {
        try {
            await navigator.share({
                title: 'Surah Mulk Challenge',
                text: buildShareText(),
                url: SITE_URL,
            })
        } catch {
            handleCopy()
        }
    }

    const refreshQuote = () => {
        const idx = Math.floor(Math.random() * ISLAMIC_QUOTES.length)
        setQuote(ISLAMIC_QUOTES[idx])
    }

    return (
        <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative bg-gradient-to-br from-emerald-50 via-card to-emerald-100/60 dark:from-emerald-950/80 dark:via-neutral-900/80 dark:to-emerald-900/60 border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">

                {/* Decorative blobs */}
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 p-5 sm:p-7">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/20">
                                <Share2 className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight">Share the Challenge</h3>
                                <p className="text-xs text-emerald-600 dark:text-muted-foreground">Spread the word & earn reward</p>
                            </div>
                        </div>
                        <button
                            onClick={refreshQuote}
                            title="New quote"
                            className="text-xs text-emerald-500 hover:text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 px-3 py-1.5 rounded-full transition-all font-medium"
                        >
                            New Quote ↻
                        </button>
                    </div>

                    {/* Islamic Quote Card */}
                    <div className="bg-emerald-500/5 dark:bg-black/30 border border-emerald-500/10 dark:border-white/5 rounded-2xl p-4 sm:p-6 mb-5 space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${quote.type === 'ayat'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                {quote.type === 'ayat' ? '📖 Ayat' : '☪️ Hadees'}
                            </span>
                        </div>
                        <p
                            className="text-2xl sm:text-3xl text-right font-arabic leading-relaxed text-emerald-700 dark:text-emerald-300"
                            dir="rtl"
                        >
                            {quote.arabic}
                        </p>
                        <div className="border-l-2 border-emerald-500/40 pl-4 pt-1">
                            <p className="text-sm sm:text-base text-foreground italic leading-relaxed font-medium">
                                {quote.translation}
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-500/80 font-semibold mt-1.5 font-mono">— {quote.source}</p>
                        </div>
                    </div>

                    {/* Share Buttons */}
                    <div className="space-y-3">
                        <p className="text-xs font-semibold text-emerald-700 dark:text-muted-foreground uppercase tracking-wider">Share via</p>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {/* WhatsApp */}
                            <button
                                onClick={handleWhatsApp}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/25 text-[#25D366] text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                            >
                                {SHARE_ICONS.whatsapp}
                                <span>WhatsApp</span>
                            </button>

                            {/* Instagram */}
                            <button
                                onClick={handleInstagram}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#FCAF45]/10 hover:from-[#833AB4]/20 hover:via-[#FD1D1D]/20 hover:to-[#FCAF45]/20 border border-[#FD1D1D]/20 text-pink-400 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                            >
                                {SHARE_ICONS.instagram}
                                <span>Instagram</span>
                            </button>

                            {/* Facebook */}
                            <button
                                onClick={handleFacebook}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/25 text-[#1877F2] text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                            >
                                {SHARE_ICONS.facebook}
                                <span>Facebook</span>
                            </button>

                            {/* Twitter/X */}
                            <button
                                onClick={handleTwitter}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 text-foreground text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                            >
                                {SHARE_ICONS.twitter}
                                <span>Twitter / X</span>
                            </button>

                            {/* Native Share (mobile only) */}
                            {canNativeShare && (
                                <button
                                    onClick={handleNativeShare}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                                >
                                    <Share2 className="w-4 h-4" />
                                    <span>More</span>
                                </button>
                            )}

                            {/* Copy */}
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50 hover:bg-muted border border-border text-muted-foreground hover:text-foreground text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                            >
                                <Copy className="w-4 h-4" />
                                <span>{copied ? 'Copied! ✓' : 'Copy Link'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
