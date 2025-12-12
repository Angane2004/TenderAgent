import { z } from 'zod'

// Configuration schema
const AIConfigSchema = z.object({
    provider: z.enum(['openai', 'anthropic', 'google']).default('openai'),
    openai: z.object({
        apiKey: z.string().optional(),
        model: z.string().default('gpt-4o'),
    }),
    anthropic: z.object({
        apiKey: z.string().optional(),
        model: z.string().default('claude-3-5-sonnet-20241022'),
    }),
    google: z.object({
        apiKey: z.string().optional(),
        model: z.string().default('gemini-1.5-pro'),
    }),
    scraping: z.object({
        enabled: z.boolean().default(true),
        proxyUrl: z.string().optional(),
    }),
    agents: z.object({
        maxConcurrent: z.number().default(3),
        timeoutMs: z.number().default(120000),
    }),
})

export type AIConfig = z.infer<typeof AIConfigSchema>

// Load configuration from environment variables
export function loadAIConfig(): AIConfig {
    return AIConfigSchema.parse({
        provider: process.env.AI_PROVIDER || 'openai',
        openai: {
            apiKey: process.env.OPENAI_API_KEY,
            model: process.env.OPENAI_MODEL || 'gpt-4o',
        },
        anthropic: {
            apiKey: process.env.ANTHROPIC_API_KEY,
            model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
        },
        google: {
            apiKey: process.env.GOOGLE_AI_API_KEY,
            model: process.env.GOOGLE_AI_MODEL || 'gemini-1.5-pro',
        },
        scraping: {
            enabled: process.env.ENABLE_WEB_SCRAPING === 'true',
            proxyUrl: process.env.SCRAPING_PROXY_URL,
        },
        agents: {
            maxConcurrent: parseInt(process.env.MAX_CONCURRENT_AGENTS || '3'),
            timeoutMs: parseInt(process.env.AGENT_TIMEOUT_MS || '120000'),
        },
    })
}

export const aiConfig = loadAIConfig()
