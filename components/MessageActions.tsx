"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  Download,
  Share,
  Bookmark,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

interface MessageActionsProps {
  messageId: string;
  content: string;
  reaction?: 'thumbs_up' | 'thumbs_down' | null;
  onReaction?: (messageId: string, reaction: 'thumbs_up' | 'thumbs_down' | null) => void;
  onBookmark?: (messageId: string) => void;
  className?: string;
  isVisible?: boolean;
}

export function MessageActions({
  messageId,
  content,
  reaction = null,
  onReaction,
  onBookmark,
  className,
  isVisible = true
}: MessageActionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleThumbsUp = () => {
    const newReaction = reaction === 'thumbs_up' ? null : 'thumbs_up';
    onReaction?.(messageId, newReaction);
  };

  const handleThumbsDown = () => {
    const newReaction = reaction === 'thumbs_down' ? null : 'thumbs_down';
    onReaction?.(messageId, newReaction);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Message copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy message");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Research Insight',
          text: content,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        handleCopy(); // Fallback to copy
      }
    } else {
      handleCopy(); // Fallback to copy
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(messageId);
    toast.success(isBookmarked ? "Bookmark removed" : "Message bookmarked");
  };

  const handleExportMessage = () => {
    const messageData = {
      id: messageId,
      content,
      timestamp: new Date().toISOString(),
      reaction,
    };

    const blob = new Blob([JSON.stringify(messageData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `message-${messageId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Message exported successfully");
  };

  return (
    <div className={cn(
      "flex items-center gap-2 transition-opacity duration-200",
      isVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100",
      className
    )}>
      {/* Quick Actions */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900",
          reaction === 'thumbs_up' && "text-green-600 bg-green-100 dark:bg-green-900"
        )}
        onClick={handleThumbsUp}
        title="Helpful"
      >
        <ThumbsUp className="h-3 w-3" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900",
          reaction === 'thumbs_down' && "text-red-600 bg-red-100 dark:bg-red-900"
        )}
        onClick={handleThumbsDown}
        title="Not helpful"
      >
        <ThumbsDown className="h-3 w-3" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={handleCopy}
        title="Copy message"
      >
        <Copy className="h-3 w-3" />
      </Button>

      {/* More Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            title="More actions"
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share Message
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleBookmark}>
            <Bookmark className={cn(
              "h-4 w-4 mr-2",
              isBookmarked && "fill-current"
            )} />
            {isBookmarked ? "Remove Bookmark" : "Bookmark Message"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportMessage}>
            <Download className="h-4 w-4 mr-2" />
            Export Message
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Quick reaction buttons for mobile
export function QuickReactions({
  messageId,
  reaction,
  onReaction,
  className
}: Pick<MessageActionsProps, 'messageId' | 'reaction' | 'onReaction' | 'className'>) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 px-2 text-xs",
          reaction === 'thumbs_up' && "text-green-600 bg-green-100 dark:bg-green-900"
        )}
        onClick={() => onReaction?.(messageId, reaction === 'thumbs_up' ? null : 'thumbs_up')}
      >
        <ThumbsUp className="h-3 w-3 mr-1" />
        Helpful
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 px-2 text-xs",
          reaction === 'thumbs_down' && "text-red-600 bg-red-100 dark:bg-red-900"
        )}
        onClick={() => onReaction?.(messageId, reaction === 'thumbs_down' ? null : 'thumbs_down')}
      >
        <ThumbsDown className="h-3 w-3 mr-1" />
        Not helpful
      </Button>
    </div>
  );
} 