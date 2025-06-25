'use client';

import { useState } from 'react';
import { UnifiedSearchInterface } from '@/components/search/UnifiedSearchInterface';
import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';
import { SearchResponse } from '@/lib/services/search/unifiedSearch';
import { GuideInfoBox } from '@/components/guide/GuideInfoBox';

export default function ResearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const InfoCard = (
    <GuideInfoBox>
      <ul>
        <li>
          🔬
          <span className="ml-2">
            <strong>Multi-Source Research Search:</strong> Search across Google Scholar, arXiv, PubMed, and web sources simultaneously
          </span>
        </li>
        <li>
          🎯
          <span className="ml-2">
            <strong>Advanced Filtering:</strong> Use date ranges, source selection, and sorting options to refine your results
          </span>
        </li>
        <li>
          📊
          <span className="ml-2">
            <strong>Comprehensive Results:</strong> Get academic papers, preprints, biomedical literature, and web content in one search
          </span>
        </li>
        <li>
          💡
          <span className="ml-2">
            Try searching for: <code>&quot;machine learning in healthcare&quot;</code>, <code>&quot;quantum computing applications&quot;</code>, or <code>&quot;climate change mitigation&quot;</code>
          </span>
        </li>
      </ul>
    </GuideInfoBox>
  );

  return (
    <div className="mx-auto w-full max-w-7xl py-6 px-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Multi-Source Research Engine
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Leverage the power of multiple academic databases and search engines to conduct comprehensive research 
          across various domains and sources.
        </p>
      </div>

      {/* Info Card */}
      {!searchResults && !isLoading && InfoCard}

      {/* Search Interface */}
      <UnifiedSearchInterface 
        onSearchResults={setSearchResults}
        onLoading={setIsLoading}
      />

      {/* Results Display */}
      <SearchResultsDisplay 
        searchResults={searchResults}
        isLoading={isLoading}
      />
    </div>
  );
} 