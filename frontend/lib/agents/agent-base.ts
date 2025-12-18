import { aiService } from '../ai/ai-service'

export type AgentStatus = 'idle' | 'processing' | 'completed' | 'error'

export interface AgentLog {
    id: string
    timestamp: Date
    agent: string
    message: string
    status: AgentStatus
    progress?: number
}

export interface AgentResult<T> {
    data: T
    logs: AgentLog[]
    status: AgentStatus
    error?: string
}

/**
 * Base class for all AI agents
 */
export abstract class AgentBase<TInput, TOutput> {
    protected name: string
    protected logs: AgentLog[] = []
    protected status: AgentStatus = 'idle'

    constructor(name: string) {
        this.name = name
    }

    /**
     * Main execution method - must be implemented by subclasses
     */
    abstract execute(input: TInput): Promise<TOutput>

    /**
     * Log a message
     */
    protected log(message: string, status: AgentStatus = 'processing', progress?: number): void {
        const log: AgentLog = {
            id: `${this.name}-${Date.now()}-${Math.random()}`,
            timestamp: new Date(),
            agent: this.name,
            message,
            status,
            progress,
        }
        this.logs.push(log)
        console.log(`[${this.name}]`, message)
    }

    /**
     * Get all logs
     */
    getLogs(): AgentLog[] {
        return this.logs
    }

    /**
     * Get current status
     */
    getStatus(): AgentStatus {
        return this.status
    }

    /**
     * Run the agent with error handling
     */
    async run(input: TInput): Promise<AgentResult<TOutput>> {
        this.logs = []
        this.status = 'processing'

        try {
            this.log('Starting agent execution', 'processing', 0)
            const data = await this.execute(input)
            this.status = 'completed'
            this.log('Agent execution completed', 'completed', 100)

            return {
                data,
                logs: this.logs,
                status: 'completed',
            }
        } catch (error) {
            this.status = 'error'
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            this.log(`Agent execution failed: ${errorMessage}`, 'error', 0)

            return {
                data: {} as TOutput,
                logs: this.logs,
                status: 'error',
                error: errorMessage,
            }
        }
    }

    /**
     * Helper to call AI service
     */
    protected async callAI(
        prompt: string,
        systemPrompt?: string,
        options?: { temperature?: number; maxTokens?: number }
    ): Promise<string> {
        if (!aiService.isConfigured()) {
            throw new Error('AI service is not configured. Please set up API keys in environment variables.')
        }

        const response = await aiService.complete(prompt, {
            systemPrompt,
            ...options,
        })

        return response.content
    }

    /**
     * Helper to extract JSON from AI
     */
    protected async extractJSON<T>(
        prompt: string,
        schema: string,
        systemPrompt?: string
    ): Promise<T> {
        if (!aiService.isConfigured()) {
            throw new Error('AI service is not configured. Please set up API keys in environment variables.')
        }

        return await aiService.extractJSON<T>(prompt, schema, { systemPrompt })
    }
}
