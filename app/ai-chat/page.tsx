'use client';

import { ResearchChatWindow } from '@/components/research/ResearchChatWindow';
import { GuideInfoBox } from '@/components/guide/GuideInfoBox';

export default function AIChatPage() {
  const handleSaveChat = async (messages: any[]) => {
    // Here you could implement saving to Supabase or other database
    console.log('Saving chat messages:', messages);
    // For now, just log - this will be implemented when we add chat history storage
  };

  const InfoCard = (
    <GuideInfoBox>
      <ul>
        <li>
          🧠
          <span className="ml-2">
            <strong>Professional AI Research Assistant:</strong> Get comprehensive, evidence-based research on any topic with proper citations and sources.
          </span>
        </li>
        <li>
          🔍
          <span className="ml-2">
            <strong>Web Search Integration:</strong> The AI can search the web in real-time to provide current information and verify facts.
          </span>
        </li>
        <li>
          📝
          <span className="ml-2">
            <strong>Markdown Support:</strong> Responses include formatted text, code blocks, tables, and proper citations for better readability.
          </span>
        </li>
        <li>
          📊
          <span className="ml-2">
            <strong>Export & Feedback:</strong> Export conversations to Markdown, provide feedback on responses, and save research sessions.
          </span>
        </li>
        <li>
          💡
          <span className="ml-2">
            Try asking: <code>&quot;Research the latest developments in AI safety&quot;</code>, <code>&quot;What are the key trends in renewable energy for 2024?&quot;</code>, or <code>&quot;Analyze the current state of quantum computing research&quot;</code>
          </span>
        </li>
      </ul>
    </GuideInfoBox>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 text-center border-b">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          AI Research Chat
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Professional AI assistant for comprehensive research and analysis
        </p>
      </div>

      <div className="flex-1 flex">
        {/* Info panel for new users */}
        <div className="w-80 border-r bg-gray-50 dark:bg-gray-800 p-4 overflow-y-auto">
          {InfoCard}
          
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Research Capabilities</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Academic paper analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Market research & trends</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Technical documentation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Current events analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Data interpretation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main chat interface */}
        <div className="flex-1">
          <ResearchChatWindow
            endpoint="/api/chat/research"
            title="AI Research Assistant"
            description="Professional research chat with web search and citations"
            placeholder="Ask a research question..."
            onSaveChat={handleSaveChat}
          />
        </div>
      </div>
    </div>
  );
} 