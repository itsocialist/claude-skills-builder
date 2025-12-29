import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://getclaudeskills.ai'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/marketplace`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/app/templates`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/app`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ]

    // Dynamic marketplace skill pages
    let skillPages: MetadataRoute.Sitemap = []

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey)

            const { data: listings } = await supabase
                .from('market_listings')
                .select('slug, updated_at')
                .eq('listing_status', 'active')

            if (listings) {
                skillPages = listings.map((listing) => ({
                    url: `${baseUrl}/marketplace/${listing.slug}`,
                    lastModified: new Date(listing.updated_at),
                    changeFrequency: 'weekly' as const,
                    priority: 0.6,
                }))
            }
        }
    } catch (error) {
        console.error('Error generating sitemap:', error)
    }

    return [...staticPages, ...skillPages]
}
