'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { fetchAdminDashboard, updateAdminConfig, resetAdminUserPassword } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, Settings2, Users, Download, Trophy, Target, Clock, KeyRound } from 'lucide-react'
import Link from 'next/link'
import ShareChallenge from '@/components/ShareChallenge'

interface ClassChallenge {
    class_name: string;
    surah_number: number;
    start_ayat: number;
    end_ayat: number;
}

interface UserSession {
    total_time: string;
    completed_at: string;
}

interface Profile {
    id: string;
    first_name?: string;
    last_name?: string;
    full_name: string;
    phone_number: string;
    place: string;
    district: string;
    is_msm_member: boolean;
    msm_unit: string;
    dob?: string;
    class?: string;
    created_at: string;
    game_sessions: UserSession[];
}

interface KPIs {
    totalUsers: number;
    totalSessions: number;
    bestPerformer: string;
    bestTime: string;
}

const CLASSES = [
    "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", 
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", 
    "Class 11", "Class 12"
];

export default function AdminDashboard() {
    const formatTime = (totalSeconds: string | number) => {
        const secsInt = typeof totalSeconds === 'string' ? parseInt(totalSeconds) : totalSeconds;
        if (isNaN(secsInt)) return '--';
        const mins = Math.floor(secsInt / 60);
        const secs = secsInt % 60;
        if (mins > 0) return `${mins}m ${secs}s`;
        return `${secs}s`;
    };

    const [classConfigs, setClassConfigs] = useState<ClassChallenge[]>([])
    const [selectedClass, setSelectedClass] = useState('Class 1')
    const [surahNum, setSurahNum] = useState(67)
    const [startAyat, setStartAyat] = useState(1)
    const [endAyat, setEndAyat] = useState(30)

    const [users, setUsers] = useState<Profile[]>([])
    const [classFilter, setClassFilter] = useState('All')
    const [kpis, setKpis] = useState<KPIs | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [resettingUserId, setResettingUserId] = useState<string | null>(null)
    const [newPassword, setNewPassword] = useState('')
    const [isResetting, setIsResetting] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchDashboardData()
    }, [])

    useEffect(() => {
        const active = classConfigs.find(c => c.class_name === selectedClass);
        if (active) {
            setSurahNum(active.surah_number || 67);
            setStartAyat(active.start_ayat || 1);
            setEndAyat(active.end_ayat || 30);
        } else {
            setSurahNum(67);
            setStartAyat(1);
            setEndAyat(30);
        }
    }, [selectedClass, classConfigs]);

    const fetchDashboardData = async () => {
        try {
            const { data, error } = await fetchAdminDashboard()

            if (error === 'Unauthorized') {
                toast.error('Unauthorized access. Admin role required.')
                router.push('/login')
                return
            }

            if (error) {
                toast.error(error)
                return
            }

            if (data) {
                setUsers(data.users)
                setClassConfigs(data.classConfigs || [])
                setKpis(data.kpis)
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
            const result = await updateAdminConfig(selectedClass, Number(surahNum), Number(startAyat), Number(endAyat))

            if (result.success) {
                toast.success(`Challenge configuration for ${selectedClass} updated successfully!`)
                await fetchDashboardData()
            } else {
                toast.error(result.error || 'Failed to update config')
            }
        } catch (err) {
            toast.error('An error occurred while saving configuration')
        } finally {
            setSaving(false)
        }
    }

    const handleDownloadCSV = () => {
        toast.promise(
            fetch(`/api/admin/download-csv`).then(async (res) => {
                if (!res.ok) throw new Error('Failed to download CSV');
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'salafi_madrasa_challenge_students.csv';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }),
            {
                loading: 'Generating CSV Report...',
                success: 'Downloaded successfully!',
                error: 'Failed to generate CSV'
            }
        );
    }

    const handleResetPassword = async (userId: string) => {
        if (!newPassword || newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsResetting(true);
        try {
            const result = await resetAdminUserPassword(userId, newPassword);
            if (result.success) {
                toast.success('Password reset successfully!');
                setResettingUserId(null);
                setNewPassword('');
            } else {
                toast.error(result.error || 'Failed to reset password');
            }
        } catch (err) {
            toast.error('An error occurred during password reset');
        } finally {
            setIsResetting(false);
        }
    }

    const filteredUsers = users.filter(user => {
        if (classFilter === 'All') return true;
        return user.class === classFilter;
    });

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-background text-foreground pb-32"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
    }

    return (
        <div className="min-h-screen bg-transparent text-foreground p-4 md:p-8 animate-in fade-in duration-500 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/50 via-background to-background dark:from-emerald-900/30 dark:via-neutral-950/80 dark:to-neutral-950 -z-10" />
            
            {/* Background Madrasa Image with soft blur & overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center -z-20 opacity-[0.18] dark:opacity-[0.12] pointer-events-none filter blur-[1px]" 
                style={{ backgroundImage: `url('/village-madrasa.png')` }}
            />

            <div className="max-w-7xl mx-auto space-y-8 mt-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <Settings2 className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
                            Admin Center
                        </h1>
                        <p className="text-muted-foreground mt-1">Manage class configuration and student rosters for Salafi Madrasa Attanikkal.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={handleDownloadCSV} variant="outline" className="border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                        <Button asChild variant="outline" className="glass-card hover:bg-muted text-foreground">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>

                {/* KPI Highlights */}
                {kpis && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="glass-card border-blue-500/30">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Students</p>
                                        <p className="text-4xl font-extrabold text-foreground tracking-tight">{kpis.totalUsers}</p>
                                        <p className="text-xs text-muted-foreground font-medium">Registered participants</p>
                                    </div>
                                    <div className="p-3 bg-blue-500/15 text-blue-500 rounded-xl">
                                        <Users className="w-7 h-7" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Games Played</p>
                                        <p className="text-3xl font-bold text-foreground">{kpis.totalSessions}</p>
                                    </div>
                                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                                        <Target className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-emerald-500/30 md:col-span-2">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Top Performer</p>
                                        <p className="text-2xl font-bold text-foreground line-clamp-1">{kpis.bestPerformer}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl inline-block mb-1">
                                            <Trophy className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 justify-end">
                                            <Clock className="w-3 h-3" />
                                            Best: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{kpis.bestTime}</span>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Archive Hall of Champions */}
                <Card className="glass-panel border-amber-500/30 overflow-hidden mb-6 rounded-3xl">
                    <CardHeader className="border-b border-border bg-gradient-to-r from-amber-500/10 to-transparent">
                        <CardTitle className="text-xl text-foreground flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Salafi Madrasa Attanikkal - Historical Hall of Champions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Round 1 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2 px-2">
                                    <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-500/30">Round 1</span>
                                    <span className="text-sm text-muted-foreground font-medium">Ayat 1 to 10</span>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Hanan', place: 'Karaparamb', unit: 'Karaparamb', time: '1m 2s', phone: '+91 8590 004 033' },
                                        { name: 'Adil Noufan', place: 'Feroke', unit: 'Feroke town', time: '1m 6s', phone: '+91 7510 209 453' },
                                        { name: 'Nafi', place: 'Athanikkal', unit: 'Athanikkal', time: '1m 18s', phone: '+91 9562 064 737' },
                                    ].map((champ, idx) => (
                                        <div key={idx} className="flex flex-col gap-2 glass-card p-3 sm:p-4 rounded-xl hover:shadow-md transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner border-2 ${idx === 0 ? 'bg-gradient-to-br from-yellow-200 to-amber-500 border-amber-300' : idx === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 border-slate-300' : 'bg-gradient-to-br from-orange-200 to-orange-500 border-orange-300'}`}>
                                                    {idx === 0 ? '🏆' : idx === 1 ? '🥈' : '🥉'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-foreground text-sm truncate">{champ.name}</h4>
                                                    <p className="text-xs text-muted-foreground truncate">{champ.place} {champ.unit && `(${champ.unit})`}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                                                        {champ.time}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground flex justify-between border-t border-border pt-2 mt-1">
                                                <span>Contact:</span>
                                                <span className="font-medium text-foreground">{champ.phone}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Round 2 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2 px-2">
                                    <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-500/30">Round 2</span>
                                    <span className="text-sm text-muted-foreground font-medium">Ayat 10 to 20</span>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Adil Noufan', place: 'Feroke', unit: 'Feroke town', time: '1m 10s', phone: '+91 7510 209 453' },
                                        { name: 'afthab', place: 'athanikkal', unit: '', time: '1m 19s', phone: '+91 9526 492 238' },
                                        { name: 'Umaiban.C', place: 'Feroke', unit: 'Feroke', time: '1m 34s', phone: '+91 9744 250 300' },
                                    ].map((champ, idx) => (
                                        <div key={idx} className="flex flex-col gap-2 glass-card p-3 sm:p-4 rounded-xl hover:shadow-md transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner border-2 ${idx === 0 ? 'bg-gradient-to-br from-yellow-200 to-amber-500 border-amber-300' : idx === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 border-slate-300' : 'bg-gradient-to-br from-orange-200 to-orange-500 border-orange-300'}`}>
                                                    {idx === 0 ? '🏆' : idx === 1 ? '🥈' : '🥉'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-foreground text-sm truncate">{champ.name}</h4>
                                                    <p className="text-xs text-muted-foreground truncate">{champ.place} {champ.unit && `(${champ.unit})`}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                                                        {champ.time}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground flex justify-between border-t border-border pt-2 mt-1">
                                                <span>Contact:</span>
                                                <span className="font-medium text-foreground">{champ.phone}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Config Panel */}
                    <Card className="col-span-1 glass-panel h-fit rounded-3xl">
                        <CardHeader>
                            <CardTitle className="text-xl text-foreground">Class Challenge Configuration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveConfig} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="selectedClassName" className="text-foreground">Target Class</Label>
                                        <select
                                            id="selectedClassName"
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            className="flex w-full rounded-lg border border-border bg-background text-foreground px-3 h-10 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                        >
                                            {CLASSES.map(cls => (
                                                <option key={cls} value={cls}>{cls}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="surahNumber" className="text-foreground">Surah Number (1-114)</Label>
                                        <Input
                                            id="surahNumber"
                                            type="number"
                                            min={1}
                                            max={114}
                                            value={surahNum}
                                            onChange={(e) => setSurahNum(e.target.valueAsNumber || 67)}
                                            className="bg-background border-border text-foreground focus-visible:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="startAyat" className="text-foreground">Start Ayat</Label>
                                        <Input
                                            id="startAyat"
                                            type="number"
                                            min={1}
                                            value={startAyat}
                                            onChange={(e) => setStartAyat(e.target.valueAsNumber || 1)}
                                            className="bg-background border-border text-foreground focus-visible:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endAyat" className="text-foreground">End Ayat</Label>
                                        <Input
                                            id="endAyat"
                                            type="number"
                                            min={1}
                                            value={endAyat}
                                            onChange={(e) => setEndAyat(e.target.valueAsNumber || 1)}
                                            className="bg-background border-border text-foreground focus-visible:ring-emerald-500"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border leading-relaxed">
                                        Configure customized Surah and Ayat range challenges for each class individually.
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
                    <Card className="col-span-1 md:col-span-2 glass-panel h-fit overflow-hidden rounded-3xl">
                        <CardHeader className="border-b border-border bg-muted/20">
                            <CardTitle className="text-xl text-foreground flex items-center gap-2">
                                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                                Registered Students Roster
                            </CardTitle>
                        </CardHeader>
                        <div className="p-4 border-b border-border bg-muted/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="text-sm font-medium text-muted-foreground">
                                Showing {filteredUsers.length} of {users.length} registered students
                            </div>
                            <div className="flex gap-2 items-center">
                                <Label htmlFor="classFilter" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filter Class:</Label>
                                <select
                                    id="classFilter"
                                    value={classFilter}
                                    onChange={(e) => setClassFilter(e.target.value)}
                                    className="rounded-lg border border-border bg-background text-foreground px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="All">All Classes</option>
                                    {CLASSES.map(cls => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <CardContent className="p-0 overflow-x-auto max-h-[600px] overflow-y-auto">
                            <Table>
                                <TableHeader className="bg-muted/50 sticky top-0 backdrop-blur-md">
                                    <TableRow className="border-border hover:bg-transparent">
                                        <TableHead className="text-muted-foreground font-medium">Name</TableHead>
                                        <TableHead className="text-muted-foreground font-medium">Contact</TableHead>
                                        <TableHead className="text-muted-foreground font-medium">Info</TableHead>
                                        <TableHead className="text-muted-foreground font-medium">MSM Status</TableHead>
                                        <TableHead className="text-muted-foreground font-medium text-right pr-6">Performance</TableHead>
                                        <TableHead className="text-muted-foreground font-medium text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => {
                                        const bestTime = user.game_sessions.length > 0
                                            ? [...user.game_sessions].sort((a, b) => parseInt(a.total_time) - parseInt(b.total_time))[0].total_time
                                            : '--';

                                        return (
                                            <TableRow key={user.id} className="border-border hover:bg-muted/50 transition-colors">
                                                <TableCell className="font-medium text-foreground py-4">
                                                    <div>{user.first_name || ''} {user.last_name || ''}</div>
                                                    <div className="text-xs text-muted-foreground">{user.full_name}</div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground py-4">{user.phone_number}</TableCell>
                                                <TableCell className="py-4">
                                                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{user.class || 'N/A'}</div>
                                                    <div className="text-xs text-muted-foreground">DOB: {user.dob ? new Date(user.dob).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}) : 'N/A'}</div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="text-sm text-foreground">{user.place}</div>
                                                    <div className="text-xs text-muted-foreground">MSM: {user.is_msm_member ? `Yes (${user.msm_unit || 'No unit'})` : 'No'}</div>
                                                </TableCell>
                                                <TableCell className="text-right pr-6 py-4">
                                                    <div className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-lg">{bestTime !== '--' ? formatTime(bestTime) : '--'}</div>
                                                    <div className="text-xs text-muted-foreground font-medium">{user.game_sessions.length} attempts</div>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    {resettingUserId === user.id ? (
                                                        <div className="flex items-center gap-2 max-w-[200px] ml-auto mr-auto">
                                                            <Input
                                                                type="text"
                                                                placeholder="New pass"
                                                                className="h-8 text-xs bg-background"
                                                                value={newPassword}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                disabled={isResetting}
                                                            />
                                                            <Button
                                                                size="sm"
                                                                className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white"
                                                                onClick={() => handleResetPassword(user.id)}
                                                                disabled={isResetting}
                                                            >
                                                                Save
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-8 px-2"
                                                                onClick={() => { setResettingUserId(null); setNewPassword(''); }}
                                                                disabled={isResetting}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10"
                                                            onClick={() => setResettingUserId(user.id)}
                                                        >
                                                            <KeyRound className="w-4 h-4 mr-2" />
                                                            Reset Pass
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                    {filteredUsers.length === 0 && (
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                No students registered for this class.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Share the Challenge */}
                <ShareChallenge />
            </div>
        </div>
    )
}
