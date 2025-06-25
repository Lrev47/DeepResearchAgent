import { googleScholarService, ScholarResult, ScholarSearchParams } from './googleScholar';
import { arxivService, ArxivResult, ArxivSearchParams } from './arxiv';
import { pubmedService, PubmedResult, PubmedSearchParams } from './pubmed';

export type SearchSource = 'google_scholar' | 'arxiv' | 'pubmed' | 'web' | 'all';

export type UnifiedSearchResult = ScholarResult | ArxivResult | PubmedResult | WebResult;

export interface WebResult {
  title: string;
  url: string;
  snippet: string;
  displayUrl: string;
  source: 'web';
}

export interface UnifiedSearchParams {
  query: string;
  sources: SearchSource[];
  maxResults?: number;
  dateRange?: {
    start?: string;
    end?: string;
  };
  sortBy?: 'relevance' | 'date';
  filters?: {
    contentType?: 'academic' | 'news' | 'general';
    domain?: string[];
  };
}

export interface SearchResponse {
  results: UnifiedSearchResult[];
  totalResults: number;
  searchTime: number;
  sources: {
    [key in SearchSource]?: {
      count: number;
      hasMore: boolean;
      error?: string;
    };
  };
}

export class UnifiedSearchService {
  private serpApiKey: string;

  constructor() {
    this.serpApiKey = process.env.SERPAPI_API_KEY || '';
  }

  async search(params: UnifiedSearchParams): Promise<SearchResponse> {
    const startTime = Date.now();
    const results: UnifiedSearchResult[] = [];
    const sources: SearchResponse['sources'] = {};

    // Determine which sources to search
    const sourcesToSearch = params.sources.includes('all') 
      ? ['google_scholar', 'arxiv', 'pubmed', 'web'] as SearchSource[]
      : params.sources;

    // Execute searches in parallel
    const searchPromises = sourcesToSearch.map(source => 
      this.searchSource(source, params).catch(error => ({ source, error, results: [] }))
    );

    const searchResults = await Promise.allSettled(searchPromises);

    // Process results
    for (const result of searchResults) {
      if (result.status === 'fulfilled') {
        const searchResult = result.value;
        if ('error' in searchResult) {
          sources[searchResult.source] = {
            count: 0,
            hasMore: false,
            error: searchResult.error.message
          };
        } else {
          results.push(...searchResult.results);
          sources[searchResult.source] = {
            count: searchResult.results.length,
            hasMore: searchResult.results.length === (params.maxResults || 10)
          };
        }
      } else {
        console.error('Search promise rejected:', result.reason);
      }
    }

    // Sort and limit results
    const sortedResults = this.sortResults(results, params.sortBy || 'relevance');
    const limitedResults = sortedResults.slice(0, params.maxResults || 50);

    const searchTime = Date.now() - startTime;

    return {
      results: limitedResults,
      totalResults: results.length,
      searchTime,
      sources
    };
  }

  private async searchSource(
    source: SearchSource, 
    params: UnifiedSearchParams
  ): Promise<{ source: SearchSource; results: UnifiedSearchResult[] }> {
    const maxResults = Math.min(params.maxResults || 10, 20); // Limit per source

    switch (source) {
      case 'google_scholar':
        return this.searchGoogleScholar(params, maxResults);
      
      case 'arxiv':
        return this.searchArxiv(params, maxResults);
      
      case 'pubmed':
        return this.searchPubmed(params, maxResults);
      
      case 'web':
        return this.searchWeb(params, maxResults);
      
      default:
        throw new Error(`Unsupported search source: ${source}`);
    }
  }

  private async searchGoogleScholar(
    params: UnifiedSearchParams, 
    maxResults: number
  ): Promise<{ source: SearchSource; results: ScholarResult[] }> {
    try {
      const scholarParams: ScholarSearchParams = {
        query: params.query,
        num_results: maxResults,
        sort: params.sortBy === 'date' ? 'date' : 'relevance'
      };

      if (params.dateRange?.start) {
        const year = new Date(params.dateRange.start).getFullYear();
        scholarParams.year_low = year;
      }
      if (params.dateRange?.end) {
        const year = new Date(params.dateRange.end).getFullYear();
        scholarParams.year_high = year;
      }

      const results = await googleScholarService.search(scholarParams);
      return { source: 'google_scholar', results };
    } catch (error) {
      console.warn('Google Scholar search failed, continuing with other sources:', error);
      return { source: 'google_scholar', results: [] };
    }
  }

