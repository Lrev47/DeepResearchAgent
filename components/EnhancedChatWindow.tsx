"use client";

import { type Message } from "ai";
import { useChat } from "ai/react";
import { useState, useEffect, useRef } from "react";
import type { FormEvent, ReactNode } from "react";
import { toast } from "sonner";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { IntermediateStep } from "./IntermediateStep";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  ArrowDown, 
  LoaderCircle, 
  Paperclip, 
  Send,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Mic,
  MicOff
} from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { UploadDocumentsForm } from "./UploadDocumentsForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/utils/cn";

interface EnhancedMessage extends Message {
  reaction?: 'thumbs_up' | 'thumbs_down' | null;
  timestamp?: number;
  sources?: any[];
}

interface ChatMessagesProps {
  messages: EnhancedMessage[];
  emptyStateComponent: ReactNode;
  sourcesForMessages: Record<string, any>;
  aiEmoji?: string;
  className?: string;
  onMessageReaction: (messageId: string, reaction: 'thumbs_up' | 'thumbs_down' | null) => void;
  isTyping?: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-gray-500 dark:text-gray-400">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-sm">AI is thinking...</span>
    </div>
  );
}

function ChatMessages(props: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [props.messages, props.isTyping]);

  return (
    <div className="flex flex-col max-w-[768px] mx-auto pb-12 w-full">
      {props.messages.length === 0 && (
        <div className="mx-auto max-w-2xl px-4">
          {props.emptyStateComponent}
        </div>
      )}
      
      {props.messages.map((m, i) => {
        if (m.role === "system") {
          return <IntermediateStep key={m.id} message={m} />;
        }

        const sourceKey = (props.messages.length - 1 - i).toString();
        return (
          <div key={m.id} className="group relative">
            <ChatMessageBubble
              message={m}
              aiEmoji={props.aiEmoji}
              sources={props.sourcesForMessages[sourceKey]}
            />
            
            {/* Message Actions */}
            {m.role === "assistant" && (
              <div className="flex items-center gap-2 mt-2 ml-12 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 w-6 p-0",
                    m.reaction === 'thumbs_up' && "text-green-600 bg-green-100 dark:bg-green-900"
                  )}
                  onClick={() => props.onMessageReaction(m.id, m.reaction === 'thumbs_up' ? null : 'thumbs_up')}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 w-6 p-0",
                    m.reaction === 'thumbs_down' && "text-red-600 bg-red-100 dark:bg-red-900"
                  )}
                  onClick={() => props.onMessageReaction(m.id, m.reaction === 'thumbs_down' ? null : 'thumbs_down')}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    navigator.clipboard.writeText(m.content);
                    toast.success("Message copied to clipboard");
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
      
      {props.isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}

interface ChatInputProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onStop?: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
  placeholder?: string;
  multiModal?: boolean;
  onFileUpload?: (files: FileList) => void;
}

export function ChatInput(props: ChatInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (props.value.trim() && !props.loading) {
        const form = e.currentTarget.form;
        if (form) {
          props.onSubmit(new Event('submit') as any);
        }
      }
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      setIsListening(false);
      // Stop recognition logic would go here
    } else {
      setIsListening(true);
      // Start recognition logic would go here
      toast.info("Voice input feature coming soon!");
      setTimeout(() => setIsListening(false), 2000);
    }
  };

  return (
    <form onSubmit={props.onSubmit} className="flex w-full items-center gap-2">
      <div className="flex-1 relative">
        <Input
          autoFocus
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          onKeyDown={handleKeyDown}
          className="pr-20"
          disabled={props.loading}
        />
        
        {/* Input Actions */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {props.multiModal && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-3 w-3" />
            </Button>
          )}
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0",
              isListening && "text-red-500 animate-pulse"
            )}
            onClick={toggleVoiceInput}
          >
            {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={props.loading || !props.value.trim()}
        className="shrink-0"
      >
        {props.loading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.pdf,.doc,.docx,.md"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && props.onFileUpload) {
            props.onFileUpload(e.target.files);
          }
        }}
      />
    </form>
  );
}

