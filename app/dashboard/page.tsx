"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BarChart3, 
  FileText, 
  Search, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Bookmark,
  Settings,
  Brain,
  MessageSquare,
  Rocket,
  Sparkles,
  Star,
  Zap,
  Activity,
  Database,
  ExternalLink,
  Lightbulb,
  Building,
  Eye,
  Mail,
  Factory,
  Globe,
  Shield,
  Code,
Target
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 sm:w-96 sm:h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-2xl float">
                  <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary to-primary blur-lg opacity-50 -z-10" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text text-center sm:text-left">
                Mission Control
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              ResearchFlow command center - Your gateway to next-generation AI research capabilities.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8">
          <Card className="modern-card glow-primary">
            <CardContent className="p-4 sm:p-6 text-center">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-primary" />
              <div className="text-xl sm:text-3xl font-bold text-primary mb-1">5</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Research</div>
            </CardContent>
          </Card>
          <Card className="modern-card glow-secondary">
            <CardContent className="p-4 sm:p-6 text-center">
              <Database className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-secondary" />
              <div className="text-xl sm:text-3xl font-bold text-secondary mb-1">42</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Reports Generated</div>
            </CardContent>
          </Card>
          <Card className="modern-card">
            <CardContent className="p-4 sm:p-6 text-center">
              <ExternalLink className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-purple-400" />
              <div className="text-xl sm:text-3xl font-bold text-purple-400 mb-1">1.2K</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Sources Analyzed</div>
            </CardContent>
          </Card>
          <Card className="modern-card">
            <CardContent className="p-4 sm:p-6 text-center">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-orange-400" />
              <div className="text-xl sm:text-3xl font-bold text-orange-400 mb-1">98%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Accuracy Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="modern-card gradient-bg mb-8">
          <CardHeader>
            <CardTitle className="text-white text-xl sm:text-2xl flex items-center gap-2 sm:gap-3">
              <Rocket className="h-5 w-5 sm:h-6 sm:w-6" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Button asChild className="btn-secondary h-auto py-3 sm:py-4">
                <a href="/" className="flex flex-col items-center gap-2">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-sm sm:text-base">Start Research</span>
                </a>
              </Button>
              <Button asChild className="btn-secondary h-auto py-3 sm:py-4">
                <a href="/ai-chat" className="flex flex-col items-center gap-2">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-sm sm:text-base">AI Chat</span>
                </a>
              </Button>
              <Button asChild className="btn-secondary h-auto py-3 sm:py-4">
                <a href="/research" className="flex flex-col items-center gap-2">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-sm sm:text-base">Search Papers</span>
                </a>
              </Button>
              <Button asChild className="btn-secondary h-auto py-3 sm:py-4">
                <a href="/retrieval" className="flex flex-col items-center gap-2">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-sm sm:text-base">Upload Docs</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl gradient-text flex items-center gap-2 sm:gap-3">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Platform Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">Deep Research Agent</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Comprehensive multi-source research with iterative analysis
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">AI Chat Interface</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Interactive conversations with advanced AI models
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">Unified Search</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Search across arXiv, PubMed, Google Scholar, and more
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">Notion Integration</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Automatic report delivery to your Notion workspace
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl gradient-text flex items-center gap-2 sm:gap-3">
                <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">Submit Your Query</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Enter your research question and select the desired depth
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">AI Analysis</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Our AI conducts iterative research across multiple sources
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">Generate Report</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Receive comprehensive reports with citations and insights
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">Export & Share</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Download as PDF, Markdown, or automatically save to Notion
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        <Card className="modern-card mb-8">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl gradient-text flex items-center gap-2 sm:gap-3">
              <Code className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Powered by Advanced Technology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 glass rounded-xl hover:glow-primary transition-all">
                <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">TS</span>
                </div>
                <div className="text-xs sm:text-sm font-medium">TypeScript</div>
              </div>
              <div className="text-center p-3 sm:p-4 glass rounded-xl hover:glow-secondary transition-all">
                <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">N</span>
                </div>
                <div className="text-xs sm:text-sm font-medium">Next.js</div>
              </div>
              <div className="text-center p-3 sm:p-4 glass rounded-xl hover:glow-primary transition-all">
                <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">AI</span>
                </div>
                <div className="text-xs sm:text-sm font-medium">OpenAI</div>
              </div>
              <div className="text-center p-3 sm:p-4 glass rounded-xl hover:glow-secondary transition-all">
                <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">LC</span>
                </div>
                <div className="text-xs sm:text-sm font-medium">LangChain</div>
              </div>
              <div className="text-center p-3 sm:p-4 glass rounded-xl hover:glow-primary transition-all">
                <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">TW</span>
                </div>
                <div className="text-xs sm:text-sm font-medium">Tailwind</div>
              </div>
              <div className="text-center p-3 sm:p-4 glass rounded-xl hover:glow-secondary transition-all">
                <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">⚡</span>
                </div>
                <div className="text-xs sm:text-sm font-medium">Vercel</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <Card className="modern-card glow-primary">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl gradient-text flex items-center gap-2 sm:gap-3">
                <Building className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                AISynthLab LLC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Founded in 2024, AISynthLab LLC is dedicated to democratizing access to advanced AI research capabilities. 
                We believe that powerful research tools should be accessible to researchers, students, and professionals worldwide.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                  <span className="text-foreground">Mission: Democratize AI research capabilities</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-secondary flex-shrink-0" />
                  <span className="text-foreground">Vision: AI research accessible to all</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400 flex-shrink-0" />
                  <a href="mailto:hello@aisynthlab.com" className="text-purple-400 hover:underline">
                    hello@aisynthlab.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card glow-secondary">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl gradient-text flex items-center gap-2 sm:gap-3">
                <Factory className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                CompanyFactory Platform
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                ResearchFlow is powered by CompanyFactory, our rapid AI application development platform. 
                CompanyFactory enables us to quickly build and deploy sophisticated AI-powered applications 
                with enterprise-grade reliability and performance.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 flex-shrink-0" />
                  <span className="text-foreground">Rapid development and deployment</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                  <span className="text-foreground">Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0" />
                  <span className="text-foreground">Scalable cloud infrastructure</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 