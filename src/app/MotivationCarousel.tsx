'use client'

import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const quotes = [
    // Learning & Knowledge
    {
        text: "Read! In the name of your Lord who created.",
        arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
        source: "Surah Al-Alaq: 1",
        type: "quran",
        bgImage: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "Are those who know equal to those who do not know?",
        arabic: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ",
        source: "Surah Az-Zumar: 9",
        type: "quran",
        bgImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "My Lord, increase me in knowledge.",
        arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
        source: "Surah Taha: 114",
        type: "quran",
        bgImage: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "The best among you are those who learn the Quran and teach it.",
        arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
        source: "Sahih Bukhari 5027",
        type: "hadith",
        bgImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "Seeking knowledge is an obligation upon every Muslim.",
        arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
        source: "Sunan Ibn Majah 224",
        type: "hadith",
        bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise.",
        arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
        source: "Sahih Muslim 2699",
        type: "hadith",
        bgImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "The example of him who remembers his Lord and him who does not remember his Lord is that of the living and the dead.",
        arabic: "مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ رَبَّهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ",
        source: "Sahih Bukhari 6407",
        type: "hadith",
        bgImage: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "He who does not show mercy to others will not be shown mercy.",
        arabic: "مَنْ لا يَرْحَمُ لا يُرْحَمُ",
        source: "Sahih Bukhari 5997",
        type: "hadith",
        bgImage: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=600&q=80"
    },

    // Practice & Action
    {
        text: "O you who have believed, why do you say what you do not do? Great is hatred in the sight of Allah that you say what you do not do.",
        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا لِمَ تَقُولُونَ مَا لَا تَفْعَلُونَ",
        source: "Surah As-Saf: 2-3",
        type: "quran",
        bgImage: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "The most beloved of deeds to Allah are those that are most consistent, even if it is small.",
        arabic: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ تَعَالَى أَدْوَمُهَا وَإِنْ قَلَّ",
        source: "Sahih Muslim 782",
        type: "hadith",
        bgImage: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "Indeed, Allah loves that when one of you does a job, he perfects it.",
        arabic: "إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ",
        source: "Al-Bayhaqi 5312",
        type: "hadith",
        bgImage: "https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&w=600&q=80"
    },

    // Life, Patience & Success
    {
        text: "Indeed, with hardship [will be] ease.",
        arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        source: "Surah Ash-Sharh: 6",
        type: "quran",
        bgImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient.",
        arabic: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ",
        source: "Surah Al-Baqarah: 155",
        type: "quran",
        bgImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "Allah does not burden a soul beyond that it can bear.",
        arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
        source: "Surah Al-Baqarah: 286",
        type: "quran",
        bgImage: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "So remember Me; I will remember you.",
        arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
        source: "Surah Al-Baqarah: 152",
        type: "quran",
        bgImage: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "If you are grateful, I will surely increase you [in favor].",
        arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
        source: "Surah Ibrahim: 7",
        type: "quran",
        bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "He who has in his heart the weight of a mustard seed of pride shall not enter Paradise.",
        arabic: "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
        source: "Sahih Muslim 91",
        type: "hadith",
        bgImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "Richness does not lie in the abundance of (worldly) goods, but richness is the richness of the soul.",
        arabic: "لَيْسَ الْغِنَى عَنْ كَثْرَةِ الْعَرَضِ، وَلَكِنَّ الْغِنَى غِنَى النَّفْسِ",
        source: "Sahih Bukhari 6446",
        type: "hadith",
        bgImage: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80"
    },

    // Death & Hereafter
    {
        text: "Every soul will taste death. And We test you with evil and with good as trial; and to Us you will be returned.",
        arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۗ وَنَبْلُوكُم بِالشَّرِّ وَالْخَيْرِ فِتْنَةً ۖ وَإِلَيْنَا تُرْجَعُونَ",
        source: "Surah Al-Anbiya: 35",
        type: "quran",
        bgImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "And the worldly life is not but amusement and diversion; but the home of the Hereafter is best for those who fear Allah, so will you not reason?",
        arabic: "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا لَعِبٌ وَلَهْوٌ ۖ وَلَلدَّارُ الْآخِرَةُ خَيْرٌ لِّلَّذِينَ يَتَّقُونَ ۗ أَفَلَا تَعْقِلُونَ",
        source: "Surah Al-An'am: 32",
        type: "quran",
        bgImage: "https://images.unsplash.com/photo-1431036101490-c6af1c5344dd?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "Remember often the destroyer of pleasures (i.e. death).",
        arabic: "أَكْثِرُوا ذِكْرَ هَاذِمِ اللَّذَّاتِ",
        source: "Sunan at-Tirmidhi 2307",
        type: "hadith",
        bgImage: "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "Be in this world as if you were a stranger or a traveler along a path.",
        arabic: "كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ، أَوْ عَابِرُ سَبِيلٍ",
        source: "Sahih Bukhari 6416",
        type: "hadith",
        bgImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "When a man dies, his deeds come to an end except for three things: Sadaqah Jariyah (ceaseless charity); a knowledge which is beneficial, or a virtuous descendant who prays for him.",
        arabic: "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ",
        source: "Sahih Muslim 1631",
        type: "hadith",
        bgImage: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80"
    },
    {
        text: "Look at those who are lower than you (in wealth and status), and do not look at those who are higher than you. It is better for you, so that you do not belittle the blessings of Allah.",
        arabic: "انْظُرُوا إِلَى مَنْ هُوَ أَسْفَلَ مِنْكُمْ وَلا تَنْظُرُوا إِلَى مَنْ هُوَ فَوْقَكُمْ، فَإِنَّهُ أَجْدَرُ أَنْ لا تَزْدَرُوا نِعْمَةَ اللَّهِ",
        source: "Sahih Muslim 2963",
        type: "hadith",
        bgImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80"
    }
]

