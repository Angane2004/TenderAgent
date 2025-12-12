# AI Agent Configuration Guide

## Quick Start

To use the production-ready AI agents, you need to configure an AI provider. Follow these steps:

### Step 1: Choose Your AI Provider

The system supports three AI providers:
- **OpenAI** (GPT-4/GPT-4o) - Recommended for best performance
- **Anthropic** (Claude 3.5 Sonnet) - Great for long RFP documents
- **Google AI** (Gemini 1.5 Pro) - Good balance of cost and performance

### Step 2: Get an API Key

1. **OpenAI**: Visit https://platform.openai.com/api-keys
2. **Anthropic**: Visit https://console.anthropic.com/
3. **Google AI**: Visit https://makersuite.google.com/app/apikey

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API key:

   **For OpenAI:**
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-your-api-key-here
   OPENAI_MODEL=gpt-4o
   ```

   **For Anthropic:**
   ```env
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=sk-ant-your-api-key-here
   ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
   ```

   **For Google AI:**
   ```env
   AI_PROVIDER=google
   GOOGLE_AI_API_KEY=your-api-key-here
   GOOGLE_AI_MODEL=gemini-1.5-pro
   ```

### Step 4: Test the Configuration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to an RFP and click to process it with an agent

3. Check the browser console and terminal for any errors

## Features

### 🤖 AI Agents

#### Sales Discovery Agent
- Scans RFP URLs and documents
- Extracts specifications using AI and regex
- Identifies testing requirements
- Prepares contextual summaries

#### Technical Analysis Agent
- Matches RFP specs with product catalog
- Recommends top 3 products with match scores
- Generates comparison tables
- Validates standards compliance

#### Pricing Strategy Agent
- Calculates material and testing costs
- Generates pricing scenarios (aggressive, recommended, premium)
- Performs competitive analysis
- Assesses pricing risk

#### Master Orchestrator Agent
- Coordinates all agent workflows
- Calculates win probability using AI
- Generates overall recommendations
- Consolidates final response

#### Response Generator
- Creates comprehensive RFP response documents
- Generates professional PDFs
- Includes specifications, pricing, and certifications

### 🔍 Web Scraping (Optional)

To enable real-time RFP scanning from tender portals:

```env
ENABLE_WEB_SCRAPING=true
```

**Note**: Most government tender portals require authentication. You'll need to modify the web scraper for specific portals.

### ⚙️ Advanced Configuration

```env
# Maximum concurrent agent operations
MAX_CONCURRENT_AGENTS=3

# Agent timeout (in milliseconds)
AGENT_TIMEOUT_MS=120000

# Proxy for web scraping (optional)
SCRAPING_PROXY_URL=http://your-proxy:port
```

## Cost Estimation

Approximate costs per RFP analysis (varies by document length):

- **OpenAI GPT-4o**: $0.10 - $0.50
- **Anthropic Claude**: $0.15 - $0.60
- **Google Gemini**: $0.05 - $0.30

## Troubleshooting

### "AI service is not configured" Error

- Verify your `.env.local` file exists
- Check that your API key is correct
- Ensure `AI_PROVIDER` matches your chosen provider

### Agent Processing Fails

- Check browser console for specific error messages
- Verify API key has sufficient credits
- Check rate limits for your AI provider

### Web Scraping Not Working

- Most tender portals require authentication
- Some portals block automated access
- You may need to provide PDFs directly instead

## Production Deployment

For production deployment:

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Enable proper error logging
3. Set up monitoring for API usage and costs
4. Consider implementing request caching to reduce costs

## Support

For issues or questions:
- Check the implementation plan in artifacts
- Review API route files in `/app/api/agents/`
- Check agent service files in `/lib/agents/`

## Security Notes

- Never commit `.env.local` to version control
- Keep API keys secure
- Rotate keys if compromised
- Monitor API usage for unexpected spikes
