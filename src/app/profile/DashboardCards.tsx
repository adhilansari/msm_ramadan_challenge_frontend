'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, FileText, CalendarCheck, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

export default function DashboardCards() {
    const handleComingSoon = (feature: string) => {
        toast.info(`${feature} Feature Coming Soon!`, {
            description: "We are currently building this feature. Stay tuned!",
            icon: "🚀"
        });
    }

    const cards = [
        {
            title: "Exam Marks",
            description: "View your recent exam results and progress.",
            icon: <GraduationCap className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
            color: "bg-blue-500/10 border-blue-500/20",
            hover: "hover:bg-blue-500/15 hover:border-blue-500/30",
            action: () => handleComingSoon("Exam Marks")
        },
        {
            title: "Assignments",
            description: "Check your pending and completed assignments.",
            icon: <FileText className="w-8 h-8 text-amber-500 dark:text-amber-400" />,
            color: "bg-amber-500/10 border-amber-500/20",
            hover: "hover:bg-amber-500/15 hover:border-amber-500/30",
            action: () => handleComingSoon("Assignments")
        },
        {
            title: "Attendance",
            description: "Track your madrasa attendance record.",
            icon: <CalendarCheck className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />,
            color: "bg-emerald-500/10 border-emerald-500/20",
            hover: "hover:bg-emerald-500/15 hover:border-emerald-500/30",
            action: () => handleComingSoon("Attendance")
        },
        {
            title: "Hifz Tracker",
            description: "Monitor your Quran memorization journey.",
            icon: <BookOpen className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
            color: "bg-purple-500/10 border-purple-500/20",
            hover: "hover:bg-purple-500/15 hover:border-purple-500/30",
            action: () => handleComingSoon("Hifz Tracker")
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {cards.map((card, i) => (
                <Card 
                    key={i} 
                    className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${card.color} ${card.hover} backdrop-blur-md shadow-lg border animate-in zoom-in-95`}
                    style={{ animationDelay: `${i * 100}ms` }}
                    onClick={card.action}
                >
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold text-foreground">{card.title}</CardTitle>
                            <div className="p-2 bg-background/50 rounded-full shadow-inner">
                                {card.icon}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm text-foreground/80">
                            {card.description}
                        </CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
