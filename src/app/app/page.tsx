'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PenTool, Rocket, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shell } from '@/components/layout/Shell';
import { getTemplates } from '@/lib/api/templateApi';
import { Template } from '@/types/skill.types';

export default function AppHomePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Shell title="Dashboard">
      <div className="space-y-8">
        {/* Quick Actions */}
        <section>
          <h1 className="text-2xl font-bold mb-4 text-foreground">Welcome to ClaudeSkills</h1>
          <p className="text-muted-foreground mb-6">
            Build powerful Claude Skills in minutes. Start with a template or create from scratch.
          </p>
          <div className="flex gap-4">
            <Link href="/app/builder">
              <Button size="lg" className="font-semibold">
                <PenTool className="mr-2 h-5 w-5" />
                New Skill
              </Button>
            </Link>
            <Link href="/app/templates">
              <Button size="lg" variant="outline" className="font-semibold">
                <Rocket className="mr-2 h-5 w-5" />
                Browse Templates
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Overview */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-foreground">What You Can Do</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 border-border">
              <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
                <PenTool className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 text-foreground">Build Skills</h3>
              <p className="text-sm text-muted-foreground">
                Create custom Claude Skills with our visual builder. No YAML required.
              </p>
            </Card>
            <Card className="p-4 border-border">
              <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 text-foreground">Use Templates</h3>
              <p className="text-sm text-muted-foreground">
                Start with industry templates for Real Estate, Legal, Finance, and more.
              </p>
            </Card>
            <Card className="p-4 border-border">
              <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 text-foreground">Export & Upload</h3>
              <p className="text-sm text-muted-foreground">
                Download ready-to-use .zip files and upload directly to Claude.ai.
              </p>
            </Card>
          </div>
        </section>

        {/* Recent Templates */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Popular Templates</h2>
            <Link href="/app/templates" className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="p-4 h-40 animate-pulse border-border bg-card/50" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {templates.slice(0, 3).map((template) => (
                <Card key={template.id} className="p-4 hover:shadow-md transition-shadow border-border">
                  <span className="inline-block px-2 py-0.5 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-2">
                    {template.category}
                  </span>
                  <h3 className="font-bold text-foreground mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{template.description}</p>
                  <Link href={`/app/templates/${template.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Use Template
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </Shell>
  );
}
