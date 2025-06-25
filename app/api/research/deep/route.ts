import { NextRequest, NextResponse } from "next/server";
import { conductComprehensiveResearch, conductQuickResearch } from "@/lib/services/research/deepResearch";
import { notionService } from "@/lib/services/notion/notionService";

export const runtime = "edge";

export interface DeepResearchRequest {
  query: string;
  depth?: 'quick' | 'standard' | 'comprehensive';
  context?: string;
  focusAreas?: string[];
  deliverToNotion?: boolean;
  notionDatabaseId?: string;
}

export interface DeepResearchResponse {
  success: boolean;
  reportId: string;
  report?: any;
  notionPageId?: string;
  estimatedTime?: number;
  error?: string;
}

/**
 * Deep Research API Endpoint
 * Conducts iterative, multi-step research like ChatGPT's Deep Research feature
 */
export async function POST(req: NextRequest): Promise<NextResponse<DeepResearchResponse>> {
  try {
    const body: DeepResearchRequest = await req.json();

    // Validate required fields
    if (!body.query || body.query.trim().length === 0) {
      return NextResponse.json({
        success: false,
        reportId: '',
        error: 'Query is required'
      }, { status: 400 });
    }

    console.log(`🔍 Starting deep research: "${body.query}"`);
    const startTime = Date.now();

    // Conduct deep research based on requested depth
    let report;
    if (body.depth === 'comprehensive') {
      report = await conductComprehensiveResearch(
        body.query, 
        body.context, 
        body.focusAreas
      );
    } else if (body.depth === 'standard') {
      // Standard research with medium depth
      const agent = (await import("@/lib/services/research/deepResearch")).createDeepResearchAgent();
      report = await agent.conductDeepResearch({
        originalQuery: body.query,
        context: body.context,
        depth: 'standard',
        focusAreas: body.focusAreas
      });
    } else {
      // Quick research
      report = await conductQuickResearch(body.query);
    }

    const researchTime = Date.now() - startTime;
    console.log(`✅ Research completed in ${researchTime}ms`);

    // Optionally deliver to Notion
    let notionPageId: string | undefined;
    if (body.deliverToNotion) {
      try {
        console.log(`📝 Delivering report to Notion...`);
        notionPageId = await notionService.createResearchReport(
          report,
          body.notionDatabaseId
        );
        console.log(`✅ Report delivered to Notion: ${notionPageId}`);
      } catch (notionError) {
        console.error('Notion delivery failed:', notionError);
        // Don't fail the entire request if Notion delivery fails
      }
    }

    return NextResponse.json({
      success: true,
      reportId: report.id,
      report: {
        id: report.id,
        query: report.query,
        executiveSummary: report.executiveSummary,
        keyFindings: report.keyFindings,
        methodology: report.methodology,
        limitations: report.limitations,
        recommendations: report.recommendations,
        confidence: report.confidence,
        estimatedReadTime: report.estimatedReadTime,
        researchSteps: report.researchSteps, // Return full steps, not just count
        sources: report.sources, // Return full sources, not just count
        createdAt: report.createdAt,
        totalDuration: report.totalDuration
      },
      notionPageId,
      estimatedTime: researchTime
    });

  } catch (error: any) {
    console.error('Deep research error:', error);

    return NextResponse.json({
      success: false,
      reportId: '',
      error: error.message || 'Research failed. Please try again.',
    }, { status: 500 });
  }
}

/**
 * Get research report by ID (for future implementation with database storage)
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const reportId = url.searchParams.get('id');

  if (!reportId) {
    return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
  }

  // For now, return a placeholder
  // In the future, this would fetch from database
  return NextResponse.json({
    message: 'Report retrieval not yet implemented',
    reportId
  }, { status: 501 });
} 