export default function MotivationCarousel() {
    const [isPaused, setIsPaused] = useState(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Duplicating the array to create a seamless infinite scroll effect
    const carouselItems = [...quotes, ...quotes]

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400 // Approximate width of one card + gap
            const currentScroll = scrollContainerRef.current.scrollLeft
            scrollContainerRef.current.scrollTo({
                left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div className="w-full mt-24 mb-16 overflow-hidden bg-transparent relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

            <div className="w-full flex items-center justify-between px-4 sm:px-12 mb-6">
                <div className="flex-1" />
                <h3 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 justify-center flex-1">
                    <span>Daily Illuminations</span>
                    <div className="h-px w-12 bg-emerald-500/30" />
                </h3>
                <div className="flex-1 flex justify-end gap-2 relative z-20">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-full bg-card/60 hover:bg-emerald-500/10 border border-border hover:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 transition-all backdrop-blur-sm"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-full bg-card/60 hover:bg-emerald-500/10 border border-border hover:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 transition-all backdrop-blur-sm"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto group py-4 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div
                    className={`flex shrink-0 gap-6 min-w-full ${isPaused ? 'animate-none' : 'animate-scroll'}`}
                    style={{ animationDuration: '80s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
                >
                    {carouselItems.map((quote, idx) => (
                        <div
                            key={idx}
                            className="w-[350px] md:w-[450px] shrink-0 border border-emerald-500/10 shadow-sm rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between snap-center relative overflow-hidden group"
                        >
                            {/* Card Background Image with overlay */}
                            <div 
                                className="absolute inset-0 bg-cover bg-center opacity-[0.06] dark:opacity-[0.04] transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url('${quote.bgImage}')` }}
                            />
                            {/* Subtle background color overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-card/90 via-card/95 to-card/98 -z-10" />

                            <div className="relative z-10">
                                <p className="text-xl font-serif text-emerald-700 dark:text-emerald-300 text-right mb-4 leading-loose" dir="rtl">
                                    {quote.arabic}
                                </p>
                                <p className="text-[15px] font-medium text-foreground/90 italic leading-relaxed">
                                    &quot;{quote.text}&quot;
                                </p>
                            </div>
                            <div className="mt-6 flex items-center justify-between border-t border-emerald-500/10 pt-4 relative z-10">
                                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-sm ${quote.type === 'quran' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                    {quote.type === 'quran' ? "The Qur'an" : 'Hadith'}
                                </span>
                                <span className="text-xs font-semibold text-muted-foreground font-mono">
                                    {quote.source}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
