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
  Settings
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
              <AvatarFallback className="text-lg">
                {session.user?.name?.charAt(0)?.toUpperCase() || 
                 session.user?.email?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {session.user?.name?.split(" ")[0] || "Researcher"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Ready to dive into some research?
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button asChild className="h-20 flex-col gap-2">
            <Link href="/agents">
              <Search className="h-6 w-6" />
              <span>Start Research</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col gap-2">
            <Link href="/retrieval">
              <FileText className="h-6 w-6" />
              <span>Upload Documents</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col gap-2">
            <Link href="/structured_output">
              <BarChart3 className="h-6 w-6" />
              <span>Structured Analysis</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col gap-2">
            <Link href="/profile">
              <Settings className="h-6 w-6" />
              <span>Settings</span>
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Research Sessions
              </CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Documents Analyzed
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                +7 from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reports Generated
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                +5 from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Time Saved
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32h</div>
              <p className="text-xs text-muted-foreground">
                vs manual research
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Research Sessions</CardTitle>
              <CardDescription>
                Your latest research activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">AI Automation Trends</p>
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                      Enhanced
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Completed 2 hours ago • 24 messages • 👍 helpful</p>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Clock className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Remote Work Impact Study</p>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                      Multi-turn
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">In progress • 12 messages • Context aware</p>
                </div>
                <Button variant="ghost" size="sm">Continue</Button>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Sustainable Technology Review</p>
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                      Exported
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Completed yesterday • 18 messages • Notion sync</p>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Insights</CardTitle>
              <CardDescription>
                Recent trends and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    Trending Topic
                  </span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  AI-powered automation is gaining significant traction across industries, 
                  with 73% of companies planning implementations in 2024.
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bookmark className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900 dark:text-green-100">
                    Saved Insights
                  </span>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">
                  You have 8 research insights saved across 3 projects. 
                  Consider consolidating them into a comprehensive report.
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-900 dark:text-purple-100">
                    New Chat Features
                  </span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Enhanced chat now includes multi-turn memory, message reactions, 
                  and conversation export. Try the improved research chat on the home page!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 