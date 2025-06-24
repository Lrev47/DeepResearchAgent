"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  Lightbulb, 
  Search, 
  TrendingUp, 
  FileText, 
  Users, 
  BarChart3,
  Zap,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface Suggestion {
  id: string;
  category: string;
  title: string;
  prompt: string;
  icon: React.ReactNode;
  description?: string;
}

const researchSuggestions: Suggestion[] = [
  {
    id: "ai-trends",
    category: "Technology",
    title: "AI Automation Trends",
    prompt: "Research the latest trends in AI automation and their impact on different industries in 2024",
    icon: <TrendingUp className="h-4 w-4" />,
    description: "Explore current AI developments"
  },
  {
    id: "remote-work",
    category: "Business",
    title: "Remote Work Benefits",
    prompt: "What are the proven benefits and challenges of remote work policies for companies and employees?",
    icon: <Users className="h-4 w-4" />,
    description: "Analyze workplace trends"
  },
  {
    id: "sustainable-tech",
    category: "Environment",
    title: "Sustainable Technology",
    prompt: "Research sustainable technology solutions that are making a significant environmental impact",
    icon: <Zap className="h-4 w-4" />,
    description: "Green tech innovations"
  },
  {
    id: "market-analysis",
    category: "Finance",
    title: "Market Analysis",
    prompt: "Analyze the current state of the electric vehicle market and future growth projections",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "Financial market insights"
  },
  {
    id: "research-methods",
    category: "Academic",
    title: "Research Methodologies",
    prompt: "Compare quantitative vs qualitative research methods and when to use each approach",
    icon: <FileText className="h-4 w-4" />,
    description: "Academic research guidance"
  },
  {
    id: "innovation-hubs",
    category: "Technology",
    title: "Global Innovation Hubs",
    prompt: "Research the top global innovation hubs and what makes them successful for startups and tech companies",
    icon: <Search className="h-4 w-4" />,
    description: "Startup ecosystems worldwide"
  }
];

interface SmartSuggestionsProps {
  onSuggestionClick: (prompt: string) => void;
  className?: string;
}

export function SmartSuggestions({ onSuggestionClick, className }: SmartSuggestionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(researchSuggestions.map(s => s.category)));
  
  const filteredSuggestions = selectedCategory 
    ? researchSuggestions.filter(s => s.category === selectedCategory)
    : researchSuggestions;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">Smart Research Suggestions</CardTitle>
        </div>
        <CardDescription>
          Get started with these curated research prompts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Topics
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Suggestions Grid */}
        <div className="grid gap-3">
          {filteredSuggestions.map(suggestion => (
            <div
              key={suggestion.id}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
              onClick={() => onSuggestionClick(suggestion.prompt)}
            >
              <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
                {suggestion.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                    {suggestion.title}
                  </h4>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                    {suggestion.category}
                  </span>
                </div>
                {suggestion.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {suggestion.description}
                  </p>
                )}
              </div>

              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
            </div>
          ))}
        </div>

        {/* Custom Prompt Hint */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Pro Tip
            </span>
          </div>
          <p className="text-xs text-blue-800 dark:text-blue-200">
            For best results, be specific about what you want to research. 
            Include the scope, timeframe, and type of information you need.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 