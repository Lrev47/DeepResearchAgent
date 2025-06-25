'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ExternalLink, 
  Calendar, 
  Users, 
  BookOpen, 
  Download,
  AlertCircle,
  Clock,
  Filter
} from "lucide-react";
import { SearchResponse, UnifiedSearchResult, SearchSource } from "@/lib/services/search/unifiedSearch";

interface SearchResultsDisplayProps {
  searchResults: SearchResponse | null;
  isLoading: boolean;
}

export function SearchResultsDisplay({ searchResults, isLoading }: SearchResultsDisplayProps) {
  const [selectedSource, setSelectedSource] = useState<SearchSource | 'all'>('all');
  const [showFullAbstract, setShowFullAbstract] = useState<Set<string>>(new Set());

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Searching across multiple sources...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!searchResults) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <AlertCircle className="h-5 w-5" />
            <span>No search performed yet. Enter a query above to get started.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { results, totalResults, searchTime, sources } = searchResults;

  const filteredResults = selectedSource === 'all' 
    ? results 
    : results.filter(result => result.source === selectedSource);

  const toggleAbstract = (resultId: string) => {
    const newSet = new Set(showFullAbstract);
    if (newSet.has(resultId)) {
      newSet.delete(resultId);
    } else {
      newSet.add(resultId);
    }
    setShowFullAbstract(newSet);
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getSourceIcon = (source: SearchSource) => {
    switch (source) {
      case 'google_scholar': return '🎓';
      case 'arxiv': return '📄';
      case 'pubmed': return '🧬';
      case 'web': return '🌐';
      default: return '📄';
    }
  };

  const getSourceColor = (source: SearchSource) => {
    switch (source) {
      case 'google_scholar': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'arxiv': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pubmed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'web': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const renderResult = (result: UnifiedSearchResult, index: number) => {
    const resultId = `${result.source}-${index}`;
    const isAbstractExpanded = showFullAbstract.has(resultId);

    return (
      <Card key={resultId} className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getSourceColor(result.source)}>
                  {getSourceIcon(result.source)} {result.source.replace('_', ' ')}
                </Badge>
                {result.source === 'google_scholar' && 'citationCount' in result && (
                  <Badge variant="outline">
                    {result.citationCount} citations
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg leading-tight">
                <a 
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {result.title}
                </a>
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Authors and Date */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            {'authors' in result && result.authors.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{result.authors.slice(0, 3).join(', ')}{result.authors.length > 3 ? ' et al.' : ''}</span>
              </div>
            )}
            
            {result.source === 'google_scholar' && 'year' in result && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{result.year}</span>
              </div>
            )}
            
            {result.source === 'arxiv' && 'publishedDate' in result && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(result.publishedDate).toLocaleDateString()}</span>
              </div>
            )}
            
            {result.source === 'pubmed' && 'publishedDate' in result && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{result.publishedDate}</span>
              </div>
            )}
          </div>

          {/* Venue/Journal */}
          {'venue' in result && result.venue && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <BookOpen className="h-4 w-4" />
              <span>{result.venue}</span>
            </div>
          )}
          
          {'journal' in result && result.journal && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <BookOpen className="h-4 w-4" />
              <span>{result.journal}</span>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Abstract/Snippet */}
          <div className="space-y-2">
            {'abstract' in result && result.abstract ? (
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {isAbstractExpanded ? result.abstract : truncateText(result.abstract)}
                </p>
                {result.abstract.length > 200 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAbstract(resultId)}
                    className="mt-1 p-0 h-auto text-blue-600 hover:text-blue-800"
                  >
                    {isAbstractExpanded ? 'Show less' : 'Show more'}
                  </Button>
                )}
              </div>
            ) : 'snippet' in result && result.snippet ? (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {result.snippet}
              </p>
            ) : null}
          </div>

          {/* Additional Actions */}
          <div className="flex items-center gap-2 mt-4">
            {'pdfUrl' in result && result.pdfUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </a>
              </Button>
            )}
            
            {'pdf' in result && result.pdf && (
              <Button variant="outline" size="sm" asChild>
                <a href={result.pdf} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </a>
              </Button>
            )}

            {'categories' in result && result.categories.length > 0 && (
              <div className="flex gap-1">
                {result.categories.slice(0, 3).map((category, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Found {totalResults} results across {Object.keys(sources).length} sources
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{searchTime}ms</span>
              </div>
            </div>
            
            {/* Source Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
                             <select
                 value={selectedSource}
                 onChange={(e) => setSelectedSource(e.target.value as SearchSource | 'all')}
                 className="text-sm border rounded px-2 py-1"
                 aria-label="Filter results by source"
               >
                <option value="all">All Sources ({results.length})</option>
                {Object.entries(sources).map(([source, info]) => (
                  <option key={source} value={source}>
                    {getSourceIcon(source as SearchSource)} {source.replace('_', ' ')} ({info.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Source Status */}
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(sources).map(([source, info]) => (
              <Badge
                key={source}
                variant={info.error ? 'destructive' : 'default'}
                className="text-xs"
              >
                {getSourceIcon(source as SearchSource)} {source.replace('_', ' ')}: {info.count}
                {info.error && ' (error)'}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredResults.length > 0 ? (
          filteredResults.map((result, index) => renderResult(result, index))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No results found for the selected source.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 