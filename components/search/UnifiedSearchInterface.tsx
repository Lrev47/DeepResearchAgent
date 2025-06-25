'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, Calendar, SortAsc, SortDesc, Loader2 } from "lucide-react";
import { SearchSource, SearchResponse, UnifiedSearchParams } from "@/lib/services/search/unifiedSearch";

interface SourceOption {
  id: SearchSource;
  name: string;
  description: string;
  icon: string;
}

interface UnifiedSearchInterfaceProps {
  onSearchResults: (results: SearchResponse | null) => void;
  onLoading: (isLoading: boolean) => void;
}

export function UnifiedSearchInterface({ onSearchResults, onLoading }: UnifiedSearchInterfaceProps) {
  const [query, setQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<SearchSource[]>(['all']);
  const [availableSources, setAvailableSources] = useState<SourceOption[]>([]);
  const [maxResults, setMaxResults] = useState(20);
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available sources and filters on component mount
  useEffect(() => {
    fetch('/api/search/filters')
      .then(res => res.json())
      .then(data => {
        if (data.sources) {
          setAvailableSources(data.sources);
        }
      })
      .catch(err => console.error('Failed to fetch sources:', err));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    setIsLoading(true);
    onLoading(true);

    try {
      const searchParams: UnifiedSearchParams = {
        query: query.trim(),
        sources: selectedSources,
        maxResults,
        sortBy,
      };

      // Add date range if specified
      if (dateRange.start || dateRange.end) {
        searchParams.dateRange = {
          start: dateRange.start || undefined,
          end: dateRange.end || undefined,
        };
      }

      const response = await fetch('/api/search/unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Search failed');
      }

      const results: SearchResponse = await response.json();
      onSearchResults(results);

    } catch (error) {
      console.error('Search error:', error);
      onSearchResults(null);
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
      onLoading(false);
    }
  };

  const handleSourceToggle = (sourceId: SearchSource) => {
    if (sourceId === 'all') {
      setSelectedSources(['all']);
    } else {
      setSelectedSources(prev => {
        const filtered = prev.filter(s => s !== 'all');
        if (filtered.includes(sourceId)) {
          const newSources = filtered.filter(s => s !== sourceId);
          return newSources.length === 0 ? ['all'] : newSources;
        } else {
          return [...filtered, sourceId];
        }
      });
    }
  };

  const clearFilters = () => {
    setSelectedSources(['all']);
    setMaxResults(20);
    setSortBy('relevance');
    setDateRange({ start: '', end: '' });
    setIsAdvancedOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Multi-Source Research Search
        </CardTitle>
        <CardDescription>
          Search across Google Scholar, arXiv, PubMed, and web sources simultaneously
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your research query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !query.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Source Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Search Sources</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all"
                  checked={selectedSources.includes('all')}
                  onCheckedChange={() => handleSourceToggle('all')}
                />
                <label htmlFor="all" className="text-sm font-medium">
                  🔍 All Sources
                </label>
              </div>
              {availableSources.map((source) => (
                <div key={source.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={source.id}
                    checked={selectedSources.includes(source.id) || selectedSources.includes('all')}
                    onCheckedChange={() => handleSourceToggle(source.id)}
                    disabled={selectedSources.includes('all')}
                  />
                  <label htmlFor={source.id} className="text-sm font-medium">
                    {source.icon} {source.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
            {(selectedSources.length > 1 || maxResults !== 20 || sortBy !== 'relevance' || dateRange.start || dateRange.end) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {isAdvancedOpen && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Max Results */}
                <div className="space-y-2">
                  <label htmlFor="maxResults" className="text-sm font-medium">
                    Max Results
                  </label>
                  <Input
                    id="maxResults"
                    type="number"
                    min="5"
                    max="100"
                    value={maxResults}
                    onChange={(e) => setMaxResults(parseInt(e.target.value) || 20)}
                  />
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label htmlFor="sortBy" className="text-sm font-medium">
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={sortBy === 'relevance' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('relevance')}
                    >
                      <SortAsc className="h-4 w-4 mr-1" />
                      Relevance
                    </Button>
                    <Button
                      type="button"
                      variant={sortBy === 'date' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('date')}
                    >
                      <SortDesc className="h-4 w-4 mr-1" />
                      Date
                    </Button>
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date Range
                  </label>
                  <div className="space-y-2">
                    <Input
                      type="date"
                      placeholder="Start date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                    <Input
                      type="date"
                      placeholder="End date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 