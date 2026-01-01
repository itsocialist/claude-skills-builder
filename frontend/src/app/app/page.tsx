'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PenTool, Rocket, Layers, LogIn, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shell } from '@/components/layout/Shell';
import { getTemplates } from '@/lib/api/templateApi';
import { Template } from '@/types/skill.types';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSiteSettings } from '@/lib/contexts/SiteSettingsContext';
import { DEFAULT_FLAGS } from '@/lib/flags';
import { bundles as sharedBundles } from '@/lib/constants/bundles';
import { useLibraryStore } from '@/lib/store/libraryStore';
import { motion } from 'framer-motion';
import { FadeInStagger, fadeInItem } from '@/components/animations/FadeIn';

export default function AppHomePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { settings } = useSiteSettings();

  // User skills from library store
  const { skills: userSkills, fetchSkills, isLoading: skillsLoading } = useLibraryStore();

  // Feature Flag Logic
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',');
  const isAdmin = user?.email && adminEmails.some(e => e.trim() === user.email?.toLowerCase().trim());
  const builderFlag = settings.feature_flags?.feature_builder || DEFAULT_FLAGS.feature_builder;
  const canUseBuilder = builderFlag !== 'DISABLED' && (builderFlag !== 'ADMIN_ONLY' || isAdmin);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTemplates();
        setTemplates(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Load user skills when user is available
  useEffect(() => {
    if (user?.id) {
      fetchSkills(user.id);
    }
  }, [user?.id, fetchSkills]);

  // Get first 3 bundles for display
  const displayBundles = sharedBundles.slice(0, 3);

  return (
    <Shell title="Dashboard">
      <div className="space-y-10">
        {/* Hero Section - Centered & Polished */}
        <section className="text-center py-8 border-b border-border">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to GetClaudeSkills.ai
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Build powerful Claude Skills quickly. Start from a template or create your own from scratch.
          </p>
          {canUseBuilder && (
            <div className="flex justify-center gap-3">
              <Link href="/app/wizard">
                <Button size="lg" className="font-semibold">
                  <PenTool className="mr-2 h-4 w-4" />
                  Create New Skill
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="font-semibold">
                  <Rocket className="mr-2 h-4 w-4" />
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/app/flow">
                <Button size="lg" variant="ghost" className="font-semibold text-primary">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Find My Skills
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Quick Navigation Cards */}
        <section>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/marketplace" className="group">
              <Card className="p-4 border-border h-full hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Discover</h3>
                <p className="text-sm text-muted-foreground">
                  Browse skills in the Marketplace.
                </p>
              </Card>
            </Link>
            <Link href="/app/wizard" className="group">
              <Card className="p-4 border-border h-full hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Create</h3>
                <p className="text-sm text-muted-foreground">
                  Build skills with our wizard.
                </p>
              </Card>
            </Link>
            <Link href="/app/library" className="group">
              <Card className="p-4 border-border h-full hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Manage</h3>
                <p className="text-sm text-muted-foreground">
                  Organize your skill library.
                </p>
              </Card>
            </Link>
            <Link href="/app/learn/what-is-a-skill" className="group">
              <Card className="p-4 border-border h-full hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Learn</h3>
                <p className="text-sm text-muted-foreground">
                  Guides and best practices.
                </p>
              </Card>
            </Link>
          </div>
        </section>

        {/* Your Skills Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your Skills</h2>
            {user && (
              <Link href="/app/library" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {user ? (
            skillsLoading ? (
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="p-4 h-28 animate-pulse border-border bg-card/50" />
                ))}
              </div>
            ) : userSkills.length > 0 ? (
              <FadeInStagger className="grid md:grid-cols-3 gap-4">
                {userSkills.slice(0, 3).map((skill: any) => (
                  <motion.div key={skill.id} variants={fadeInItem}>
                    <Card className="p-4 border-border hover:border-primary/50 transition-colors">
                      <h3 className="font-semibold text-foreground mb-1">{skill.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{skill.description}</p>
                      <Link href={`/app/builder?skill=${skill.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Edit Skill
                        </Button>
                      </Link>
                    </Card>
                  </motion.div>
                ))}
              </FadeInStagger>
            ) : (
              <Card className="p-6 border-border text-center">
                <p className="text-muted-foreground mb-4">You haven't created any skills yet.</p>
                <Link href="/app/wizard">
                  <Button>
                    <PenTool className="mr-2 h-4 w-4" />
                    Create Your First Skill
                  </Button>
                </Link>
              </Card>
            )
          ) : (
            <Card className="p-6 border-border bg-muted/20 text-center">
              <LogIn className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">Sign in to see your skills and track your creations.</p>
              <Link href="/login">
                <Button variant="outline">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign Up / Log In
                </Button>
              </Link>
            </Card>
          )}
        </section>

        {/* Your Bundles Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your Bundles</h2>
            {user && (
              <Link href="/bundles" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {user ? (
            <FadeInStagger className="grid md:grid-cols-3 gap-4">
              {displayBundles.map((bundle) => (
                <motion.div key={bundle.id} variants={fadeInItem} className="h-full">
                  <Link href={`/bundles/${bundle.id}`}>
                    <Card className="p-4 border-border hover:border-primary/50 transition-colors h-full">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="h-5 w-5 text-primary" />
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">{bundle.skills.length} skills</span>
                      </div>
                      <h3 className="font-semibold text-foreground">{bundle.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{bundle.tagline}</p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </FadeInStagger>
          ) : (
            <Card className="p-6 border-border bg-muted/20 text-center">
              <Layers className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">Sign in to access your bundles and curated skill collections.</p>
              <Link href="/login">
                <Button variant="outline">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign Up / Log In
                </Button>
              </Link>
            </Card>
          )}
        </section>

        {/* Popular Skills Section */}
        {canUseBuilder && (
          <section className="bg-muted/10 p-6 -mx-4 md:-mx-8 px-4 md:px-8 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Popular Skills</h2>
              <Link href="/app/templates" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {loading ? (
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="p-4 h-32 animate-pulse border-border bg-card/50" />
                ))}
              </div>
            ) : (
              <FadeInStagger className="grid md:grid-cols-3 gap-4">
                {templates.slice(0, 3).map((template) => (
                  <motion.div key={template.id} variants={fadeInItem}>
                    <Card className="p-4 border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-2">
                        {template.category}
                      </span>
                      <h3 className="font-bold text-foreground mb-1">{template.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{template.description}</p>
                      <Link href={`/app/templates/${template.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Use Skill
                        </Button>
                      </Link>
                    </Card>
                  </motion.div>
                ))}
              </FadeInStagger>
            )}
          </section>
        )}
      </div>
    </Shell>
  );
}
