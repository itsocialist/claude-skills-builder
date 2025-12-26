import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Home, Briefcase, TrendingUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Brighter header with accent */}
      <nav className="bg-card border-b-2 border-primary sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-primary">
            GetClaudeSkills
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/app/templates" className="text-sm text-foreground hover:text-primary hidden sm:block">
              Templates
            </Link>
            <Link href="/app/builder">
              <Button size="sm" variant="default">
                Start Building <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Asymmetric layout */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-banner.png"
            alt=""
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            {/* Left: Copy - Takes more space */}
            <div className="md:col-span-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground leading-tight">
                Stop Typing the Same Prompts{' '}
                <span className="text-primary">Over and Over</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-lg">
                Create your own Claude templates in 2 minutes.
                No coding. No account. Just build and download.
              </p>
              <div className="flex gap-3 flex-wrap mb-4">
                <Link href="/app/builder">
                  <Button size="lg">
                    Start Building – Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button size="lg" variant="ghost">
                    <Play className="mr-2 h-4 w-4" /> See demo
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                Free forever · No account needed · Download in 2 min
              </p>
            </div>

            {/* Right: Screenshot - Smaller */}
            <div className="md:col-span-2 hidden md:block">
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-2xl shadow-black/50">
                <Image
                  src="/screenshots/builder-mock.png"
                  alt="Template Builder"
                  width={500}
                  height={350}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates - 4 columns on large, 2 on medium (breaks the 3-pattern) */}
      <section className="py-10 bg-card border-y border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Industry Templates
            </h2>
            <Link href="/app/templates" className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </div>

          {/* 2 columns on md, 4 on lg - NOT 3 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/app/templates/property-listing" className="block p-4 rounded-lg border border-border bg-background hover:border-primary transition-colors">
              <Home className="h-5 w-5 text-primary mb-2" />
              <div className="font-medium text-foreground text-sm">Property Listing</div>
              <div className="text-xs text-muted-foreground">Real Estate</div>
            </Link>

            <Link href="/app/templates/business-proposal" className="block p-4 rounded-lg border border-border bg-background hover:border-primary transition-colors">
              <Briefcase className="h-5 w-5 text-primary mb-2" />
              <div className="font-medium text-foreground text-sm">Client Brief</div>
              <div className="text-xs text-muted-foreground">Consulting</div>
            </Link>

            <Link href="/app/templates/competitor-analysis" className="block p-4 rounded-lg border border-border bg-background hover:border-primary transition-colors">
              <TrendingUp className="h-5 w-5 text-primary mb-2" />
              <div className="font-medium text-foreground text-sm">Market Analysis</div>
              <div className="text-xs text-muted-foreground">Business</div>
            </Link>

            <Link href="/app/templates/email-drafter" className="block p-4 rounded-lg border border-border bg-background hover:border-primary transition-colors">
              <MessageSquare className="h-5 w-5 text-primary mb-2" />
              <div className="font-medium text-foreground text-sm">Email Templates</div>
              <div className="text-xs text-muted-foreground">Communication</div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Simple numbered list, no circles */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-xl font-bold mb-6 text-foreground">How It Works</h2>

          <div className="max-w-2xl">
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="text-primary font-bold">1.</span>
                <div>
                  <span className="font-medium text-foreground">Pick a template</span>
                  <span className="text-muted-foreground"> — or start from scratch</span>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold">2.</span>
                <div>
                  <span className="font-medium text-foreground">Fill in your content</span>
                  <span className="text-muted-foreground"> — just text fields, no code</span>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold">3.</span>
                <div>
                  <span className="font-medium text-foreground">Download the .zip</span>
                  <span className="text-muted-foreground"> — upload to Claude.ai, done</span>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Demo - Just images, minimal card styling */}
      <section id="demo" className="py-10 bg-card border-y border-border">
        <div className="container mx-auto px-6">
          <h2 className="text-xl font-bold mb-6 text-foreground">See the Builder</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div>
              <Image
                src="/screenshots/builder.png"
                alt="Template Builder Interface"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg border border-border"
              />
              <p className="text-sm text-muted-foreground mt-2">Fill in the form, get a skill file.</p>
            </div>
            <div>
              <Image
                src="/screenshots/templates.png"
                alt="Template Library"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg border border-border"
              />
              <p className="text-sm text-muted-foreground mt-2">Browse templates by industry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why this tool - Plain text, no icons, no cards */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-foreground">Why Use This?</h2>

            <p className="text-muted-foreground mb-4">
              Claude Skills are powerful but creating them manually means learning YAML frontmatter,
              structuring instructions correctly, and lots of trial and error.
            </p>

            <p className="text-muted-foreground mb-4">
              This tool lets you skip all that. Fill in a form, download a working skill file.
            </p>

            <p className="text-muted-foreground">
              <strong className="text-foreground">It&apos;s free</strong> — we don&apos;t store your data,
              you don&apos;t need an account, and you own everything you create.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA - Solid color, no gradient */}
      <section className="py-12 bg-primary/10 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-3 text-foreground">
            Ready?
          </h2>
          <p className="text-muted-foreground mb-5">
            Takes about 2 minutes. Free forever.
          </p>
          <Link href="/app/builder">
            <Button size="lg">
              Start Building <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            GetClaudeSkills © {new Date().getFullYear()} · Not affiliated with Anthropic
          </p>
        </div>
      </footer>
    </div>
  );
}
