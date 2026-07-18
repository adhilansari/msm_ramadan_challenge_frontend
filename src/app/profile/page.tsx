import { getProfile } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export const metadata = {
    title: 'Student Profile - Salafi Madrasa Learning Portal',
    description: 'Update and edit your Salafi Madrasa student credentials and account info.',
}

export default async function ProfilePage() {
    const profile = await getProfile()

    if (!profile) {
        redirect('/login')
    }

    return (
        <div className="container max-w-2xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
            <ProfileForm initialProfile={profile} />
        </div>
    )
}
