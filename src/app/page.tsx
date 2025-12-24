import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, FileText, Download, Play, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-2xl text-primary">
            GetClaudeSkills
          </Link>
          <Link href="/app/builder">
            <Button variant="default" className="font-semibold">
              Go to App <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: 'url(/hero-banner.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
              Build Claude Skills<br />
              <span className="text-primary">Without the Trial and Error</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Create powerful AI workflows in minutes. No coding required.
              Get your custom Claude Skills up and running instantly.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/app/builder">
                <Button size="lg" className="font-semibold px-8 text-lg">
                  Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="font-semibold px-8 text-lg">
                  <Play className="mr-2 h-5 w-5" /> Watch Demo
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              ✓ Free forever  ✓ No account required  ✓ Instant download
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            Everything You Need to Build Claude Skills
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Stop wrestling with YAML syntax and trial-and-error. Our visual builder
            makes creating powerful Claude Skills simple and fast.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-border bg-background">
              <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Visual Builder</h3>
              <p className="text-muted-foreground">
                Simple form interface. No YAML syntax to learn.
                Fill in the fields and watch your skill come to life.
              </p>
            </Card>

            <Card className="p-6 border-border bg-background">
              <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Industry Templates</h3>
              <p className="text-muted-foreground">
                Pre-built templates for Real Estate, Legal, Finance, and more.
                Customize to your needs and export instantly.
              </p>
            </Card>

            <Card className="p-6 border-border bg-background">
              <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Instant Export</h3>
              <p className="text-muted-foreground">
                Download Claude-ready .zip files with one click.
                Upload directly to Claude.ai and start using immediately.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            See It In Action
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Watch how easy it is to create a Claude Skill from scratch.
          </p>

          {/* Screenshots */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="rounded-lg overflow-hidden border border-border shadow-xl">
              <Image
                src="/screenshots/builder.png"
                alt="Skill Builder Interface"
                width={800}
                height={500}
                className="w-full h-auto"
              />
              <div className="p-4 bg-card">
                <h4 className="font-semibold text-foreground">Visual Skill Builder</h4>
                <p className="text-sm text-muted-foreground">Clean interface with real-time preview</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border border-border shadow-xl">
              <Image
                src="/screenshots/templates.png"
                alt="Template Library"
                width={800}
                height={500}
                className="w-full h-auto"
              />
              <div className="p-4 bg-card">
                <h4 className="font-semibold text-foreground">Template Library</h4>
                <p className="text-sm text-muted-foreground">Start with pre-built industry templates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Choose a Template</h3>
              <p className="text-muted-foreground">
                Browse industry-specific templates or start with a blank canvas
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Customize</h3>
              <p className="text-muted-foreground">
                Fill in your instructions, triggers, and constraints using our visual editor
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Export & Upload</h3>
              <p className="text-muted-foreground">
                Download your .zip file and upload it to Claude.ai
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-primary/20 to-primary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Ready to Build Your First Skill?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of Claude users creating powerful AI workflows.
            Free to use, no account required.
          </p>
          <Link href="/app/builder">
            <Button size="lg" className="font-semibold px-10 text-lg">
              Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <div className="flex justify-center gap-8 mt-12 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>No Account Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Instant Download</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-4 text-muted-foreground">
            GetClaudeSkills &copy; {new Date().getFullYear()}
          </p>
          <p className="text-sm text-muted-foreground/70">
            Not affiliated with Anthropic. &quot;Claude&quot; is a trademark of Anthropic, PBC.
          </p>
        </div>
      </footer>
    </div>
  );
}