  private async searchArxiv(
    params: UnifiedSearchParams, 
    maxResults: number
  ): Promise<{ source: SearchSource; results: ArxivResult[] }> {
    const arxivParams: ArxivSearchParams = {
      query: params.query,
      maxResults,
      sortBy: params.sortBy === 'date' ? 'lastUpdatedDate' : 'relevance'
    };

    const results = await arxivService.search(arxivParams);
    return { source: 'arxiv', results };
  }

  private async searchPubmed(
    params: UnifiedSearchParams, 
    maxResults: number
  ): Promise<{ source: SearchSource; results: PubmedResult[] }> {
    const pubmedParams: PubmedSearchParams = {
      query: params.query,
      retmax: maxResults,
      sort: params.sortBy === 'date' ? 'pub_date' : 'relevance'
    };

    if (params.dateRange?.start) {
      pubmedParams.minDate = params.dateRange.start.replace(/-/g, '/');
    }
    if (params.dateRange?.end) {
      pubmedParams.maxDate = params.dateRange.end.replace(/-/g, '/');
    }

    const results = await pubmedService.search(pubmedParams);
    return { source: 'pubmed', results };
  }

  private async searchWeb(
    params: UnifiedSearchParams, 
    maxResults: number
  ): Promise<{ source: SearchSource; results: WebResult[] }> {
    if (!this.serpApiKey) {
      throw new Error('SERPAPI_API_KEY is required for web search');
    }

    const searchParams = new URLSearchParams({
      engine: 'google',
      q: params.query,
      api_key: this.serpApiKey,
      num: maxResults.toString(),
    });

    if (params.dateRange?.start && params.dateRange?.end) {
      const startDate = new Date(params.dateRange.start);
      const endDate = new Date(params.dateRange.end);
      searchParams.append('tbs', `cdr:1,cd_min:${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()},cd_max:${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`);
    }

    const response = await fetch(`https://serpapi.com/search?${searchParams}`);
    
    if (!response.ok) {
      throw new Error(`Web search API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Web search API error: ${data.error}`);
    }

    const results: WebResult[] = (data.organic_results || []).map((item: any) => ({
      title: item.title || 'Untitled',
      url: item.link || '',
      snippet: item.snippet || '',
      displayUrl: item.displayed_link || item.link || '',
      source: 'web' as const
    }));

    return { source: 'web', results };
  }

  private sortResults(results: UnifiedSearchResult[], sortBy: 'relevance' | 'date'): UnifiedSearchResult[] {
    if (sortBy === 'date') {
      return results.sort((a, b) => {
        const dateA = this.extractDate(a);
        const dateB = this.extractDate(b);
        return dateB.getTime() - dateA.getTime();
      });
    }
    
    // For relevance, maintain the order returned by each service
    // Could implement a more sophisticated relevance scoring here
    return results;
  }

  private extractDate(result: UnifiedSearchResult): Date {
    switch (result.source) {
      case 'google_scholar':
        return new Date(result.year, 0, 1);
      case 'arxiv':
        return new Date(result.publishedDate);
      case 'pubmed':
        return new Date(result.publishedDate || new Date());
      case 'web':
        return new Date(); // Web results don't have publish dates in basic SERP
      default:
        return new Date();
    }
  }

  // Method to get available categories/filters for each source
  getAvailableFilters(): { [key in SearchSource]?: any } {
    return {
      arxiv: {
        categories: [
          'cs.AI', 'cs.CL', 'cs.CV', 'cs.LG', 'cs.NE', // Computer Science
          'physics.bio-ph', 'q-bio.BM', 'q-bio.QM', // Biology/Physics
          'math.ST', 'stat.ML', 'stat.ME' // Mathematics/Statistics
        ]
      },
      pubmed: {
        dateTypes: ['pdat', 'edat', 'mdat'],
        sortOptions: ['relevance', 'pub_date', 'Author', 'JournalName']
      },
      google_scholar: {
        sortOptions: ['relevance', 'date']
      },
      web: {
        engines: ['google', 'bing', 'duckduckgo']
      }
    };
  }
}

export const unifiedSearchService = new UnifiedSearchService(); 