import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { Calculator } from "@langchain/community/tools/calculator";
import {
  AIMessage,
  BaseMessage,
  ChatMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

export const runtime = "edge";

function convertVercelMessageToLangChainMessage(message: VercelChatMessage) {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
}

function convertLangChainMessageToVercelMessage(message: BaseMessage) {
  if (message._getType() === "human") {
    return { role: "user" as const, content: message.content };
  } else if (message._getType() === "ai") {
    return {
      role: "assistant" as const,
      content: message.content,
    };
  } else {
    return { role: "system" as const, content: message.content };
  }
}

const RESEARCH_SYSTEM_TEMPLATE = `You are a professional AI Research Assistant specializing in comprehensive, evidence-based research. Your role is to:

1. **Provide thorough, accurate research** on any topic with proper citations and sources
2. **Think critically** and present multiple perspectives when appropriate  
3. **Use available tools** (web search, calculator) to gather current information
4. **Cite sources properly** and indicate confidence levels in your findings
5. **Structure responses clearly** with headings, bullet points, and logical flow
6. **Ask clarifying questions** when research queries are ambiguous

**Response Guidelines:**
- Always strive for accuracy and cite sources when making factual claims
- Use markdown formatting for better readability
- Include confidence indicators (e.g., "Based on multiple sources..." or "Preliminary research suggests...")
- Provide actionable insights and practical applications when relevant
- If information is uncertain or conflicting, explicitly state this

**Research Focus Areas:**
- Academic and scientific research
- Market and competitive analysis  
- Technical documentation and guides
- Current events and trends analysis
- Data-driven insights and recommendations

Remember: You are a professional research assistant, not a casual chatbot. Maintain a scholarly yet accessible tone.`;

/**
 * Professional Research Chat API using LangChain.js with web search capabilities
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const returnIntermediateSteps = body.show_intermediate_steps;
    
    /**
     * Filter out system messages from chat history to maintain clean conversation flow
     */
    const messages = (body.messages ?? [])
      .filter(
        (message: VercelChatMessage) =>
          message.role === "user" || message.role === "assistant",
      )
      .map(convertVercelMessageToLangChainMessage);

    // Initialize tools for research capabilities
    const tools = [new Calculator(), new SerpAPI()];
    
    // Use GPT-4 for better research and reasoning capabilities
    const chat = new ChatOpenAI({
      model: "gpt-4o-mini", // Could be upgraded to gpt-4 for even better results
      temperature: 0.1, // Lower temperature for more focused, factual responses
    });

    /**
     * Create a research-focused agent with professional system prompt
     */
    const agent = createReactAgent({
      llm: chat,
      tools,
      messageModifier: new SystemMessage(RESEARCH_SYSTEM_TEMPLATE),
    });

    if (!returnIntermediateSteps) {
      /**
       * Stream the research response back to the user
       * This provides real-time feedback while the AI conducts research
       */
      const eventStream = await agent.streamEvents(
        { messages },
        { version: "v2" },
      );

      const textEncoder = new TextEncoder();
      const transformStream = new ReadableStream({
        async start(controller) {
          for await (const { event, data } of eventStream) {
            if (event === "on_chat_model_stream") {
              // Only stream actual content, not tool calls
              if (!!data.chunk.content) {
                controller.enqueue(textEncoder.encode(data.chunk.content));
              }
            }
          }
          controller.close();
        },
      });

      return new StreamingTextResponse(transformStream);
    } else {
      /**
       * Return the complete research with intermediate steps
       * Useful for showing the research process and tool usage
       */
      const result = await agent.invoke({ messages });

      return NextResponse.json(
        {
          messages: result.messages.map(convertLangChainMessageToVercelMessage),
        },
        { status: 200 },
      );
    }
  } catch (e: any) {
    console.error("Research chat error:", e);
    return NextResponse.json(
      { 
        error: "Research request failed. Please try again.",
        details: process.env.NODE_ENV === "development" ? e.message : undefined
      }, 
      { status: e.status ?? 500 }
    );
  }
} 