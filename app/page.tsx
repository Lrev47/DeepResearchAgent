import { ChatWindow } from "@/components/ChatWindow";
import { GuideInfoBox } from "@/components/guide/GuideInfoBox";
// import { SmartSuggestions } from "@/components/SmartSuggestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { 
  Search, 
  FileText, 
  Brain, 
  Zap, 
  Users, 
  Database,
  BarChart3,
  CheckCircle 
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Logo className="scale-150" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Advanced AI Research Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Leverage multiple search engines, document analysis, and intelligent agents to deliver 
            comprehensive research reports automatically to your Notion workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href="/agents">🔍 Start Research</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <Search className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Multi-Source Research</CardTitle>
              <CardDescription>
                Search across multiple engines, academic databases, and knowledge sources simultaneously
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <FileText className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Document Analysis</CardTitle>
              <CardDescription>
                Upload and analyze PDFs, Word documents, and text files with AI-powered insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <Brain className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Intelligent Agents</CardTitle>
              <CardDescription>
                Specialized AI agents for different research domains and methodologies
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <Zap className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle>Notion Integration</CardTitle>
              <CardDescription>
                Automatically deliver research reports to your Notion workspace
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-red-600 mb-2" />
              <CardTitle>Citation Tracking</CardTitle>
              <CardDescription>
                Automatic source tracking and citation management in multiple formats
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <Users className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle>Collaboration</CardTitle>
              <CardDescription>
                Share research projects and collaborate with team members seamlessly
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Start Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Quick Start Options
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Try the Research Chat</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Start with a simple conversation and get AI-powered research assistance.
              </p>
                             <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
                 {/* Enhanced Chat Header */}
                 <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                   <div className="flex items-center gap-2">
                     <span className="text-xl">🧠</span>
                     <span className="font-semibold">Enhanced AI Research Chat</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs">
                     <span className="px-2 py-1 bg-white/20 rounded">
                       Multi-turn Memory
                     </span>
                     <span className="px-2 py-1 bg-white/20 rounded">
                       Smart Responses
                     </span>
                   </div>
                 </div>
                 
                 <ChatWindow
                   endpoint="api/chat"
                   emoji="🧠"
                   placeholder="Ask me anything you'd like to research... (Enhanced with conversation memory)"
                   emptyStateComponent={
                     <GuideInfoBox>
                       <div className="space-y-3">
                         <p className="text-sm text-gray-600 dark:text-gray-300">
                           ✨ Enhanced Research Chat Features:
                         </p>
                         <div className="grid grid-cols-1 gap-2 text-xs">
                           <div className="flex items-center gap-2">
                             <CheckCircle className="h-3 w-3 text-green-500" />
                             <span>Multi-turn conversation memory</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="h-3 w-3 text-green-500" />
                             <span>Context-aware responses</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="h-3 w-3 text-green-500" />
                             <span>Research-optimized AI prompts</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <CheckCircle className="h-3 w-3 text-blue-500" />
                             <span>Export conversation (coming soon)</span>
                           </div>
                         </div>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                           Try: &ldquo;Research the latest trends in AI automation&rdquo;
                         </p>
                       </div>
                     </GuideInfoBox>
                   }
                 />
               </div>
            </div>
            <div className="space-y-6">
              {/* Smart Suggestions - Coming Soon */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">Pro Tip</span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Try asking specific research questions like &ldquo;Research the latest trends in AI automation&rdquo; or 
                  &ldquo;What are the benefits of remote work policies?&rdquo; Smart suggestions feature coming soon!
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Explore Advanced Features</h3>
                <div className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/agents">
                      <Search className="h-4 w-4 mr-2" />
                      Research Agents - Multi-source search
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/retrieval">
                      <FileText className="h-4 w-4 mr-2" />
                      Document Analysis - Upload & analyze files
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/structured_output">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Structured Output - Formatted responses
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/retrieval_agents">
                      <Brain className="h-4 w-4 mr-2" />
                      Smart Retrieval - AI + Document search
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Powered by Leading AI Technology
          </h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">OpenAI GPT-4</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">LangChain</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">Supabase Vector DB</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">Next.js 15</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">Notion API</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">SERP API</span>
          </div>
        </div>
      </div>
    </div>
  );
}
