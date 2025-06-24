# Deep Research Agent - Setup Guide

## 🎯 Overview
This guide will help you complete the API configuration and services setup for your Deep Research Agent project.

## ✅ Already Completed
- ✅ Node.js v22.14.0 and npm installed
- ✅ Next.js 15 project with TypeScript and Tailwind CSS
- ✅ Git repository initialized  
- ✅ Core dependencies installed
- ✅ Project structure set up
- ✅ Environment file template created

## 🔑 API Keys and Services Setup

### 1. OpenAI API Key (Required)
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key and update `.env.local`:
   ```
   OPENAI_API_KEY="your_actual_openai_key_here"
   ```

### 2. SERP API Key (Required for Agents)
1. Go to [SERP API](https://serpapi.com/)
2. Sign up for an account
3. Get your API key from the dashboard
4. Update `.env.local`:
   ```
   SERPAPI_API_KEY="your_actual_serpapi_key_here"
   ```

### 3. Notion API Integration (Required for Report Delivery)
1. Go to [Notion Developers](https://developers.notion.com/)
2. Click "Create new integration"
3. Give it a name like "Deep Research Agent"
4. Save the integration and copy the "Internal Integration Token"
5. Update `.env.local`:
   ```
   NOTION_API_KEY="your_notion_integration_token_here"
   ```

#### Set up Notion Database:
1. Create a new page in your Notion workspace
2. Add a database (can be a simple table)
3. Share the page with your integration:
   - Click "Share" on the page
   - Click "Invite" and search for your integration name
   - Give it "Edit" permissions
4. Copy the database ID from the URL:
   - URL format: `https://notion.so/your-workspace/DATABASE_ID?v=...`
   - Copy the DATABASE_ID part
5. Update `.env.local`:
   ```
   NOTION_DATABASE_ID="your_database_id_here"
   ```

### 4. Supabase Setup (Required for Vector Storage)
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Wait for the project to be set up
4. Go to Settings → API
5. Copy your project URL and anon public key
6. Update `.env.local`:
   ```
   SUPABASE_URL="your_supabase_project_url"
   SUPABASE_PRIVATE_KEY="your_supabase_anon_key"
   ```

#### Enable pgvector extension:
1. In your Supabase dashboard, go to the SQL Editor
2. Run this command:
   ```sql
   create extension vector;
   ```

### 5. NextAuth Secret (Required for Authentication)
1. Generate a random secret key:
   ```bash
   # On Windows PowerShell:
   [System.Web.Security.Membership]::GeneratePassword(32, 0)
   
   # Or use any random string generator
   ```
2. Update `.env.local`:
   ```
   NEXTAUTH_SECRET="your_generated_secret_here"
   ```

### 6. Optional: Additional Services

#### LangSmith (Optional - for tracing)
1. Go to [LangSmith](https://smith.langchain.com/)
2. Create account and get API key
3. Uncomment and update in `.env.local`:
   ```
   LANGCHAIN_TRACING_V2=true
   LANGCHAIN_API_KEY="your_langsmith_key"
   LANGCHAIN_PROJECT="deep-research-agent"
   ```

#### Anthropic Claude (Optional - alternative AI model)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Get your API key
3. Uncomment and update in `.env.local`:
   ```
   ANTHROPIC_API_KEY="your_anthropic_key"
   ```

## 🚀 Deployment Setup

### Vercel Deployment
1. Go to [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. In the Vercel dashboard, go to your project settings
4. Add all your environment variables from `.env.local`
5. Deploy!

## 🧪 Testing Your Setup

### 1. Test the Development Server
```bash
npm run dev
```
Visit http://localhost:3000 and verify the site loads.

### 2. Test API Connections
1. Go to the basic chat interface
2. Enter a simple message to test OpenAI integration
3. Try the "Agents" tab to test SERP API integration
4. Try the "Retrieval" tab to test Supabase integration

### 3. Test Notion Integration
Once the report generation is implemented, test by:
1. Generating a research report
2. Verifying it appears in your Notion database

## 🔍 Troubleshooting

### Common Issues:
- **API Key Errors**: Double-check all keys are correctly copied without extra spaces
- **Supabase Connection**: Ensure pgvector extension is enabled
- **Notion Integration**: Verify the integration has access to your database
- **Environment Variables**: Restart your development server after updating `.env.local`

## 📝 Current .env.local Template

Your `.env.local` file should look like this when completed:

```bash
# Primary AI API
OPENAI_API_KEY="your_actual_openai_key_here"
LANGCHAIN_CALLBACKS_BACKGROUND=false

# Required for agent web search capabilities
SERPAPI_API_KEY="your_actual_serpapi_key_here"

# Required for retrieval (RAG) examples
SUPABASE_PRIVATE_KEY="your_actual_supabase_anon_key_here"
SUPABASE_URL="your_actual_supabase_url_here"

# Required for Notion integration - Deep Research Agent reports
NOTION_API_KEY="your_actual_notion_integration_token_here"
NOTION_DATABASE_ID="your_actual_notion_database_id_here"

# NextAuth.js configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_generated_secret_here"

# Optional services (uncomment if using)
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_API_KEY="your_langsmith_key"
# LANGCHAIN_PROJECT="deep-research-agent"
# ANTHROPIC_API_KEY="your_anthropic_key"

# Development settings
# NEXT_PUBLIC_DEMO="false"
```

## ✅ Next Steps
Once you've completed this setup, the development environment will be fully configured and you can move on to Task 2: Implement Authentication System. 