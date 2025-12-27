import { AnalyticsEvent } from '@/types/skill.types';

export function exportAnalyticsToCsv(skillName: string, events: AnalyticsEvent[]) {
    // 1. Define Headers
    const headers = ['Date', 'Event Type', 'Source'];

    // 2. Map Rows
    const rows = events.map(e => [
        new Date(e.created_at).toISOString(),
        e.event_type,
        e.metadata?.source || 'web'
    ]);

    // 3. Construct CSV String
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // 4. Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${skillName.replace(/\s+/g, '_')}_analytics.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
