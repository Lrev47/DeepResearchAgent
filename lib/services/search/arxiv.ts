export interface ArxivResult {
  title: string;
  authors: string[];
  abstract: string;
  publishedDate: string;
  updatedDate: string;
  categories: string[];
  url: string;
  pdfUrl: string;
  arxivId: string;
  source: 'arxiv';
}

export interface ArxivSearchParams {
  query: string;
  category?: string;
  sortBy?: 'relevance' | 'lastUpdatedDate' | 'submittedDate';
  sortOrder?: 'ascending' | 'descending';
  maxResults?: number;
  start?: number;
}

export class ArxivService {
  private baseUrl = 'http://export.arxiv.org/api/query';
  
  async search(params: ArxivSearchParams): Promise<ArxivResult[]> {
    try {
      const searchParams = new URLSearchParams({
        search_query: this.buildSearchQuery(params),
        max_results: (params.maxResults || 10).toString(),
        start: (params.start || 0).toString(),
      });

      if (params.sortBy) {
        searchParams.append('sortBy', params.sortBy);
      }
      if (params.sortOrder) {
        searchParams.append('sortOrder', params.sortOrder);
      }

      const response = await fetch(`${this.baseUrl}?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`arXiv API error: ${response.status} ${response.statusText}`);
      }

      const xmlText = await response.text();
      return this.parseXmlResults(xmlText);
    } catch (error) {
      console.error('arXiv search error:', error);
      throw error;
    }
  }

  private buildSearchQuery(params: ArxivSearchParams): string {
    let query = `all:${params.query}`;
    
    if (params.category) {
      query += ` AND cat:${params.category}`;
    }
    
    return query;
  }

  private parseXmlResults(xmlText: string): ArxivResult[] {
    const results: ArxivResult[] = [];
    
    try {
      // Simple XML parsing using DOMParser (available in Node.js with proper polyfill)
      // For production, consider using a proper XML parser like 'xml2js'
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'text/xml');
      const entries = doc.getElementsByTagName('entry');

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        
        const result: ArxivResult = {
          title: this.getElementText(entry, 'title').replace(/\s+/g, ' ').trim(),
          authors: this.parseAuthors(entry),
          abstract: this.getElementText(entry, 'summary').replace(/\s+/g, ' ').trim(),
          publishedDate: this.getElementText(entry, 'published'),
          updatedDate: this.getElementText(entry, 'updated'),
          categories: this.parseCategories(entry),
          url: this.getElementText(entry, 'id'),
          pdfUrl: this.getPdfUrl(entry),
          arxivId: this.extractArxivId(this.getElementText(entry, 'id')),
          source: 'arxiv'
        };
        
        results.push(result);
      }
    } catch (error) {
      console.error('Error parsing arXiv XML:', error);
      throw new Error('Failed to parse arXiv response');
    }

    return results;
  }

  private getElementText(parent: Element, tagName: string): string {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? element.textContent || '' : '';
  }

  private parseAuthors(entry: Element): string[] {
    const authors: string[] = [];
    const authorElements = entry.getElementsByTagName('author');
    
    for (let i = 0; i < authorElements.length; i++) {
      const nameElement = authorElements[i].getElementsByTagName('name')[0];
      if (nameElement && nameElement.textContent) {
        authors.push(nameElement.textContent);
      }
    }
    
    return authors;
  }

  private parseCategories(entry: Element): string[] {
    const categories: string[] = [];
    const categoryElements = entry.getElementsByTagName('category');
    
    for (let i = 0; i < categoryElements.length; i++) {
      const term = categoryElements[i].getAttribute('term');
      if (term) {
        categories.push(term);
      }
    }
    
    return categories;
  }

  private getPdfUrl(entry: Element): string {
    const links = entry.getElementsByTagName('link');
    
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const type = link.getAttribute('type');
      if (type === 'application/pdf') {
        return link.getAttribute('href') || '';
      }
    }
    
    // If no PDF link found, construct it from the arXiv ID
    const id = this.getElementText(entry, 'id');
    const arxivId = this.extractArxivId(id);
    return `http://arxiv.org/pdf/${arxivId}.pdf`;
  }

  private extractArxivId(url: string): string {
    const match = url.match(/abs\/(.+)$/);
    return match ? match[1] : '';
  }
}

import { DOMParser } from 'xmldom';

export const arxivService = new ArxivService(); 