import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SiteSettingsProvider } from "@/lib/contexts/SiteSettingsContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getclaudeskills.ai"),
  title: "GetClaudeSkills | Create AI Templates in Minutes",
  description: "Build custom Claude skills without coding. Free templates for real estate, consulting, and business professionals. Start in 2 minutes.",
  keywords: ["claude skills", "claude skill builder", "ai templates", "prompt templates", "claude ai", "ai for real estate", "ai for consultants"],
  authors: [{ name: "GetClaudeSkills" }],
  openGraph: {
    title: "GetClaudeSkills | Create AI Templates in Minutes",
    description: "Build custom Claude skills without coding. Free templates for real estate, consulting, and business. Start in 2 minutes.",
    url: "https://getclaudeskills.ai",
    siteName: "GetClaudeSkills",
    images: [
      {
        url: "/hero-banner-wide.png",
        width: 1200,
        height: 600,
        alt: "GetClaudeSkills - Build Claude Skills in Minutes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Skills Builder | Create AI Templates in Minutes",
    description: "Build custom Claude skills without coding. Free templates for real estate, consulting, and business.",
    images: ["/hero-banner-wide.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <SiteSettingsProvider>
            {children}
          </SiteSettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
