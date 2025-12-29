'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shell } from '@/components/layout/Shell'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthProvider'
import {
    BarChart3,
    Download,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Users,
    Sparkles,
    FileDown,
    Mail,
    RefreshCw
} from 'lucide-react'

interface FunnelStep {
    name: string
    count: number
    percentage: number
}

interface TrendData {
    date: string
    visits: number
    signups: number
    skills_created: number
    downloads: number
}

interface AnalyticsData {
    funnel: FunnelStep[]
    trends: TrendData[]
    conversionRates: {
        visitToSignup: number
        signupToCreate: number
        createToDownload: number
        emailCaptureRate: number
    }
    totals: {
        totalVisits: number
        totalSignups: number
        totalSkills: number
        totalDownloads: number
        emailsCaptured: number
    }
}

// Mock data generator - in production this would come from the API
function generateMockAnalytics(): AnalyticsData {
    const funnel: FunnelStep[] = [
        { name: 'Site Visits', count: 12450, percentage: 100 },
        { name: 'Started Builder', count: 3240, percentage: 26 },
        { name: 'Generated Skill', count: 1890, percentage: 15 },
        { name: 'Downloaded', count: 1245, percentage: 10 },
    ]

    const trends: TrendData[] = []
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        trends.push({
            date: date.toISOString().split('T')[0],
            visits: Math.floor(300 + Math.random() * 200),
            signups: Math.floor(30 + Math.random() * 50),
            skills_created: Math.floor(50 + Math.random() * 40),
            downloads: Math.floor(30 + Math.random() * 30),
        })
    }

    return {
        funnel,
        trends,
        conversionRates: {
            visitToSignup: 26,
            signupToCreate: 58,
            createToDownload: 66,
            emailCaptureRate: 12,
        },
        totals: {
            totalVisits: 12450,
            totalSignups: 3240,
            totalSkills: 1890,
            totalDownloads: 1245,
            emailsCaptured: 389,
        }
    }
}

export default function AnalyticsPage() {
    const router = useRouter()
    const { user, loading } = useAuth()
    const [isAdmin, setIsAdmin] = useState(false)
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [isExporting, setIsExporting] = useState(false)

    useEffect(() => {
        if (!loading && user) {
            const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
                .toLowerCase()
                .split(',')
                .map(email => email.trim())
                .filter(email => email.length > 0)

            const userEmail = (user.email || '').toLowerCase().trim()
            const adminCheck = adminEmails.includes(userEmail)
            setIsAdmin(adminCheck)

            if (!adminCheck) {
                router.push('/app')
            } else {
                // Load analytics data
                setAnalytics(generateMockAnalytics())
            }
        } else if (!loading && !user) {
            router.push('/')
        }
    }, [user, loading, router])

    const handleExportCSV = () => {
        if (!analytics) return
        setIsExporting(true)

        // Create CSV content
        const headers = 'Date,Visits,Signups,Skills Created,Downloads\n'
        const rows = analytics.trends.map(t =>
            `${t.date},${t.visits},${t.signups},${t.skills_created},${t.downloads}`
        ).join('\n')

        const csvContent = headers + rows
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', `analytics_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setTimeout(() => setIsExporting(false), 1000)
    }

    if (loading || !isAdmin || !analytics) {
        return (
            <Shell>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </Shell>
        )
    }

    const maxTrendValue = Math.max(...analytics.trends.map(t => t.visits))

    return (
        <Shell title="Analytics">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
                            <p className="text-muted-foreground">Marketing funnel and conversion metrics</p>
                        </div>
                    </div>
                    <Button onClick={handleExportCSV} disabled={isExporting} className="gap-2">
                        {isExporting ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        Export CSV
                    </Button>
                </div>

                {/* Funnel Visualization */}
                <Card className="p-6 mb-8">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Onboarding Funnel</h2>
                    <div className="flex items-center justify-between">
                        {analytics.funnel.map((step, index) => (
                            <div key={step.name} className="flex items-center">
                                <div className="text-center flex-1">
                                    <div
                                        className="mx-auto mb-3 rounded-lg bg-primary/20 flex items-center justify-center transition-all"
                                        style={{
                                            width: `${80 + step.percentage * 0.6}px`,
                                            height: `${60 + step.percentage * 0.4}px`,
                                        }}
                                    >
                                        <span className="text-xl font-bold text-primary">{step.count.toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground">{step.name}</p>
                                    <p className="text-xs text-muted-foreground">{step.percentage}% of total</p>
                                </div>
                                {index < analytics.funnel.length - 1 && (
                                    <ArrowRight className="w-6 h-6 text-muted-foreground mx-4" />
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Conversion Rate Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            <span className="text-xs text-green-500 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +2.4%
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{analytics.conversionRates.visitToSignup}%</p>
                        <p className="text-xs text-muted-foreground">Visit → Start Builder</p>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            <span className="text-xs text-green-500 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +5.1%
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{analytics.conversionRates.signupToCreate}%</p>
                        <p className="text-xs text-muted-foreground">Start → Generate</p>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <FileDown className="w-5 h-5 text-green-500" />
                            <span className="text-xs text-red-500 flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" /> -1.2%
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{analytics.conversionRates.createToDownload}%</p>
                        <p className="text-xs text-muted-foreground">Generate → Download</p>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Mail className="w-5 h-5 text-orange-500" />
                            <span className="text-xs text-green-500 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +0.8%
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{analytics.conversionRates.emailCaptureRate}%</p>
                        <p className="text-xs text-muted-foreground">Email Capture Rate</p>
                    </Card>
                </div>

                {/* 30-Day Trend Chart */}
                <Card className="p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-foreground">Last 30 Days</h2>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-primary rounded" /> Visits</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded" /> Downloads</span>
                        </div>
                    </div>

                    {/* Simple bar chart */}
                    <div className="flex items-end gap-1 h-40">
                        {analytics.trends.map((day, index) => (
                            <div
                                key={day.date}
                                className="flex-1 flex flex-col gap-0.5"
                                title={`${day.date}: ${day.visits} visits, ${day.downloads} downloads`}
                            >
                                <div
                                    className="bg-primary/60 rounded-t transition-all hover:bg-primary"
                                    style={{ height: `${(day.visits / maxTrendValue) * 100}%` }}
                                />
                                <div
                                    className="bg-green-500/60 rounded-b transition-all hover:bg-green-500"
                                    style={{ height: `${(day.downloads / maxTrendValue) * 100}%` }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>30 days ago</span>
                        <span>15 days ago</span>
                        <span>Today</span>
                    </div>
                </Card>

                {/* Totals Summary */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Period Summary</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div>
                            <p className="text-3xl font-bold text-foreground">{analytics.totals.totalVisits.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Total Visits</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-foreground">{analytics.totals.totalSignups.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Started Builder</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-foreground">{analytics.totals.totalSkills.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Skills Created</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-foreground">{analytics.totals.totalDownloads.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Downloads</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-foreground">{analytics.totals.emailsCaptured.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Emails Captured</p>
                        </div>
                    </div>
                </Card>
            </div>
        </Shell>
    )
}
