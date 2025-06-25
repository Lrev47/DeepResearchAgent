import { Client } from "@notionhq/client";
import { ResearchReport } from "../research/deepResearch";

export interface NotionResearchPage {
  id: string;
  url: string;
  title: string;
  createdAt: Date;
}

export class NotionService {
  private notion: Client;
  private defaultDatabaseId: string;

  constructor() {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      throw new Error('NOTION_API_KEY environment variable is required');
    }

    this.notion = new Client({
      auth: apiKey,
    });

    this.defaultDatabaseId = process.env.NOTION_DATABASE_ID || '';
  }

  /**
   * Create a comprehensive research report page in Notion
   */
  async createResearchReport(
    report: ResearchReport,
    databaseId?: string
  ): Promise<string> {
    const targetDatabaseId = databaseId || this.defaultDatabaseId;
    
    if (!targetDatabaseId) {
      throw new Error('Notion database ID is required');
    }

    try {
      // Create the main page
      const page = await this.notion.pages.create({
        parent: {
          database_id: targetDatabaseId,
        },
        properties: {
          "Name": {
            title: [
              {
                text: {
                  content: `Research: ${report.query.originalQuery}`,
                },
              },
            ],
          },
          "Status": {
            select: {
              name: "Completed",
            },
          },
          "Research Depth": {
            select: {
              name: report.query.depth || "standard",
            },
          },
          "Confidence": {
            number: Math.round(report.confidence * 100),
          },
          "Read Time": {
            number: report.estimatedReadTime,
          },
          "Sources": {
            number: report.sources.length,
          },
          "Created": {
            date: {
              start: report.createdAt.toISOString(),
            },
          },
        },
        children: await this.buildReportContent(report),
      });

      return page.id;
    } catch (error) {
      console.error('Notion API error:', error);
      throw new Error(`Failed to create Notion page: ${error}`);
    }
  }

  /**
   * Build the content blocks for the research report
   */
  private async buildReportContent(report: ResearchReport): Promise<any[]> {
    const blocks: any[] = [];

    // Executive Summary
    blocks.push({
      object: "block",
      type: "heading_1",
      heading_1: {
        rich_text: [{ type: "text", text: { content: "Executive Summary" } }],
      },
    });

    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", text: { content: report.executiveSummary } }],
      },
    });

    // Key Findings
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "Key Findings" } }],
      },
    });

    report.keyFindings.forEach((finding, index) => {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: finding } }],
        },
      });
    });

    // Research Steps
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "Research Process" } }],
      },
    });

    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          { 
            type: "text", 
            text: { 
              content: `This research was conducted through ${report.researchSteps.length} systematic steps using multiple academic and web sources.` 
            } 
          }
        ],
      },
    });

    // Add research steps
    report.researchSteps.forEach((step, index) => {
      blocks.push({
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [{ type: "text", text: { content: `Step ${step.stepNumber}: ${step.query}` } }],
        },
      });

      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: step.rationale } }],
        },
      });

      // Key findings from this step
      if (step.keyFindings.length > 0) {
        blocks.push({
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              { type: "text", text: { content: "Key findings: ", style: { bold: true } } },
              { type: "text", text: { content: step.keyFindings.join('; ') } }
            ],
          },
        });
      }
    });

    // Methodology
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "Methodology" } }],
      },
    });

    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", text: { content: report.methodology } }],
      },
    });

    // Recommendations
    if (report.recommendations.length > 0) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "Recommendations" } }],
        },
      });

      report.recommendations.forEach((recommendation) => {
        blocks.push({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [{ type: "text", text: { content: recommendation } }],
          },
        });
      });
    }

    // Limitations
    if (report.limitations.length > 0) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "Limitations" } }],
        },
      });

      report.limitations.forEach((limitation) => {
        blocks.push({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [{ type: "text", text: { content: limitation } }],
          },
        });
      });
    }

    // Sources
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "Sources" } }],
      },
    });

    // Group sources by type
    const sourcesByType = report.sources.reduce((acc, source) => {
      if (!acc[source.source]) acc[source.source] = [];
      acc[source.source].push(source);
      return acc;
    }, {} as Record<string, typeof report.sources>);

    Object.entries(sourcesByType).forEach(([sourceType, sources]) => {
      blocks.push({
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [{ 
            type: "text", 
            text: { content: `${sourceType.charAt(0).toUpperCase() + sourceType.slice(1)} Sources` } 
          }],
        },
      });

      sources.forEach((source) => {
        blocks.push({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [
              {
                type: "text",
                text: { content: source.title },
                annotations: { bold: true },
              },
              { type: "text", text: { content: " - " } },
              {
                type: "text",
                text: { content: source.url },
                href: source.url,
              },
            ],
          },
        });

        if (source.snippet) {
          blocks.push({
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                { 
                  type: "text", 
                  text: { content: source.snippet },
                  annotations: { italic: true }
                }
              ],
            },
          });
        }
      });
    });

    // Research metadata
    blocks.push({
      object: "block",
      type: "divider",
      divider: {},
    });

    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          { type: "text", text: { content: "Research ID: ", style: { bold: true } } },
          { type: "text", text: { content: report.id } },
          { type: "text", text: { content: " | Confidence: ", style: { bold: true } } },
          { type: "text", text: { content: `${(report.confidence * 100).toFixed(0)}%` } },
          { type: "text", text: { content: " | Read Time: ", style: { bold: true } } },
          { type: "text", text: { content: `${report.estimatedReadTime} min` } },
        ],
      },
    });

    return blocks;
  }

  /**
   * Update an existing research report
   */
  async updateResearchReport(
    pageId: string, 
    updates: Partial<ResearchReport>
  ): Promise<void> {
    try {
      await this.notion.pages.update({
        page_id: pageId,
        properties: {
          // Update relevant properties
          ...(updates.confidence && {
            "Confidence": { number: Math.round(updates.confidence * 100) }
          }),
          ...(updates.estimatedReadTime && {
            "Read Time": { number: updates.estimatedReadTime }
          }),
        },
      });
    } catch (error) {
      console.error('Failed to update Notion page:', error);
      throw error;
    }
  }

  /**
   * List research reports from database
   */
  async listResearchReports(databaseId?: string): Promise<NotionResearchPage[]> {
    const targetDatabaseId = databaseId || this.defaultDatabaseId;
    
    try {
      const response = await this.notion.databases.query({
        database_id: targetDatabaseId,
        sorts: [
          {
            property: "Created",
            direction: "descending",
          },
        ],
      });

      return response.results.map((page: any) => ({
        id: page.id,
        url: page.url,
        title: page.properties.Name?.title?.[0]?.text?.content || 'Untitled',
        createdAt: new Date(page.properties.Created?.date?.start || page.created_time),
      }));
    } catch (error) {
      console.error('Failed to list Notion pages:', error);
      throw error;
    }
  }
}

export const notionService = new NotionService(); 