'use client'

import { useState } from 'react'
import { Trophy, BookOpen, GraduationCap, Compass, ArrowRight, Quote, Flame } from 'lucide-react'
import Image from 'next/image'
import GameBoard from './GameBoard'
import { Ayat } from '@/lib/api'

interface Participant {
    user_id: string;
    full_name: string;
    place: string;
    best_time: number;
}

interface StudentLobbyProps {
    user: {
        id: string;
        first_name: string;
        last_name: string;
        full_name: string;
        class: string;
        place: string;
    };
    challenge: {
        ayats: Ayat[];
        surahName: string;
        startAyat: number;
        endAyat: number;
    };
    leaderboard: {
        totalParticipants: number;
        data: Participant[];
    };
}

const SCHOLAR_QUOTES = [
    {
        quote: "I have not seen anything that nourishes the mind and soul, protects the body, and guarantees happiness more than constant reading of Allah's book.",
        author: "Imam Ibn Taymiyyah",
        reference: "Majmoo' al-Fatawa"
    },
    {
        quote: "The Quran is the life of the heart and the light of the chest.",
        author: "Imam Ibn Al-Qayyim",
        reference: "Miftaah Daar as-Sa'aadah"
    },
    {
        quote: "Whoever desires to know who he is, let him present himself to the Quran.",
        author: "Al-Hasan Al-Basri",
        reference: "Kitab Al-Zuhd"
    },
    {
        quote: "All human beings are dead except those who have knowledge; and all those who have knowledge are asleep except those who do good deeds.",
        author: "Imam Al-Shafi'i",
        reference: "Adab al-Shafi'i"
    }
];

function formatTime(totalSeconds: number) {
    if (!totalSeconds) return '0s';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins > 0) {
        return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
}

export default function StudentLobby({ user, challenge, leaderboard }: StudentLobbyProps) {
    const [gameStarted, setGameStarted] = useState(false)

    if (gameStarted) {
        return (
            <div className="fade-in animate-in">
                <GameBoard
                    ayats={challenge.ayats}
                    surahName={challenge.surahName}
                    startAyat={challenge.startAyat}
                    endAyat={challenge.endAyat}
                    studentClass={user.class}
                    userId={user.id}
                />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
            {/* Background Backdrop Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center -z-20 opacity-[0.06] dark:opacity-[0.03] pointer-events-none filter blur-[1px]" 
                style={{ backgroundImage: `url('/village-madrasa.png')` }}
            />

            {/* Top Welcome Header */}
            <div className="bg-card/40 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3.5 bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20 shadow-inner">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                            Assalamu Alaikum, {user.first_name || user.full_name}
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium mt-0.5">
                            Welcome back to your Salafi Madrasa learning panel.
                        </p>
                    </div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-3 bg-muted/40 px-5 py-3 rounded-2xl border border-border/60 relative z-10 w-fit">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs sm:text-sm font-bold text-foreground">
                        {user.class || "No Class Assigned"}
                    </span>
                </div>
            </div>

            {/* Main Section Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Challenge Info Card & Scholar Quotes */}
                <div className="lg:col-span-7 space-y-8">
                    
                    {/* Active Challenge Card */}
                    <div className="bg-gradient-to-br from-emerald-950/40 to-emerald-900/40 dark:from-emerald-950/60 dark:to-neutral-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[320px] group">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                        
                        <div className="space-y-4 relative z-10">
                            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/30 shadow-sm">
                                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                                Active Challenge
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                Surah {challenge.surahName}
                            </h2>
                            <p className="text-emerald-100/70 text-sm sm:text-base font-medium max-w-md">
                                Arrange the tajweed-colored Quranic word chunks in their correct sequential order to set a record time!
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs font-bold text-emerald-100 pt-2">
                                <span className="bg-emerald-800/40 px-3.5 py-2 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
                                    Verse range: {challenge.startAyat} - {challenge.endAyat}
                                </span>
                                <span className="bg-emerald-800/40 px-3.5 py-2 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
                                    Total Verses: {challenge.ayats.length}
                                </span>
                            </div>
                        </div>

                        <div className="pt-8 relative z-10">
                            <button
                                onClick={() => setGameStarted(true)}
                                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold py-5 rounded-2xl shadow-[0_0_50px_-5px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_-10px_rgba(245,158,11,0.6)] hover:-translate-y-0.5 transition-all text-base sm:text-lg flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                            >
                                Start Active Challenge Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Famous Scholars Advice Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <Compass className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-lg font-bold text-foreground tracking-tight">Spiritual Advices</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {SCHOLAR_QUOTES.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="bg-card/40 hover:bg-card/60 backdrop-blur-xl border border-border/80 rounded-3xl p-6 relative overflow-hidden group transition-all duration-300 flex items-start gap-4"
                                >
                                    <Quote className="w-6 h-6 text-emerald-500/30 flex-shrink-0 mt-1" />
                                    <div className="space-y-2">
                                        <p className="text-sm text-foreground/90 font-medium leading-relaxed italic">
                                            &quot;{item.quote}&quot;
                                        </p>
                                        <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.author}</span>
                                            {item.reference && <span className="font-mono text-[10px] text-muted-foreground/60">({item.reference})</span>}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Classmate Leaders */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            <h3 className="text-lg font-bold text-foreground tracking-tight">Class Leaders</h3>
                        </div>
                        <span className="text-xs text-muted-foreground font-semibold">
                            {user.class}
                        </span>
                    </div>

                    <div className="bg-card/40 backdrop-blur-xl border border-border/80 rounded-3xl shadow-xl overflow-hidden">
                        <div className="bg-muted/40 p-4 border-b border-border/60">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Top 10 Best Times
                            </h4>
                        </div>

                        {leaderboard.data.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                                <BookOpen className="w-8 h-8 text-muted-foreground/50" />
                                <p className="text-xs font-medium">No completions in your class yet.</p>
                                <p className="text-[10px] text-muted-foreground/60">Be the first to set a class record!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/50">
                                {leaderboard.data.map((player, idx) => (
                                    <div 
                                        key={player.user_id} 
                                        className={`flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors ${
                                            player.user_id === user.id ? 'bg-emerald-500/5' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                idx === 0 
                                                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' 
                                                    : idx === 1 
                                                    ? 'bg-slate-300/20 text-slate-600 dark:text-slate-400' 
                                                    : idx === 2 
                                                    ? 'bg-orange-300/20 text-orange-600 dark:text-orange-400' 
                                                    : 'text-muted-foreground'
                                            }`}>
                                                {idx + 1}
                                            </span>
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm text-foreground truncate flex items-center gap-1.5">
                                                    {player.full_name}
                                                    {player.user_id === user.id && (
                                                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.25 rounded-md border border-emerald-500/20">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground truncate">{player.place}</p>
                                            </div>
                                        </div>

                                        <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 shadow-inner">
                                            {formatTime(player.best_time)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
