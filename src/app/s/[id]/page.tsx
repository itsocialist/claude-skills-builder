import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: skill } = await supabase
        .from('user_skills')
        .select('name, description')
        .eq('id', id)
        .single();

    const title = skill?.name || 'Shared Skill';
    const description = skill?.description || 'A custom Claude skill';
    const ogImageUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://getclaudeskills.ai'}/api/og/${id}`;

    return {
        title: `${title} | GetClaudeSkills`,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: ogImageUrl, width: 1200, height: 630 }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImageUrl],
        },
    };
}

async function getSkill(id: string) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
}

export default async function SharedSkillPage({ params }: PageProps) {
    const { id } = await params;
    const skill = await getSkill(id);

    if (!skill) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Skill Not Found</h1>
                    <p className="text-gray-400 mb-6">This skill may have been removed or is no longer available.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-[#C15F3C] text-white rounded-lg hover:bg-[#a84f32] transition-colors"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a]">
            {/* Header */}
            <header className="border-b border-gray-800 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-white">
                        GetClaudeSkills
                    </Link>
                    <Link
                        href="/app"
                        className="px-4 py-2 bg-[#C15F3C] text-white rounded-lg hover:bg-[#a84f32] transition-colors text-sm"
                    >
                        Open App
                    </Link>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Category badge */}
                <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-[#C15F3C]/20 text-[#C15F3C] rounded-full text-sm font-medium">
                        {skill.category || 'General'}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-white mb-4">{skill.name}</h1>

                {/* Description */}
                <p className="text-lg text-gray-400 mb-8">{skill.description}</p>

                {/* Tags */}
                {skill.tags && skill.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {skill.tags.map((tag: string, index: number) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Triggers */}
                {skill.triggers && skill.triggers.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-white mb-3">Trigger Phrases</h2>
                        <div className="space-y-2">
                            {skill.triggers.map((trigger: string, index: number) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 font-mono text-sm"
                                >
                                    &quot;{trigger}&quot;
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Instructions preview */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3">Instructions Preview</h2>
                    <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <p className="text-gray-400 text-sm line-clamp-6">
                            {skill.instructions}
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="p-6 bg-gradient-to-r from-[#C15F3C]/20 to-transparent border border-[#C15F3C]/30 rounded-xl">
                    <h3 className="text-xl font-semibold text-white mb-2">
                        Want to use this skill?
                    </h3>
                    <p className="text-gray-400 mb-4">
                        Sign up to clone this skill to your library and start using it with Claude.
                    </p>
                    <Link
                        href={`/app?clone=${id}`}
                        className="inline-flex items-center px-6 py-3 bg-[#C15F3C] text-white rounded-lg hover:bg-[#a84f32] transition-colors font-medium"
                    >
                        Clone to My Library
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 px-6 py-8 mt-12">
                <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
                    <p>Built with GetClaudeSkills.ai — Create, share, and manage Claude skills</p>
                </div>
            </footer>
        </div>
    );
}
