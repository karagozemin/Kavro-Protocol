import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { ChainGuard } from "@/components/chain-guard";
import { ColorBendsBackground } from "@/components/backgrounds/ColorBendsBackground";
import { BrandLogo } from "@/components/brand-logo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kavro Protocol",
  description: "Confidential credit-agent infrastructure on 0G.",
  icons: {
    icon: [
      { url: "/kavro-icon.png", sizes: "512x512", type: "image/png" },
      { url: "/kavrohigh.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Kavro Protocol",
    description: "Confidential credit-agent infrastructure on 0G.",
    images: [{ url: "/kavrohigh.png", width: 5016, height: 5016, alt: "Kavro Protocol logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kavro Protocol",
    description: "Confidential credit-agent infrastructure on 0G.",
    images: ["/kavrohigh.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>
          <ChainGuard>
          <div className="relative min-h-screen bg-bg">
            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 bg-hero-gradient" />
            <div className="pointer-events-none fixed inset-0 bg-dot-pattern opacity-40" />
            <ColorBendsBackground />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Nav />
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
                {children}
              </main>
              <footer className="border-t border-border py-6 text-xs text-text-2">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-4 text-center sm:flex-row">
                  <BrandLogo size="sm" />
                  <div>
                    <span className="text-purple-gradient font-medium">Kavro Protocol</span>
                    <span className="mx-2 text-text-3">·</span>
                    Confidential credit-agent infrastructure on 0G
                  </div>
                </div>
              </footer>
            </div>
          </div>
          </ChainGuard>
        </Providers>
      </body>
    </html>
  );
}
