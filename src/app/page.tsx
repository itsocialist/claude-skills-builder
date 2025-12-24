import Link from 'next/link';
import { PenTool, Rocket, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TemplateCard } from '@/components/ui/template-card';
import { getAllTemplates } from '@/lib/templates';
import { spacing, iconContainer } from '@/lib/theme';

export default function HomePage() {
  const templates = getAllTemplates();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative text-white py-14 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-banner.png)' }}
        />
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Claude Skills: Find, Build and Bundle
          </h1>
          <p className="text-lg mb-6 max-w-2xl opacity-90">
            Unlock the power of Claude Skills, without the trial and error. So you can get to flexing YOUR powers.
          </p>
          <div className="flex gap-4">
            <Link href="/builder">
              <Button size="lg" variant="secondary" className="font-semibold px-8">
                Start Building Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`${spacing.sectionLarge} bg-background`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className={`${spacing.card} border-border shadow-lg`}>
              <div className={iconContainer.feature}>
                <PenTool className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Simple Form Builder</h3>
              <p className="text-muted-foreground">
                No coding required. Fill out a simple form and generate your custom skill instructions instantly.
              </p>
            </Card>
            <Card className={`${spacing.card} border-border shadow-lg`}>
              <div className={iconContainer.feature}>
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Industry Templates</h3>
              <p className="text-muted-foreground">
                Start with pre-built templates for Real Estate, Legal, Finance, and Business workflows.
              </p>
            </Card>
            <Card className={`${spacing.card} border-border shadow-lg`}>
              <div className={iconContainer.feature}>
                <Download className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Instant Download</h3>
              <p className="text-muted-foreground">
                Get your skill as a ready-to-upload .zip file containing everything Claude needs.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className={`${spacing.section} bg-card`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            Start with a Template
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                variant="compact"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4 text-muted-foreground">
            ClaudeSkillsFacet &copy; {new Date().getFullYear()}
          </p>
          <p className="text-sm text-muted-foreground/70">
            Not affiliated with Anthropic. "Claude" is a trademark of Anthropic, PBC.
          </p>
        </div>
      </footer>
    </div>
  );
}

