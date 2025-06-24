import "./globals.css";
import { Public_Sans } from "next/font/google";
import { ActiveLink } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { UserNav } from "@/components/auth/UserNav";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/ui/logo";

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Deep Research Agent - AI-Powered Research Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta
          name="description"
          content="Advanced AI research assistant that leverages multiple search engines, document analysis, and intelligent agents to deliver comprehensive research reports automatically to your Notion workspace."
        />
        <meta property="og:title" content="Deep Research Agent - AI-Powered Research Assistant" />
        <meta
          property="og:description"
          content="Advanced AI research assistant that leverages multiple search engines, document analysis, and intelligent agents to deliver comprehensive research reports automatically to your Notion workspace."
        />
        <meta property="og:image" content="/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Deep Research Agent - AI-Powered Research Assistant" />
        <meta
          name="twitter:description"
          content="Advanced AI research assistant that leverages multiple search engines, document analysis, and intelligent agents to deliver comprehensive research reports automatically to your Notion workspace."
        />
        <meta name="twitter:image" content="/images/og-image.png" />
      </head>
      <body className={publicSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <NuqsAdapter>
              <div className="bg-secondary grid grid-rows-[auto,1fr] h-[100dvh]">
                <div className="grid grid-cols-[1fr,auto] gap-2 p-4">
                  <div className="flex gap-4 flex-col md:flex-row md:items-center">
                    <a
                      href="/"
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <Logo />
                    </a>
                    <nav className="flex gap-1 flex-col md:flex-row">
                      <ActiveLink href="/">🏠 Home</ActiveLink>
                      <ActiveLink href="/dashboard">📊 Dashboard</ActiveLink>
                      <ActiveLink href="/agents">🔍 Research Agents</ActiveLink>
                      <ActiveLink href="/retrieval">📚 Document Analysis</ActiveLink>
                      <ActiveLink href="/retrieval_agents">
                        🤖 Smart Retrieval
                      </ActiveLink>
                      <ActiveLink href="/structured_output">
                        📋 Structured Output
                      </ActiveLink>
                      <ActiveLink href="/ai_sdk">
                        ⚡ React Components
                      </ActiveLink>
                      <ActiveLink href="/langgraph">🕸️ Agent Workflows</ActiveLink>
                    </nav>
                  </div>

                  <div className="flex justify-center items-center gap-3">
                    <ThemeToggle />
                    <UserNav />
                    <Button asChild variant="outline" size="default">
                      <a
                        href="https://github.com/langchain-ai/langchain-nextjs-template"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <GithubIcon className="size-3" />
                        <span>GitHub</span>
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="bg-background mx-4 relative grid rounded-t-2xl border border-input border-b-0">
                  <div className="absolute inset-0">{children}</div>
                </div>
              </div>
              <Toaster />
            </NuqsAdapter>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
