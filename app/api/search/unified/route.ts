import { NextRequest, NextResponse } from 'next/server';
import { unifiedSearchService, UnifiedSearchParams, SearchSource } from '@/lib/services/search/unifiedSearch';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required parameters
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      );
    }

    if (!body.sources || !Array.isArray(body.sources)) {
      return NextResponse.json(
        { error: 'Sources parameter is required and must be an array' },
        { status: 400 }
      );
    }

    // Validate sources
    const validSources: SearchSource[] = ['google_scholar', 'arxiv', 'pubmed', 'web', 'all'];
    const invalidSources = body.sources.filter((source: string) => !validSources.includes(source as SearchSource));
    
    if (invalidSources.length > 0) {
      return NextResponse.json(
        { error: `Invalid sources: ${invalidSources.join(', ')}. Valid sources are: ${validSources.join(', ')}` },
        { status: 400 }
      );
    }

    // Build search parameters
    const searchParams: UnifiedSearchParams = {
      query: body.query.trim(),
      sources: body.sources,
      maxResults: Math.min(body.maxResults || 20, 100), // Cap at 100 results
      sortBy: body.sortBy || 'relevance',
    };

    // Add optional parameters
    if (body.dateRange) {
      searchParams.dateRange = {
        start: body.dateRange.start,
        end: body.dateRange.end
      };
    }

    if (body.filters) {
      searchParams.filters = body.filters;
    }

    // Execute search
    const results = await unifiedSearchService.search(searchParams);

    return NextResponse.json(results, { status: 200 });

  } catch (error: any) {
    console.error('Unified search error:', error);

    // Handle specific API errors
    if (error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Search service configuration error. Please check API keys.' },
        { status: 503 }
      );
    }

    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Internal search error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Handle simple GET requests for testing
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  const sources = searchParams.get('sources')?.split(',') || ['web'];

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const results = await unifiedSearchService.search({
      query,
      sources: sources as SearchSource[],
      maxResults: 10
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error('GET search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
} 