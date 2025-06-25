export interface ScholarResult {
  title: string;
  authors: string[];
  year: number;
  venue: string;
  citationCount: number;
  url: string;
  snippet: string;
  pdf?: string;
  relatedUrl?: string;
  source: 'google_scholar';
}

export interface ScholarSearchParams {
  query: string;
  year_low?: number;
  year_high?: number;
  sort?: 'relevance' | 'date';
  num_results?: number;
  start?: number;
}

export class GoogleScholarService {
  private baseUrl = 'https://serpapi.com/search';
  private apiKey: string;
  
  constructor() {
    this.apiKey = process.env.SERPAPI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('SERPAPI_API_KEY environment variable is required for Google Scholar');
    }
  }

  async search(params: ScholarSearchParams): Promise<ScholarResult[]> {
    try {
      const searchParams = new URLSearchParams({
        engine: 'google_scholar',
        q: params.query,
        api_key: this.apiKey,
        num: (params.num_results || 10).toString(),
        start: (params.start || 0).toString(),
      });

      if (params.year_low) {
        searchParams.append('as_ylo', params.year_low.toString());
      }
      if (params.year_high) {
        searchParams.append('as_yhi', params.year_high.toString());
      }
      if (params.sort === 'date') {
        searchParams.append('scisbd', '1');
      }

      const response = await fetch(`${this.baseUrl}?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`Google Scholar API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Google Scholar API error: ${data.error}`);
      }

      return this.parseResults(data);
    } catch (error) {
      console.error('Google Scholar search error:', error);
      throw error;
    }
  }

  private parseResults(data: any): ScholarResult[] {
    const results: ScholarResult[] = [];
    
    if (!data.organic_results) {
      return results;
    }

    for (const item of data.organic_results) {
      const result: ScholarResult = {
        title: item.title || 'Untitled',
        authors: this.parseAuthors(item.publication_info?.authors || item.authors || []),
        year: this.extractYear(item.publication_info?.summary || item.snippet || ''),
        venue: item.publication_info?.summary?.split(',')[0] || 'Unknown',
        citationCount: parseInt(item.cited_by?.value || '0'),
        url: item.link || '',
        snippet: item.snippet || '',
        pdf: item.resources?.[0]?.link,
        relatedUrl: item.related_pages_link,
        source: 'google_scholar'
      };
      results.push(result);
    }

    return results;
  }

  private parseAuthors(authorsData: any): string[] {
    if (Array.isArray(authorsData)) {
      return authorsData.map(author => 
        typeof author === 'string' ? author : (author.name || 'Unknown')
      );
    }
    if (typeof authorsData === 'string') {
      return authorsData.split(',').map(a => a.trim());
    }
    return [];
  }

  private extractYear(text: string): number {
    const yearMatch = text.match(/\b(19|20)\d{2}\b/);
    return yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
  }
}

export const googleScholarService = new GoogleScholarService(); 