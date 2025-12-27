'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Profile } from '@/types/community.types';
import { MarketplaceListing } from '@/types/marketplace.types';
import { getProfileByUsername, getProfileListings } from '@/lib/profiles';
import { PublicSkillCard } from '@/components/marketplace/PublicSkillCard';
import { Loader2, Globe, Twitter, Github, MapPin, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

export default function CreatorProfilePage() {
    const params = useParams();
    const username = params.username as string;

    const [profile, setProfile] = useState<Profile | null>(null);
    const [listings, setListings] = useState<MarketplaceListing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (username) {
            loadData();
        }
    }, [username]);

    const loadData = async () => {
        setLoading(true);
        const profileData = await getProfileByUsername(username);

        if (profileData) {
            setProfile(profileData);
            const listingsData = await getProfileListings(profileData.id);
            setListings(listingsData);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <User className="w-16 h-16 text-muted-foreground/50" />
                <h1 className="text-2xl font-bold">User not found</h1>
                <p className="text-muted-foreground">The creator @{username} does not exist.</p>
            </div>
        );
    }

    const totalInstalls = listings.reduce((acc, curr) => acc + (curr.install_count || 0), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Profile Header */}
            <div className="bg-card border rounded-xl p-8 mb-12 flex flex-col md:flex-row items-start md:items-center gap-8 shadow-sm">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0">
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={username} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span className="text-3xl font-bold text-primary">{username[0].toUpperCase()}</span>
                    )}
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{profile.full_name || username}</h1>
                        <p className="text-muted-foreground font-medium">@{username}</p>
                    </div>

                    {profile.bio && (
                        <p className="text-sm md:text-base max-w-2xl text-foreground/80 leading-relaxed">
                            {profile.bio}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {format(new Date(profile.created_at), 'MMMM yyyy')}</span>
                        </div>
                        {profile.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                <Globe className="w-4 h-4" />
                                <span>Website</span>
                            </a>
                        )}
                        {profile.twitter && (
                            <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                <Twitter className="w-4 h-4" />
                                <span>Twitter</span>
                            </a>
                        )}
                        {profile.github && (
                            <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                <Github className="w-4 h-4" />
                                <span>GitHub</span>
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1 px-6 py-4 bg-muted/30 rounded-lg border">
                    <span className="text-3xl font-bold text-primary">{totalInstalls.toLocaleString()}</span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Total Installs</span>
                </div>
            </div>

            {/* Public Skills Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        Published Skills
                        <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium text-muted-foreground">
                            {listings.length}
                        </span>
                    </h2>
                </div>

                {listings.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed rounded-xl bg-muted/10">
                        <p className="text-muted-foreground">This creator hasn&apos;t published any skills yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map(listing => (
                            <PublicSkillCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
