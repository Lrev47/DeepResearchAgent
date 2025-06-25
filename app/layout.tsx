import "./globals.css";
import { Inter } from "next/font/google";
import { ActiveLink } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { GithubIcon, Sparkles, Factory, Menu, X } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { UserNav } from "@/components/auth/UserNav";
import { ThemeProvider } from "@/components/theme/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>ResearchFlow - AI Research Platform by AISynthLab</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta
          name="description"
          content="Next-generation AI research platform by AISynthLab LLC. Deep investigation capabilities, multi-source analysis, and automated report generation to Notion."
        />
        <meta property="og:title" content="ResearchFlow - AI Research Platform by AISynthLab" />
        <meta
          property="og:description"
          content="Next-generation AI research platform by AISynthLab LLC. Deep investigation capabilities, multi-source analysis, and automated report generation to Notion."
        />
        <meta property="og:image" content="/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ResearchFlow - AI Research Platform by AISynthLab" />
        <meta
          name="twitter:description"
          content="Next-generation AI research platform by AISynthLab LLC. Deep investigation capabilities, multi-source analysis, and automated report generation to Notion."
        />
        <meta name="twitter:image" content="/images/og-image.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider>
            <NuqsAdapter>
              <div className="min-h-screen relative overflow-hidden">
                {/* Background Effects */}
                <div className="fixed inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-cyan-900/20" />
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                {/* Navigation */}
                <nav className="relative z-50 p-2 sm:p-4">
                  <div className="max-w-7xl mx-auto">
                    <div className="glass rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-4 border border-white/10">
                      {/* Mobile Header */}
                      <div className="flex items-center justify-between lg:hidden">
                        <a
                          href="/"
                          className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
                        >
                          <div className="relative">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
                              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary blur-md opacity-50 -z-10" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-lg sm:text-xl font-bold gradient-text">
                              ResearchFlow
                            </span>
                            <span className="text-xs text-muted-foreground -mt-1 hidden sm:block">
                              by AISynthLab LLC
                            </span>
                          </div>
                        </a>

                        <div className="flex items-center gap-2">
                          <UserNav />
                          <Button asChild className="btn-secondary p-2">
                            <a
                              href="https://github.com/aisynthlab/research-flow"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <GithubIcon className="size-4" />
                            </a>
                          </Button>
                        </div>
                      </div>

                      {/* Desktop Header */}
                      <div className="hidden lg:flex items-center justify-between">
                        <div className="flex items-center gap-8">
                          {/* Logo */}
                          <a
                            href="/"
                            className="flex items-center gap-3 hover:scale-105 transition-transform duration-300"
                          >
                            <div className="relative">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
                                <Sparkles className="w-6 h-6 text-white" />
                              </div>
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary blur-md opacity-50 -z-10" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xl font-bold gradient-text">
                                ResearchFlow
                              </span>
                              <span className="text-xs text-muted-foreground -mt-1">
                                by AISynthLab LLC
                              </span>
                            </div>
                          </a>

                          {/* Navigation Links */}
                          <div className="flex items-center gap-2">
                            <ActiveLink href="/">🔬 Research</ActiveLink>
                            <ActiveLink href="/ai-chat">💬 Chat</ActiveLink>
                            <ActiveLink href="/research">🔍 Search</ActiveLink>
                            <ActiveLink href="/retrieval">📚 Docs</ActiveLink>
                            <ActiveLink href="/dashboard">📊 Dashboard</ActiveLink>
                          </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                          {/* Powered by CompanyFactory */}
                          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl border border-white/10">
                            <Factory className="w-4 h-4 text-secondary" />
                            <span className="text-xs text-muted-foreground">
                              Powered by <span className="gradient-text font-semibold">CompanyFactory</span>
                            </span>
                          </div>
                          
                          <UserNav />
                          <Button asChild className="btn-secondary">
                            <a
                              href="https://github.com/aisynthlab/research-flow"
                              rel="noopener noreferrer"
                              target="_blank"
                              className="flex items-center gap-2"
                            >
                              <GithubIcon className="size-4" />
                              <span>GitHub</span>
                            </a>
                          </Button>
                        </div>
                      </div>

                      {/* Mobile Navigation Menu */}
                      <div className="lg:hidden mt-3 pt-3 border-t border-white/10">
                        <div className="grid grid-cols-2 gap-2">
                          <ActiveLink href="/">🔬 Research</ActiveLink>
                          <ActiveLink href="/ai-chat">💬 Chat</ActiveLink>
                          <ActiveLink href="/research">🔍 Search</ActiveLink>
                          <ActiveLink href="/retrieval">📚 Docs</ActiveLink>
                        </div>
                        <div className="mt-2">
                          <ActiveLink href="/dashboard">📊 Dashboard</ActiveLink>
                        </div>
                        
                        {/* Mobile Powered by */}
                        <div className="flex items-center justify-center gap-2 glass px-3 py-2 rounded-xl border border-white/10 mt-3">
                          <Factory className="w-4 h-4 text-secondary" />
                          <span className="text-xs text-muted-foreground">
                            Powered by <span className="gradient-text font-semibold">CompanyFactory</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>

                {/* Main Content */}
                <main className="relative z-10 pb-8">
                  <div className="max-w-7xl mx-auto px-2 sm:px-4">
                    <div className="glass rounded-xl sm:rounded-3xl border border-white/10 min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-120px)] overflow-hidden">
                      <div className="relative h-full">
                        {children}
                      </div>
                    </div>
                  </div>
                </main>

                {/* Floating Elements - Hide on mobile */}
                <div className="hidden sm:block fixed bottom-8 right-8 z-50">
                  <div className="glass rounded-full p-3 border border-white/20 hover:scale-110 transition-transform cursor-pointer glow-primary">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Footer - Responsive */}
                <footer className="fixed bottom-2 sm:bottom-4 left-2 sm:left-4 z-50">
                  <div className="glass rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 border border-white/10">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                      <span className="hidden sm:inline">© 2024</span>
                      <span className="gradient-text font-semibold text-xs">AISynthLab</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">All rights reserved</span>
                    </div>
                  </div>
                </footer>
              </div>
              <Toaster />
            </NuqsAdapter>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