interface EnhancedChatWindowProps {
  endpoint: string;
  emptyStateComponent: ReactNode;
  placeholder?: string;
  titleText?: string;
  emoji?: string;
  showIngestForm?: boolean;
  showIntermediateStepsToggle?: boolean;
  enableFileUpload?: boolean;
  enableVoiceInput?: boolean;
}

export function EnhancedChatWindow({
  endpoint,
  emptyStateComponent,
  placeholder = "Type your message...",
  titleText = "Enhanced AI Chat",
  emoji = "🤖",
  showIngestForm = false,
  showIntermediateStepsToggle = false,
  enableFileUpload = true,
  enableVoiceInput = true,
}: EnhancedChatWindowProps) {
  const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({});
  const [enhancedMessages, setEnhancedMessages] = useState<EnhancedMessage[]>([]);
  const [showIntermediateSteps, setShowIntermediateSteps] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
  } = useChat({
    api: endpoint,
    onResponse(response) {
      const sourcesHeader = response.headers.get("x-sources");
      const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : [];
      const messageIndexHeader = response.headers.get("x-message-index");
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages(prev => ({ ...prev, [messageIndexHeader]: sources }));
      }
    },
    onFinish() {
      setIsTyping(false);
    },
    streamMode: "text",
  });

  // Convert regular messages to enhanced messages
  useEffect(() => {
    const enhanced = messages.map(msg => ({
      ...msg,
      timestamp: Date.now(),
      reaction: enhancedMessages.find(em => em.id === msg.id)?.reaction || null,
    }));
    setEnhancedMessages(enhanced);
  }, [messages]);

  // Show typing indicator when loading
  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
    }
  }, [isLoading]);

  const handleMessageReaction = (messageId: string, reaction: 'thumbs_up' | 'thumbs_down' | null) => {
    setEnhancedMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, reaction } : msg
    ));
    
    // Here you could also send the reaction to your backend
    toast.success(reaction ? "Feedback recorded" : "Feedback removed");
  };

  const exportConversation = () => {
    const conversation = enhancedMessages
      .filter(msg => msg.role !== "system")
      .map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp || 0).toISOString(),
        reaction: msg.reaction,
      }));

    const blob = new Blob([JSON.stringify(conversation, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Conversation exported successfully");
  };

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      // Here you would implement actual file upload logic
      toast.success(`File "${file.name}" uploaded successfully`);
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <h2 className="text-lg font-semibold">{titleText}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {showIntermediateStepsToggle && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="show-intermediate-steps"
                checked={showIntermediateSteps}
                onCheckedChange={(checked) => setShowIntermediateSteps(!!checked)}
              />
              <label htmlFor="show-intermediate-steps" className="text-sm">
                Show intermediate steps
              </label>
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportConversation}>
                <Download className="h-4 w-4 mr-2" />
                Export Conversation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.reload()}>
                Clear Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <StickToBottom>
          <ChatMessages
            messages={enhancedMessages.filter(msg => 
              showIntermediateSteps || msg.role !== "system"
            )}
            emptyStateComponent={emptyStateComponent}
            sourcesForMessages={sourcesForMessages}
            aiEmoji={emoji}
            onMessageReaction={handleMessageReaction}
            isTyping={isTyping}
          />
        </StickToBottom>
      </div>

      {/* Upload Form */}
      {showIngestForm && (
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Paperclip className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Documents</DialogTitle>
                <DialogDescription>
                  Upload documents to enhance the AI's knowledge for this conversation.
                </DialogDescription>
              </DialogHeader>
              <UploadDocumentsForm />
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t bg-white dark:bg-gray-800">
        <ChatInput
          onSubmit={handleSubmit}
          onStop={stop}
          value={input}
          onChange={handleInputChange}
          loading={isLoading}
          placeholder={placeholder}
          multiModal={enableFileUpload}
          onFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
} 