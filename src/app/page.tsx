import Link from 'next/link';
import { PenTool, Rocket, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getAllTemplates } from '@/lib/templates';

export default function HomePage() {
  const templates = getAllTemplates();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/90 to-primary/60 text-white py-14">
        <div className="container mx-auto px-4">
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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-border shadow-lg">
              <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 text-primary">
                <PenTool className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Simple Form Builder</h3>
              <p className="text-muted-foreground">
                No coding required. Fill out a simple form and generate your custom skill instructions instantly.
              </p>
            </Card>
            <Card className="p-6 border-border shadow-lg">
              <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 text-primary">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Industry Templates</h3>
              <p className="text-muted-foreground">
                Start with pre-built templates for Real Estate, Legal, Finance, and Business workflows.
              </p>
            </Card>
            <Card className="p-6 border-border shadow-lg">
              <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 text-primary">
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
      <section className="py-10 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            Start with a Template
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="p-4 hover:shadow-md transition-shadow border-border">
                <div className="mb-1">
                  <span className="inline-block px-2 py-0.5 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-1">
                    {template.category}
                  </span>
                  <h3 className="text-lg font-bold text-foreground">{template.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{template.description}</p>
                <Link href={`/templates/${template.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </Link>
              </Card>
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

