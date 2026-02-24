'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, Settings2, Users } from 'lucide-react'
import Link from 'next/link'

interface Config {
    id: number;
    start_ayat: number;
    end_ayat: number;
}

interface UserSession {
    total_time: string;
    completed_at: string;
}

interface Profile {
    id: string;
    full_name: string;
    phone_number: string;
    place: string;
    district: string;
    msm_unit: string;
    created_at: string;
    game_sessions: UserSession[];
}

export default function AdminDashboard() {
    const [config, setConfig] = useState<Config>({ id: 1, start_ayat: 1, end_ayat: 30 })
    const [users, setUsers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/admin/dashboard`, {
                credentials: 'include'
            })

            if (res.status === 401 || res.status === 403) {
                toast.error('Unauthorized access. Admin role required.')
                router.push('/login')
                return
            }

            if (res.ok) {
                const data = await res.json()
                setUsers(data.users)
                setConfig(data.config)
            }
        } catch (err) {
            console.error('Failed to fetch dashboard', err)
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveConfig = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/admin/config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ start_ayat: Number(config.start_ayat), end_ayat: Number(config.end_ayat) })
            })

            const data = await res.json()
            if (res.ok) {
                toast.success('Challenge configuration updated successfully!')
            } else {
                toast.error(data.message || 'Failed to update config')
            }
        } catch (err) {
            toast.error('An error occurred while saving configuration')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white pb-32"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
    }

    return (
        <div className="min-h-screen bg-transparent text-neutral-50 p-4 md:p-8 animate-in fade-in duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-900/60 via-neutral-950/80 to-neutral-950 -z-10" />

            <div className="max-w-7xl mx-auto space-y-8 mt-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-100 flex items-center gap-3">
                            <Settings2 className="w-8 h-8 text-emerald-500" />
                            Admin Dashboard
                        </h1>
                        <p className="text-neutral-400 mt-1">Manage challenge parameters and view analytics.</p>
                    </div>
                    <Button asChild variant="outline" className="border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Config Panel */}
                    <Card className="col-span-1 bg-neutral-900/50 border-neutral-800 shadow-xl backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-xl text-neutral-200">Challenge Configuration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveConfig} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="startAyat" className="text-neutral-300">Start Ayat</Label>
                                        <Input
                                            id="startAyat"
                                            type="number"
                                            min={1}
                                            max={30}
                                            value={config.start_ayat}
                                            onChange={(e) => setConfig({ ...config, start_ayat: e.target.valueAsNumber })}
                                            className="bg-neutral-950 border-neutral-800 focus-visible:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endAyat" className="text-neutral-300">End Ayat</Label>
                                        <Input
                                            id="endAyat"
                                            type="number"
                                            min={1}
                                            max={30}
                                            value={config.end_ayat}
                                            onChange={(e) => setConfig({ ...config, end_ayat: e.target.valueAsNumber })}
                                            className="bg-neutral-950 border-neutral-800 focus-visible:ring-emerald-500"
                                        />
                                    </div>
                                    <p className="text-xs text-neutral-500">
                                        Surah Al-Mulk contains 30 ayats. Choose the range for the current challenge phase.
                                    </p>
                                </div>
                                <Button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    Save Configuration
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Analytics Panel */}
                    <Card className="col-span-1 md:col-span-2 bg-neutral-900/50 border-neutral-800 shadow-xl backdrop-blur-sm h-fit">
                        <CardHeader>
                            <CardTitle className="text-xl text-neutral-200 flex items-center gap-2">
                                <Users className="w-5 h-5 text-emerald-500" />
                                Registered Users ({users.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-neutral-800 hover:bg-transparent">
                                        <TableHead className="text-neutral-400 font-medium">Name</TableHead>
                                        <TableHead className="text-neutral-400 font-medium">Phone</TableHead>
                                        <TableHead className="text-neutral-400 font-medium">Location</TableHead>
                                        <TableHead className="text-neutral-400 font-medium text-right">Attempts / Best Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => {
                                        const bestTime = user.game_sessions.length > 0
                                            ? [...user.game_sessions].sort((a, b) => parseInt(a.total_time) - parseInt(b.total_time))[0].total_time
                                            : '--:--';

                                        return (
                                            <TableRow key={user.id} className="border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                                                <TableCell className="font-medium text-neutral-200">{user.full_name}</TableCell>
                                                <TableCell className="text-neutral-400">{user.phone_number}</TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-neutral-300">{user.place}</div>
                                                    <div className="text-xs text-neutral-500">{user.msm_unit}, {user.district}</div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="text-emerald-400 font-mono font-medium">{bestTime} s</div>
                                                    <div className="text-xs text-neutral-500">{user.game_sessions.length} attempts</div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                    {users.length === 0 && (
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableCell colSpan={4} className="h-32 text-center text-neutral-500">
                                                No users registered yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
