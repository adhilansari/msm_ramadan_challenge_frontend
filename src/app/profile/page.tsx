import { getProfile } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'
import DashboardCards from './DashboardCards'

export const metadata = {
    title: 'Student Dashboard - Salafi Madrasa Learning Portal',
    description: 'View your progress, marks, and update your profile credentials.',
}

export default async function ProfilePage() {
    const profile = await getProfile()

    if (!profile) {
        redirect('/login')
    }

    return (
        <div className="container max-w-6xl mx-auto px-4 py-8 flex-1 flex flex-col">
            <div className="mb-6 lg:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pl-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight">
                    Welcome back, {profile.first_name}! 👋
                </h1>
                <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
                    Manage your account settings, track your madrasa progress, and prepare for upcoming challenges.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Left Column: Dashboard Interactive Cards */}
                <div className="lg:col-span-7 flex flex-col h-full order-2 lg:order-1">
                    <DashboardCards />
                </div>
                
                {/* Right Column: Profile Settings Form */}
                <div className="lg:col-span-5 order-1 lg:order-2">
                    <ProfileForm initialProfile={profile} />
                </div>
            </div>
        </div>
    )
}
