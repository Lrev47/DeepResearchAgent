import { DOMParser } from 'xmldom';

export interface PubmedResult {
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  publishedDate: string;
  pmid: string;
  pmcId?: string;
  doi?: string;
  url: string;
  keywords: string[];
  source: 'pubmed';
}

export interface PubmedSearchParams {
  query: string;
  dateType?: 'pdat' | 'edat' | 'mdat'; // publication, entrez, modification date
  minDate?: string; // YYYY/MM/DD format
  maxDate?: string; // YYYY/MM/DD format
  retmax?: number;
  retstart?: number;
  sort?: 'relevance' | 'pub_date' | 'Author' | 'JournalName';
}

export class PubmedService {
  private baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
  private apiKey?: string;
  
  constructor() {
    this.apiKey = process.env.PUBMED_API_KEY; // Optional but recommended for higher rate limits
  }

  async search(params: PubmedSearchParams): Promise<PubmedResult[]> {
    try {
      // Step 1: Search for article IDs
      const ids = await this.searchIds(params);
      
      if (ids.length === 0) {
        return [];
      }

      // Step 2: Fetch detailed information for the IDs
      const results = await this.fetchDetails(ids);
      
      return results;
    } catch (error) {
      console.error('PubMed search error:', error);
      throw error;
    }
  }

  private async searchIds(params: PubmedSearchParams): Promise<string[]> {
    const searchParams = new URLSearchParams({
      db: 'pubmed',
      term: params.query,
      retmax: (params.retmax || 10).toString(),
      retstart: (params.retstart || 0).toString(),
      retmode: 'json',
    });

    if (this.apiKey) {
      searchParams.append('api_key', this.apiKey);
    }

    if (params.dateType && (params.minDate || params.maxDate)) {
      let dateFilter = '';
      if (params.minDate && params.maxDate) {
        dateFilter = `${params.minDate}:${params.maxDate}[${params.dateType}]`;
      } else if (params.minDate) {
        dateFilter = `${params.minDate}:3000/12/31[${params.dateType}]`;
      } else if (params.maxDate) {
        dateFilter = `1900/01/01:${params.maxDate}[${params.dateType}]`;
      }
      
      if (dateFilter) {
        searchParams.set('term', `${params.query} AND ${dateFilter}`);
      }
    }

    if (params.sort) {
      searchParams.append('sort', params.sort);
    }

    const response = await fetch(`${this.baseUrl}/esearch.fcgi?${searchParams}`);
    
    if (!response.ok) {
      throw new Error(`PubMed search API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.esearchresult?.errorlist) {
      throw new Error(`PubMed API error: ${JSON.stringify(data.esearchresult.errorlist)}`);
    }

    return data.esearchresult?.idlist || [];
  }

  private async fetchDetails(ids: string[]): Promise<PubmedResult[]> {
    if (ids.length === 0) return [];

    const fetchParams = new URLSearchParams({
      db: 'pubmed',
      id: ids.join(','),
      retmode: 'xml',
      rettype: 'abstract',
    });

    if (this.apiKey) {
      fetchParams.append('api_key', this.apiKey);
    }

    const response = await fetch(`${this.baseUrl}/efetch.fcgi?${fetchParams}`);
    
    if (!response.ok) {
      throw new Error(`PubMed fetch API error: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    return this.parseXmlResults(xmlText);
  }

  private parseXmlResults(xmlText: string): PubmedResult[] {
    const results: PubmedResult[] = [];
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'text/xml');
      const articles = doc.getElementsByTagName('PubmedArticle');

      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const medlineCitation = article.getElementsByTagName('MedlineCitation')[0];
        const pubmedData = article.getElementsByTagName('PubmedData')[0];
        
        if (!medlineCitation) continue;

        const result: PubmedResult = {
          title: this.getArticleTitle(medlineCitation),
          authors: this.getAuthors(medlineCitation),
          abstract: this.getAbstract(medlineCitation),
          journal: this.getJournal(medlineCitation),
          publishedDate: this.getPublicationDate(medlineCitation),
          pmid: this.getPmid(medlineCitation),
          pmcId: this.getPmcId(pubmedData),
          doi: this.getDoi(medlineCitation),
          url: this.getPubmedUrl(this.getPmid(medlineCitation)),
          keywords: this.getKeywords(medlineCitation),
          source: 'pubmed'
        };
        
        results.push(result);
      }
    } catch (error) {
      console.error('Error parsing PubMed XML:', error);
      throw new Error('Failed to parse PubMed response');
    }

    return results;
  }

  private getArticleTitle(citation: Element): string {
    const titleElement = citation.querySelector('Article ArticleTitle');
    return titleElement?.textContent?.trim() || 'Untitled';
  }

  private getAuthors(citation: Element): string[] {
    const authors: string[] = [];
    const authorElements = citation.querySelectorAll('AuthorList Author');
    
    authorElements.forEach(author => {
      const lastName = author.querySelector('LastName')?.textContent || '';
      const foreName = author.querySelector('ForeName')?.textContent || '';
      const initials = author.querySelector('Initials')?.textContent || '';
      
      if (lastName) {
        const fullName = foreName ? `${foreName} ${lastName}` : `${initials} ${lastName}`;
        authors.push(fullName.trim());
      }
    });
    
    return authors;
  }

  private getAbstract(citation: Element): string {
    const abstractElement = citation.querySelector('Article Abstract AbstractText');
    return abstractElement?.textContent?.trim() || '';
  }

  private getJournal(citation: Element): string {
    const journalElement = citation.querySelector('Article Journal Title');
    return journalElement?.textContent?.trim() || 'Unknown Journal';
  }

  private getPublicationDate(citation: Element): string {
    const pubDateElement = citation.querySelector('Article Journal JournalIssue PubDate');
    if (!pubDateElement) return '';
    
    const year = pubDateElement.querySelector('Year')?.textContent || '';
    const month = pubDateElement.querySelector('Month')?.textContent || '';
    const day = pubDateElement.querySelector('Day')?.textContent || '';
    
    return [year, month, day].filter(Boolean).join('-');
  }

  private getPmid(citation: Element): string {
    const pmidElement = citation.querySelector('PMID');
    return pmidElement?.textContent || '';
  }

  private getPmcId(pubmedData: Element): string | undefined {
    const pmcElement = pubmedData?.querySelector('ArticleIdList ArticleId[IdType="pmc"]');
    return pmcElement?.textContent || undefined;
  }

  private getDoi(citation: Element): string | undefined {
    const doiElement = citation.querySelector('Article ELocationID[EIdType="doi"]');
    return doiElement?.textContent || undefined;
  }

  private getPubmedUrl(pmid: string): string {
    return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  }

  private getKeywords(citation: Element): string[] {
    const keywords: string[] = [];
    const keywordElements = citation.querySelectorAll('KeywordList Keyword');
    
    keywordElements.forEach(keyword => {
      const text = keyword.textContent?.trim();
      if (text) keywords.push(text);
    });
    
    return keywords;
  }
}

export const pubmedService = new PubmedService(); 