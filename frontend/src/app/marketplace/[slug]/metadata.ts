import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const baseUrl = 'https://getclaudeskills.ai'

    // Default metadata
    const defaults: Metadata = {
        title: 'Skill Not Found | GetClaudeSkills',
        description: 'This skill may have been removed or is no longer available.',
    }

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) return defaults

        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data: listing } = await supabase
            .from('market_listings')
            .select('title, description, category, creator_id, install_count')
            .eq('slug', slug)
            .eq('listing_status', 'active')
            .single()

        if (!listing) return defaults

        const title = `${listing.title} | GetClaudeSkills Marketplace`
        const description = listing.description || `Download and install the ${listing.title} Claude skill for free.`

        return {
            title,
            description,
            openGraph: {
                title: listing.title,
                description,
                url: `${baseUrl}/marketplace/${slug}`,
                siteName: 'GetClaudeSkills',
                type: 'article',
                images: [
                    {
                        url: `${baseUrl}/api/og?title=${encodeURIComponent(listing.title)}&category=${encodeURIComponent(listing.category || 'Skill')}`,
                        width: 1200,
                        height: 630,
                        alt: listing.title,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: listing.title,
                description,
            },
            alternates: {
                canonical: `${baseUrl}/marketplace/${slug}`,
            },
        }
    } catch {
        return defaults
    }
}

// JSON-LD structured data component
export function generateJsonLd(listing: {
    title: string
    description?: string
    category?: string
    install_count?: number
    slug: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: listing.title,
        description: listing.description,
        applicationCategory: listing.category || 'BusinessApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        aggregateRating: listing.install_count ? {
            '@type': 'AggregateRating',
            ratingValue: '5',
            ratingCount: listing.install_count,
        } : undefined,
        url: `https://getclaudeskills.ai/marketplace/${listing.slug}`,
    }
}
