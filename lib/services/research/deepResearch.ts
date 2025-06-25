import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { unifiedSearchService, UnifiedSearchResult } from "../search/unifiedSearch";

// Enhanced types for comprehensive deep research
export interface ResearchQuery {
  originalQuery: string;
  context?: string;
  depth: 'quick' | 'standard' | 'comprehensive';
  focusAreas?: string[];
  excludeTopics?: string[];
}

export interface ResearchStep {
  stepNumber: number;
  query: string;
  rationale: string;
  sources: string[];
  results: SearchResult[];
  keyFindings: string[];
  questionsRaised: string[];
  duration: number;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: 'arxiv' | 'pubmed' | 'google_scholar' | 'web';
  relevanceScore: number;
  keyPoints: string[];
  publishDate?: string;
  authors?: string[];
}

export interface ResearchReport {
  id: string;
  query: ResearchQuery;
  researchSteps: ResearchStep[];
  executiveSummary: string;
  keyFindings: string[];
  methodology: string;
  limitations: string[];
  recommendations: string[];
  sources: SearchResult[];
  confidence: number;
  createdAt: Date;
  estimatedReadTime: number;
  totalDuration: number;
}

// Enhanced Zod schemas for comprehensive output
const ResearchPlanSchema = z.object({
  researchSteps: z.array(z.object({
    stepNumber: z.number(),
    query: z.string().min(10),
    rationale: z.string().min(50),
    expectedSources: z.array(z.string()),
    focusArea: z.string(),
    priority: z.enum(['high', 'medium', 'low'])
  })),
  methodology: z.string().min(100),
  estimatedDuration: z.string(),
  researchObjectives: z.array(z.string())
});

const FindingsAnalysisSchema = z.object({
  keyFindings: z.array(z.string().min(20)),
  questionsRaised: z.array(z.string()),
  nextSearchQueries: z.array(z.string()),
  confidenceLevel: z.number().min(0).max(1),
  needsMoreResearch: z.boolean(),
  informationGaps: z.array(z.string()),
  sourceQuality: z.enum(['excellent', 'good', 'moderate', 'poor'])
});

const ReportGenerationSchema = z.object({
  executiveSummary: z.string().min(200),
  keyFindings: z.array(z.string().min(30)),
  methodology: z.string().min(150),
  limitations: z.array(z.string().min(20)),
  recommendations: z.array(z.string().min(25)),
  confidence: z.number().min(0).max(1),
  estimatedReadTime: z.number().min(3),
  futureResearchDirections: z.array(z.string())
});

export class DeepResearchAgent {
  private llm: ChatOpenAI;
  private researchPlanParser: StructuredOutputParser<typeof ResearchPlanSchema>;
  private findingsParser: StructuredOutputParser<typeof FindingsAnalysisSchema>;
  private reportParser: StructuredOutputParser<typeof ReportGenerationSchema>;

