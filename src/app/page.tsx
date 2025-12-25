import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, CheckCircle, Home, Briefcase, TrendingUp, Shield, Zap, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-primary">
            GetClaudeSkills
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">100% Free</span>
            <Link href="/app/builder">
              <Button size="sm" variant="default" className="font-semibold">
                Start Building <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Compact with image */}
      <section className="relative py-10 md:py-14 overflow-hidden">
        {/* Hero Banner Background */}
        <div className="absolute inset-0">
          <Image
            src="/hero-banner.png"
            alt=""
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Copy */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground leading-tight">
                Stop Typing the Same Prompts{' '}
                <span className="text-primary">Over and Over</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-5">
                Create your own Claude templates in 2 minutes.
                No coding. No account. Just build and download.
              </p>
              <div className="flex gap-3 flex-wrap mb-4">
                <Link href="/app/builder">
                  <Button size="lg" className="font-semibold">
                    Start Building – It&apos;s Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button size="lg" variant="outline" className="font-semibold">
                    <Play className="mr-2 h-4 w-4" /> Demo
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" /> Free
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" /> No account
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" /> 2 min setup
                </span>
              </div>
            </div>

            {/* Right: App Screenshot */}
            <div className="hidden md:block">
              <div className="rounded-lg overflow-hidden border border-border shadow-2xl">
                <Image
                  src="/screenshots/builder.png"
                  alt="Template Builder"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase - Immediately visible */}
      <section className="py-10 bg-card border-y border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Templates for YOUR Industry
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Start with a template, customize it, download.
              </p>
            </div>
            <Link href="/app/templates" className="text-sm text-primary hover:underline font-medium hidden sm:block">
              Browse all →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Real Estate */}
            <Link href="/app/templates/property-listing">
              <Card className="p-4 border-border bg-background hover:border-primary transition-colors cursor-pointer group h-full">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-primary uppercase">Real Estate</span>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      Property Listing Generator
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Generate compelling listings in seconds
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Consulting */}
            <Link href="/app/templates/business-proposal">
              <Card className="p-4 border-border bg-background hover:border-primary transition-colors cursor-pointer group h-full">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-primary uppercase">Consulting</span>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      Client Brief Generator
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Professional briefs, consistent format
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Business */}
            <Link href="/app/templates/competitor-analysis">
              <Card className="p-4 border-border bg-background hover:border-primary transition-colors cursor-pointer group h-full">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-primary uppercase">Business</span>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      Market Analysis Report
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Comprehensive reports instantly
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          <p className="text-center mt-4 sm:hidden">
            <Link href="/app/templates" className="text-sm text-primary hover:underline font-medium">
              Browse all templates →
            </Link>
          </p>
        </div>
      </section>

      {/* How It Works - Compact */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="font-semibold mb-1 text-foreground">Pick a Template</h3>
              <p className="text-sm text-muted-foreground">
                Choose one or start blank
              </p>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="font-semibold mb-1 text-foreground">Fill in the Blanks</h3>
              <p className="text-sm text-muted-foreground">
                No coding required
              </p>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="font-semibold mb-1 text-foreground">Download &amp; Use</h3>
              <p className="text-sm text-muted-foreground">
                Upload to Claude.ai
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-10 bg-card border-y border-border">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-2 text-foreground">
            See It In Action
          </h2>
          <p className="text-center text-muted-foreground mb-6">
            Watch how easy it is to create a Claude template
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="rounded-lg overflow-hidden border border-border shadow-lg">
              <Image
                src="/screenshots/builder.png"
                alt="Template Builder Interface"
                width={600}
                height={400}
                className="w-full h-auto"
              />
              <div className="p-3 bg-background">
                <h4 className="font-semibold text-sm text-foreground">Simple Form Builder</h4>
                <p className="text-xs text-muted-foreground">Fill in fields – no coding</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border border-border shadow-lg">
              <Image
                src="/screenshots/templates.png"
                alt="Template Library"
                width={600}
                height={400}
                className="w-full h-auto"
              />
              <div className="p-3 bg-background">
                <h4 className="font-semibold text-sm text-foreground">Industry Templates</h4>
                <p className="text-xs text-muted-foreground">Real Estate, Consulting, Business</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Not a Marketplace + Trust - Combined & Compact */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Differentiation */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">
                  Not a Marketplace. A Builder.
                </h2>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Other options: browse generic templates</p>
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-foreground">Build YOUR templates from scratch</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-foreground">Tailored to YOUR workflow</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-foreground">Download and own forever</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">
                  Your Data, Your Control
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-foreground">100% Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-foreground">No Account</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-foreground">Data Stays Local</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-foreground">Own Your Files</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Compact */}
      <section className="py-12 bg-gradient-to-r from-primary/20 to-primary/5 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            Ready to Build?
          </h2>
          <p className="text-muted-foreground mb-5 max-w-md mx-auto">
            2 minutes to your first Claude template. Free forever.
          </p>
          <Link href="/app/builder">
            <Button size="lg" className="font-semibold px-8">
              Start Building – It&apos;s Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            GetClaudeSkills &copy; {new Date().getFullYear()} · Not affiliated with Anthropic
          </p>
        </div>
      </footer>
    </div>
  );
}
