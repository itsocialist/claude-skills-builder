'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { analyticsApi } from '@/lib/api/analyticsApi';
import { Eye, Download, Copy, TrendingUp } from 'lucide-react';
import { SkillStats } from '@/types/skill.types';

interface InsightsPanelProps {
    skillId: string;
    stats?: SkillStats;
}

export function InsightsPanel({ skillId, stats }: InsightsPanelProps) {
    const [trendData, setTrendData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTrend() {
            setLoading(true);
            const rawEvents = await analyticsApi.getSkillTrend(skillId, 30);

            // Client-side aggregation
            // Group by date (YYYY-MM-DD)
            const groupedArgs = (rawEvents || []).reduce((acc: any, curr: any) => {
                const date = curr.created_at.split('T')[0];
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});

            // Fill missing dates for last 30 days
            const chartData = [];
            for (let i = 29; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const isoDate = d.toISOString().split('T')[0];
                chartData.push({
                    date: isoDate,
                    displayDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                    views: groupedArgs[isoDate] || 0
                });
            }

            setTrendData(chartData);
            setLoading(false);
        }

        loadTrend();
    }, [skillId]);

    const hasTraffic = (stats?.view_count || 0) > 0;

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#2a2a2a] border border-[#3a3a3a] p-3 rounded-lg text-center">
                    <div className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3" /> Views
                    </div>
                    <div className="text-xl font-medium text-white">{stats?.view_count || 0}</div>
                </div>
                <div className="bg-[#2a2a2a] border border-[#3a3a3a] p-3 rounded-lg text-center">
                    <div className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
                        <Download className="w-3 h-3" /> Downloads
                    </div>
                    <div className="text-xl font-medium text-white">{stats?.download_count || 0}</div>
                </div>
                <div className="bg-[#2a2a2a] border border-[#3a3a3a] p-3 rounded-lg text-center">
                    <div className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
                        <Copy className="w-3 h-3" /> Copies
                    </div>
                    <div className="text-xl font-medium text-white">{stats?.copy_count || 0}</div>
                </div>
            </div>

            {/* Sparkline Chart */}
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#C15F3C]" />
                        30-Day Activity
                    </h4>
                </div>

                <div className="h-[150px] w-full">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-gray-500 text-sm">Loading trend...</div>
                    ) : !hasTraffic ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm gap-2">
                            <span>No traffic yet</span>
                            <span className="text-xs text-gray-600">Share your skill to start tracking</span>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C15F3C" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#C15F3C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="displayDate"
                                    hide
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#888' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#C15F3C"
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={async () => {
                        const { exportAnalyticsToCsv } = await import('@/lib/utils/export-analytics');
                        // Fetch all events for export (limit 1000 for MVP)
                        const events = await analyticsApi.getSkillTrend(skillId, 90);
                        if (events) exportAnalyticsToCsv('skill_export', events as any);
                    }}
                    className="text-xs text-[#C15F3C] hover:text-[#C15F3C]/80 underline transition-colors"
                >
                    Export usage data as CSV
                </button>
            </div>
        </div>
    );
}
