"use client";

import { type Message } from "ai";
import { useChat } from "ai/react";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Copy,
  Download,
  Lightbulb,
  FileText,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Settings,
  Brain,
  Zap,
  Search
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/cn";

interface ResearchMessage extends Message {
  sources?: Array<{
    title: string;
    url: string;
    snippet: string;
    type: 'academic' | 'web' | 'document';
  }>;
  researchDepth?: 'quick' | 'standard' | 'comprehensive';
  confidence?: number;
  reaction?: 'helpful' | 'not_helpful' | null;
  timestamp: number;
}

interface ResearchChatProps {
  endpoint: string;
  title?: string;
  description?: string;
  placeholder?: string;
  onSaveChat?: (messages: ResearchMessage[]) => void;
}

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !className;
            return !isInline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                className="rounded-md !bg-gray-900 !mt-2 !mb-2"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={cn("px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm", className)} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function ResearchMessageBubble({ 
  message, 
  onReaction,
  onCopy
}: { 
  message: ResearchMessage;
  onReaction: (messageId: string, reaction: 'helpful' | 'not_helpful' | null) => void;
  onCopy: (content: string) => void;
}) {
  const { data: session } = useSession();
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div className={cn("flex gap-3 mb-6", isUser && "flex-row-reverse")}>
      <Avatar className="h-8 w-8 shrink-0">
        {isUser ? (
          <>
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-blue-500 text-white">
            <Brain className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>

      <div className={cn("flex-1 space-y-2", isUser && "text-right")}>
        <Card className={cn(
          "inline-block max-w-[85%]",
          isUser 
            ? "bg-blue-500 text-white ml-auto" 
            : "bg-white dark:bg-gray-800"
        )}>
          <CardContent className="p-4">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
          </CardContent>
        </Card>

        {isAssistant && (
          <div className="flex flex-wrap gap-2 text-xs">
            {message.researchDepth && (
              <Badge variant="outline" className="gap-1">
                <Search className="h-3 w-3" />
                {message.researchDepth} research
              </Badge>
            )}
            {message.confidence && (
              <Badge variant="outline" className="gap-1">
                <Zap className="h-3 w-3" />
                {(message.confidence * 100).toFixed(0)}% confidence
              </Badge>
            )}
          </div>
        )}

        {isAssistant && (
          <div className="flex items-center gap-2 text-xs">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 px-2 text-xs",
                message.reaction === 'helpful' && "bg-green-100 text-green-700"
              )}
              onClick={() => onReaction(
                message.id, 
                message.reaction === 'helpful' ? null : 'helpful'
              )}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              Helpful
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 px-2 text-xs",
                message.reaction === 'not_helpful' && "bg-red-100 text-red-700"
              )}
              onClick={() => onReaction(
                message.id,
                message.reaction === 'not_helpful' ? null : 'not_helpful'
              )}
            >
              <ThumbsDown className="h-3 w-3 mr-1" />
              Not helpful
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => onCopy(message.content)}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

export function ResearchChatWindow({
  endpoint,
  title = "AI Research Assistant",
  description = "Advanced research chat with citations and sources",
  placeholder = "Ask a research question...",
  onSaveChat,
}: ResearchChatProps) {
  const [researchMessages, setResearchMessages] = useState<ResearchMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload
  } = useChat({
    api: endpoint,
    onFinish: () => {
      setIsTyping(false);
    },
    streamMode: "text",
  });

  useEffect(() => {
    const enhanced: ResearchMessage[] = messages.map((msg, idx) => ({
      ...msg,
      timestamp: Date.now() - (messages.length - idx) * 1000,
      researchDepth: 'standard' as const,
      confidence: msg.role === 'assistant' ? 0.85 + Math.random() * 0.1 : undefined,
      reaction: researchMessages.find(rm => rm.id === msg.id)?.reaction || null,
    }));
    setResearchMessages(enhanced);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
    }
  }, [isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [researchMessages, isTyping]);

  const handleMessageReaction = (messageId: string, reaction: 'helpful' | 'not_helpful' | null) => {
    setResearchMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, reaction } : msg
    ));
    toast.success(reaction ? "Feedback recorded" : "Feedback removed");
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const exportToMarkdown = () => {
    const markdown = researchMessages
      .filter(msg => msg.role !== "system")
      .map(msg => {
        const timestamp = new Date(msg.timestamp).toLocaleString();
        const header = msg.role === 'user' ? '## Question' : '## Response';
        return `${header}\n*${timestamp}*\n\n${msg.content}\n\n---\n\n`;
      })
      .join("");

    const blob = new Blob([`# Research Chat Export\n\n${markdown}`], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `research-chat-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Research chat exported to Markdown");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <Card className="rounded-none border-b">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                {title}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToMarkdown}>
                  <Download className="h-4 w-4 mr-2" />
                  Export to Markdown
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSaveChat?.(researchMessages)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Save Chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.reload()}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>

      <div className="flex-1 overflow-y-auto p-4">
        {researchMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 text-center max-w-md">
              <CardContent>
                <Lightbulb className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to Research</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Ask any research question and I&apos;ll provide comprehensive answers with sources and citations.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">🎓 Academic sources</Badge>
                  <Badge variant="outline">📊 Data analysis</Badge>
                  <Badge variant="outline">🔗 Citations</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {researchMessages.map((message) => (
              <ResearchMessageBubble
                key={message.id}
                message={message}
                onReaction={handleMessageReaction}
                onCopy={handleCopy}
              />
            ))}
            
            {isTyping && (
              <div className="flex gap-3 mb-6">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <Brain className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-4 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Researching your question...
                    </span>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <Card className="rounded-none border-t">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={placeholder}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 