  constructor() {
    this.llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.2, // Slightly higher for more creative analysis
      maxTokens: 4000, // Increase for more comprehensive responses
    });

    this.researchPlanParser = StructuredOutputParser.fromZodSchema(ResearchPlanSchema);
    this.findingsParser = StructuredOutputParser.fromZodSchema(FindingsAnalysisSchema);
    this.reportParser = StructuredOutputParser.fromZodSchema(ReportGenerationSchema);
  }

  async conductDeepResearch(query: ResearchQuery): Promise<ResearchReport> {
    const startTime = Date.now();
    console.log(`🔍 Starting comprehensive deep research for: "${query.originalQuery}"`);
    
    // Step 1: Generate detailed research plan
    const researchPlan = await this.generateResearchPlan(query);
    console.log(`📋 Generated comprehensive research plan with ${researchPlan.researchSteps.length} steps`);

    // Step 2: Execute iterative research with enhanced analysis
    const researchSteps: ResearchStep[] = [];
    let accumulatedKnowledge = "";

    for (const planStep of researchPlan.researchSteps) {
      const stepStart = Date.now();
      console.log(`🔍 Executing Step ${planStep.stepNumber}: ${planStep.query}`);
      
      const step = await this.executeResearchStep(
        planStep,
        accumulatedKnowledge,
        query
      );
      
      step.duration = Date.now() - stepStart;
      researchSteps.push(step);
      accumulatedKnowledge += this.formatStepForContext(step);

      // Enhanced analysis with gap identification
      const analysis = await this.analyzeFindings(step, accumulatedKnowledge, query);
      
      if (analysis.needsMoreResearch && 
          analysis.nextSearchQueries.length > 0 && 
          researchSteps.length < 8) { // Limit max steps
        console.log(`🔄 Follow-up research needed: ${analysis.informationGaps.join(', ')}`);
        
        // Add strategic follow-up steps
        for (const followUpQuery of analysis.nextSearchQueries.slice(0, 2)) {
          const followUpStart = Date.now();
          const followUpStep = await this.executeResearchStep(
            {
              stepNumber: researchSteps.length + 1,
              query: followUpQuery,
              rationale: `Follow-up investigation addressing information gaps: ${analysis.informationGaps.join(', ')}`,
              expectedSources: this.selectOptimalSources(analysis.informationGaps),
              focusArea: "gap analysis",
              priority: 'high' as const
            },
            accumulatedKnowledge,
            query
          );
          
          followUpStep.duration = Date.now() - followUpStart;
          researchSteps.push(followUpStep);
          accumulatedKnowledge += this.formatStepForContext(followUpStep);
        }
      }
    }

    // Step 3: Generate comprehensive professional report
    console.log(`📊 Generating comprehensive research report with ${researchSteps.length} research steps`);
    const report = await this.generateReport(query, researchSteps, accumulatedKnowledge);

    const totalDuration = Date.now() - startTime;

    return {
      id: `research_${Date.now()}`,
      query,
      researchSteps,
      ...report,
      sources: this.consolidateSources(researchSteps),
      createdAt: new Date(),
      totalDuration
    };
  }

  private async generateResearchPlan(query: ResearchQuery) {
    const planPrompt = `You are an expert research strategist tasked with creating a comprehensive, multi-step research plan that rivals the depth and quality of advanced research systems.

RESEARCH QUERY: "${query.originalQuery}"
RESEARCH DEPTH: ${query.depth}
CONTEXT: ${query.context || 'None provided'}
FOCUS AREAS: ${query.focusAreas?.join(', ') || 'General comprehensive coverage'}

YOUR MISSION:
Create a strategic research plan that will produce publication-quality insights through systematic investigation. This research should be comprehensive enough to inform strategic decisions and advance understanding of the topic.

RESEARCH METHODOLOGY REQUIREMENTS:
1. **Multi-Perspective Analysis**: Approach the topic from technical, economic, social, and practical perspectives
2. **Temporal Coverage**: Include historical context, current state, and future implications
3. **Source Diversity**: Plan for academic papers, expert opinions, empirical data, case studies, and industry reports
4. **Progressive Depth**: Each step should build upon previous findings and dive deeper into emerging themes
5. **Critical Analysis**: Include plans for evaluating contradictory information and assessing source credibility

RESEARCH STEP CATEGORIES TO CONSIDER:
- Current State Analysis: Latest developments, key players, market conditions
- Historical Context: Evolution, key milestones, lessons learned
- Technical Deep-Dive: Mechanisms, methodologies, technical specifications
- Comparative Analysis: Alternatives, competing approaches, benchmarking
- Expert Perspectives: Industry leaders, academic researchers, practitioners
- Empirical Evidence: Studies, data, statistics, case studies
- Future Implications: Trends, predictions, potential impact
- Practical Applications: Implementation strategies, use cases, success stories

QUALITY STANDARDS:
- Each research step should have a clear, specific objective
- Rationales should explain why this step is crucial for comprehensive understanding
- Expected sources should be diverse and authoritative
- The overall plan should leave no significant knowledge gaps

Generate a research plan with ${query.depth === 'comprehensive' ? '6-8' : query.depth === 'standard' ? '4-6' : '3-4'} strategic research steps that will produce insights comparable to professional research reports.

${this.researchPlanParser.getFormatInstructions()}`;

    const response = await this.llm.invoke([
      new SystemMessage("You are a world-class research strategist who designs comprehensive research methodologies for complex topics. Your research plans have been used by Fortune 500 companies, academic institutions, and government agencies to make critical decisions."),
      new HumanMessage(planPrompt)
    ]);

    return this.researchPlanParser.parse(response.content as string);
  }

  private async executeResearchStep(
    planStep: any,
    accumulatedKnowledge: string,
    originalQuery: ResearchQuery
  ): Promise<ResearchStep> {
    
    // Execute comprehensive search across multiple sources
    const searchResults = await unifiedSearchService.search({
      query: planStep.query,
      sources: ['web', 'arxiv'], // Focus on reliable sources, Google Scholar often has API issues
      maxResults: 15, // Increased to compensate for fewer sources
      sortBy: 'relevance'
    });

    // Process and enhance search results
    const processedResults: SearchResult[] = searchResults.results.map((result: any) => {
      const snippet = result.snippet || result.abstract || result.summary || '';
      
      return {
        title: result.title || 'Untitled',
        url: result.url || '',
        snippet,
        source: result.source as 'arxiv' | 'pubmed' | 'google_scholar' | 'web',
        relevanceScore: this.calculateRelevanceScore(result, planStep.query),
        keyPoints: this.extractKeyPoints(snippet),
        publishDate: result.publishedDate || result.year?.toString(),
        authors: result.authors || []
      };
    });

    // Comprehensive analysis of findings
    const analysis = await this.analyzeStepFindings(
      planStep.query,
      processedResults,
      accumulatedKnowledge,
      originalQuery
    );

    return {
      stepNumber: planStep.stepNumber,
      query: planStep.query,
      rationale: planStep.rationale,
      sources: processedResults.map(r => r.source),
      results: processedResults,
      keyFindings: analysis.keyFindings,
      questionsRaised: analysis.questionsRaised,
      duration: 0 // Will be set by caller
    };
  }

  private async analyzeStepFindings(
    query: string,
    results: SearchResult[],
    accumulatedKnowledge: string,
    originalQuery: ResearchQuery
  ) {
    const analysisPrompt = `You are a senior research analyst conducting a comprehensive analysis of research findings. Your analysis will inform critical decisions and must meet publication-quality standards.

RESEARCH CONTEXT:
Original Query: "${originalQuery.originalQuery}"
Current Research Step: "${query}"
Research Depth: ${originalQuery.depth}

ACCUMULATED KNOWLEDGE:
${accumulatedKnowledge}

CURRENT SEARCH RESULTS:
${results.map((r, idx) => `
[${idx + 1}] ${r.title}
Source: ${r.source} | URL: ${r.url}
Content: ${r.snippet}
Key Points: ${r.keyPoints.join('; ')}
`).join('\n')}

ANALYSIS REQUIREMENTS:
1. **Extract Key Insights**: Identify the most significant findings that advance understanding
2. **Synthesize Information**: Connect findings to create coherent insights
3. **Identify Patterns**: Look for trends, commonalities, and contradictions
4. **Assess Quality**: Evaluate source credibility and information reliability
5. **Find Gaps**: Identify what critical information is still missing
6. **Generate Questions**: Formulate specific questions that need further investigation

QUALITY STANDARDS:
- Key findings should be specific, actionable, and well-supported
- Questions should be strategic and lead to valuable insights
- Gap analysis should be thorough and identify specific missing elements
- Confidence assessment should be realistic based on available evidence

Provide a comprehensive analysis that maintains the highest research standards.

${this.findingsParser.getFormatInstructions()}`;

    const response = await this.llm.invoke([
      new SystemMessage("You are a distinguished research analyst with expertise in synthesizing complex information from multiple sources. Your analyses are used by executives, policymakers, and researchers to make critical decisions."),
      new HumanMessage(analysisPrompt)
    ]);

    return this.findingsParser.parse(response.content as string);
  }

  private async analyzeFindings(
    step: ResearchStep,
    accumulatedKnowledge: string,
    originalQuery: ResearchQuery
  ) {
    const prompt = `You are a research coordinator determining the next strategic research steps for a comprehensive investigation.

RESEARCH OVERVIEW:
Original Query: "${originalQuery.originalQuery}"
Completed Step: ${step.stepNumber} - "${step.query}"
Research Depth Target: ${originalQuery.depth}

CURRENT STEP ANALYSIS:
Rationale: ${step.rationale}
Key Findings: ${step.keyFindings.join(' | ')}
Questions Raised: ${step.questionsRaised.join(' | ')}
Sources Used: ${step.sources.join(', ')}

ACCUMULATED RESEARCH:
${accumulatedKnowledge}

DECISION CRITERIA:
1. **Information Completeness**: Are there critical gaps that prevent comprehensive understanding?
2. **Research Depth**: Does the current evidence support confident conclusions?
3. **Stakeholder Needs**: Would additional research significantly improve decision-making value?
4. **Source Diversity**: Are perspectives from different domains adequately represented?
5. **Temporal Coverage**: Is both current state and future implications well understood?

If additional research is needed, propose specific, high-value follow-up queries that will address the most critical information gaps.

${this.findingsParser.getFormatInstructions()}`;

    const response = await this.llm.invoke([
      new SystemMessage("You are a strategic research coordinator who determines optimal research directions to maximize insight value and completeness."),
      new HumanMessage(prompt)
    ]);

    return this.findingsParser.parse(response.content as string);
  }

  private async generateReport(
    query: ResearchQuery,
    steps: ResearchStep[],
    accumulatedKnowledge: string
  ) {
    const reportPrompt = `You are tasked with creating a comprehensive research report that rivals professional consulting reports and academic publications in quality and depth.

RESEARCH OVERVIEW:
Query: "${query.originalQuery}"
Research Depth: ${query.depth}
Research Steps Completed: ${steps.length}
Total Sources Analyzed: ${steps.reduce((sum, step) => sum + step.results.length, 0)}
Research Duration: ${steps.reduce((sum, step) => sum + step.duration, 0) / 1000} seconds

COMPREHENSIVE RESEARCH DATA:
${accumulatedKnowledge}

DETAILED FINDINGS BY STEP:
${steps.map(step => `
Step ${step.stepNumber}: ${step.query}
Duration: ${step.duration}ms | Sources: ${step.sources.join(', ')}
Key Findings: ${step.keyFindings.join(' | ')}
Questions Raised: ${step.questionsRaised.join(' | ')}
`).join('\n')}

REPORT REQUIREMENTS:
Create a professional research report with the following characteristics:

1. **Executive Summary** (200-400 words):
   - Compelling overview that executives can act upon
   - Clear statement of key insights and implications
   - Strategic recommendations preview

2. **Key Findings** (5-8 findings, 30+ words each):
   - Evidence-based insights that advance understanding
   - Specific, actionable discoveries
   - Supported by multiple credible sources
   - Address different aspects of the research question

3. **Research Methodology** (150+ words):
   - Detailed explanation of research approach
   - Source selection rationale
   - Analysis methods used
   - Quality assurance measures

4. **Limitations** (3-5 limitations, 20+ words each):
   - Honest assessment of research constraints
   - Data availability issues
   - Methodological limitations
   - Scope boundaries

5. **Recommendations** (3-6 recommendations, 25+ words each):
   - Strategic, actionable next steps
   - Implementation guidance
   - Risk considerations
   - Timeline suggestions

QUALITY STANDARDS:
- Professional tone suitable for executive briefings
- Evidence-based conclusions with high confidence
- Practical applicability and clear value proposition
- Comprehensive coverage addressing all aspects of the query

${this.reportParser.getFormatInstructions()}`;

    const response = await this.llm.invoke([
      new SystemMessage("You are a senior research director known for producing publication-quality research reports that inform strategic decisions at the highest levels of organizations."),
      new HumanMessage(reportPrompt)
    ]);

    return this.reportParser.parse(response.content as string);
  }

  private calculateRelevanceScore(result: any, query: string): number {
    // Enhanced relevance calculation
    const titleMatch = result.title?.toLowerCase().includes(query.toLowerCase()) ? 0.3 : 0;
    const contentMatch = result.snippet?.toLowerCase().includes(query.toLowerCase()) ? 0.4 : 0;
    const sourceBonus = result.source === 'arxiv' ? 0.2 : result.source === 'google_scholar' ? 0.15 : 0.1;
    const recentBonus = result.publishedDate ? 0.1 : 0.05;
    
    return Math.min(titleMatch + contentMatch + sourceBonus + recentBonus, 1.0);
  }

  private selectOptimalSources(informationGaps: string[]): string[] {
    // Enhanced source selection based on information gaps
    const gapText = informationGaps.join(' ').toLowerCase();
    
    if (gapText.includes('academic') || gapText.includes('research') || gapText.includes('study')) {
      return ['arxiv', 'web'];
    }
    if (gapText.includes('current') || gapText.includes('recent') || gapText.includes('trend')) {
      return ['web', 'arxiv'];
    }
    if (gapText.includes('medical') || gapText.includes('health') || gapText.includes('clinical')) {
      return ['pubmed', 'web'];
    }
    
    return ['web', 'arxiv'];
  }

  private formatStepForContext(step: ResearchStep): string {
    return `
=== RESEARCH STEP ${step.stepNumber} ===
Query: ${step.query}
Rationale: ${step.rationale}
Duration: ${step.duration}ms
Sources: ${step.sources.join(', ')}
Key Findings:
${step.keyFindings.map(f => `  • ${f}`).join('\n')}
Questions Raised:
${step.questionsRaised.map(q => `  ? ${q}`).join('\n')}
Results Count: ${step.results.length}
---
`;
  }

  private extractKeyPoints(snippet: string): string[] {
    if (!snippet) return [];
    
    // Enhanced key point extraction
    return snippet
      .split(/[.!?]/)
      .filter(sentence => sentence.trim().length > 25)
      .slice(0, 4)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  private consolidateSources(steps: ResearchStep[]): SearchResult[] {
    const allSources = steps.flatMap(step => step.results);
    
    // Enhanced deduplication and ranking
    const uniqueSources = allSources.filter((source, index, self) =>
      index === self.findIndex(s => s.url === source.url)
    );

    return uniqueSources
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 50); // Limit to top 50 sources
  }
}

// Factory functions
export const createDeepResearchAgent = () => new DeepResearchAgent();

export async function conductQuickResearch(query: string): Promise<ResearchReport> {
  const agent = createDeepResearchAgent();
  return agent.conductDeepResearch({
    originalQuery: query,
    depth: 'quick'
  });
}

export async function conductComprehensiveResearch(
  query: string, 
  context?: string,
  focusAreas?: string[]
): Promise<ResearchReport> {
  const agent = createDeepResearchAgent();
  return agent.conductDeepResearch({
    originalQuery: query,
    context,
    depth: 'comprehensive',
    focusAreas
  });
} 