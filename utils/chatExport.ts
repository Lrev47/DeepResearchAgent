export interface ExportMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  reaction?: 'thumbs_up' | 'thumbs_down' | null;
  sources?: any[];
}

export interface ConversationExport {
  title: string;
  messages: ExportMessage[];
  exportDate: string;
  totalMessages: number;
  userMessages: number;
  assistantMessages: number;
}

export function exportConversation(
  messages: any[], 
  format: 'json' | 'txt' | 'csv' = 'json',
  title: string = 'Research Conversation'
): void {
  const exportData: ConversationExport = {
    title,
    messages: messages
      .filter(msg => msg.role !== "system")
      .map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date().toISOString(),
        reaction: msg.reaction || null,
        sources: msg.sources || []
      })),
    exportDate: new Date().toISOString(),
    totalMessages: messages.filter(msg => msg.role !== "system").length,
    userMessages: messages.filter(msg => msg.role === "user").length,
    assistantMessages: messages.filter(msg => msg.role === "assistant").length,
  };

  let content: string;
  let filename: string;
  let mimeType: string;

  switch (format) {
    case 'txt':
      content = formatAsText(exportData);
      filename = `${title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
      mimeType = 'text/plain';
      break;
    
    case 'csv':
      content = formatAsCsv(exportData);
      filename = `${title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
      break;
    
    case 'json':
    default:
      content = JSON.stringify(exportData, null, 2);
      filename = `${title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
      break;
  }

  downloadFile(content, filename, mimeType);
}

function formatAsText(data: ConversationExport): string {
  let text = `${data.title}\n`;
  text += `Exported on: ${new Date(data.exportDate).toLocaleString()}\n`;
  text += `Total Messages: ${data.totalMessages}\n`;
  text += `${'='.repeat(50)}\n\n`;

  data.messages.forEach((msg, index) => {
    const timestamp = new Date(msg.timestamp).toLocaleString();
    const role = msg.role === 'user' ? 'You' : 'AI Assistant';
    
    text += `[${timestamp}] ${role}:\n`;
    text += `${msg.content}\n`;
    
    if (msg.reaction) {
      text += `Reaction: ${msg.reaction === 'thumbs_up' ? '👍' : '👎'}\n`;
    }
    
    if (msg.sources && msg.sources.length > 0) {
      text += `Sources: ${msg.sources.length} references\n`;
    }
    
    text += '\n' + '-'.repeat(30) + '\n\n';
  });

  return text;
}

function formatAsCsv(data: ConversationExport): string {
  const headers = ['Timestamp', 'Role', 'Content', 'Reaction', 'Sources Count'];
  let csv = headers.join(',') + '\n';

  data.messages.forEach(msg => {
    const row = [
      `"${new Date(msg.timestamp).toISOString()}"`,
      `"${msg.role}"`,
      `"${msg.content.replace(/"/g, '""')}"`, // Escape quotes
      `"${msg.reaction || ''}"`,
      `"${msg.sources?.length || 0}"`
    ];
    csv += row.join(',') + '\n';
  });

  return csv;
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Utility to generate conversation summary
export function generateConversationSummary(messages: any[]): string {
  const userMessages = messages.filter(msg => msg.role === 'user');
  const topics = userMessages.map(msg => {
    // Extract key topics from user messages (simplified)
    const words = msg.content.toLowerCase().split(' ');
    return words.filter(word => word.length > 5).slice(0, 3);
  }).flat();

  const uniqueTopics = [...new Set(topics)].slice(0, 5);
  
  return `Research session covering: ${uniqueTopics.join(', ')}`;
}

// Save conversation to localStorage for persistence
export function saveConversationToStorage(messages: any[], title?: string): string {
  const id = `conversation_${Date.now()}`;
  const conversation = {
    id,
    title: title || generateConversationSummary(messages),
    messages,
    savedAt: new Date().toISOString(),
    messageCount: messages.length
  };
  
  localStorage.setItem(id, JSON.stringify(conversation));
  
  // Update conversation index
  const index = JSON.parse(localStorage.getItem('conversation_index') || '[]');
  index.unshift({ id, title: conversation.title, savedAt: conversation.savedAt, messageCount: conversation.messageCount });
  
  // Keep only last 20 conversations
  const limitedIndex = index.slice(0, 20);
  localStorage.setItem('conversation_index', JSON.stringify(limitedIndex));
  
  return id;
}

// Load conversation from localStorage
export function loadConversationFromStorage(id: string): any[] | null {
  const stored = localStorage.getItem(id);
  if (stored) {
    const conversation = JSON.parse(stored);
    return conversation.messages;
  }
  return null;
}

// Get list of saved conversations
export function getSavedConversations(): Array<{id: string, title: string, savedAt: string, messageCount: number}> {
  return JSON.parse(localStorage.getItem('conversation_index') || '[]');
} 