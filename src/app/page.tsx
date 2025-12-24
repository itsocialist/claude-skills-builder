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
      <section className="bg-gradient-to-br from-primary/90 to-primary/60 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Build Claude Skills in Minutes, Not Hours
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            The fastest way to create custom Claude Skills for your business workflows.
            No coding required.
          </p>
          <div className="flex gap-4 justify-center">
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
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Start with a Template
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {templates.map((template) => (
              <Card key={template.id} className="p-6 hover:shadow-md transition-shadow border-border">
                <h3 className="text-xl font-semibold mb-2 text-foreground">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{template.description}</p>
                <div className="mb-6">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground font-medium">
                    {template.category}
                  </span>
                </div>
                <Link href={`/templates/${template.id}`}>
                  <Button variant="outline" className="w-full">
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

