import axios from 'axios'

/**
 * Local LLM Service using Ollama
 * Free, local LLM inference - no API keys required!
 * 
 * Install Ollama: https://ollama.ai/download
 * Run: ollama pull llama2  (or mistral, codellama, etc.)
 * 
 * Alternatively, can use LM Studio or other local model servers
 */

export interface LocalLLMConfig {
    baseURL: string // e.g., 'http://localhost:11434'
    model: string   // e.g., 'llama2', 'mistral', 'codellama'
    temperature?: number
    maxTokens?: number
}

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export class LocalLLMService {
    private config: LocalLLMConfig
    private isOllamaAvailable: boolean = false

    constructor(config?: Partial<LocalLLMConfig>) {
        this.config = {
            baseURL: config?.baseURL || process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434',
            model: config?.model || process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'llama2',
            temperature: config?.temperature || 0.7,
            maxTokens: config?.maxTokens || 2000,
        }
    }

    /**
     * Check if Ollama is running and available
     */
    async checkAvailability(): Promise<boolean> {
        try {
            const response = await axios.get(`${this.config.baseURL}/api/tags`, {
                timeout: 3000,
            })
            this.isOllamaAvailable = response.status === 200
            console.log('Ollama is available:', this.isOllamaAvailable)
            return this.isOllamaAvailable
        } catch (error) {
            this.isOllamaAvailable = false
            console.warn('Ollama not available. Install from https://ollama.ai')
            return false
        }
    }

    /**
     * List available models
     */
    async listModels(): Promise<string[]> {
        try {
            const response = await axios.get(`${this.config.baseURL}/api/tags`)
            const models = response.data.models || []
            return models.map((m: any) => m.name)
        } catch (error) {
            console.error('Error listing models:', error)
            return []
        }
    }

    /**
     * Generate completion using local LLM
     */
    async generateCompletion(
        prompt: string,
        systemPrompt?: string
    ): Promise<string> {
        if (!this.isOllamaAvailable) {
            await this.checkAvailability()
            if (!this.isOllamaAvailable) {
                throw new Error('Ollama not available. Please install and run Ollama.')
            }
        }

        try {
            const response = await axios.post(
                `${this.config.baseURL}/api/generate`,
                {
                    model: this.config.model,
                    prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
                    stream: false,
                    options: {
                        temperature: this.config.temperature,
                        num_predict: this.config.maxTokens,
                    },
                },
                {
                    timeout: 60000, // 60 seconds
                }
            )

            return response.data.response || ''
        } catch (error: any) {
            console.error('Error generating completion:', error.message)
            throw error
        }
    }

    /**
     * Chat completion (multi-turn conversation)
     */
    async chat(messages: ChatMessage[]): Promise<string> {
        if (!this.isOllamaAvailable) {
            await this.checkAvailability()
            if (!this.isOllamaAvailable) {
                throw new Error('Ollama not available')
            }
        }

        try {
            const response = await axios.post(
                `${this.config.baseURL}/api/chat`,
                {
                    model: this.config.model,
                    messages,
                    stream: false,
                    options: {
                        temperature: this.config.temperature,
                        num_predict: this.config.maxTokens,
                    },
                },
                {
                    timeout: 60000,
                }
            )

            return response.data.message?.content || ''
        } catch (error: any) {
            console.error('Error in chat:', error.message)
            throw error
        }
    }

    /**
     * Extract JSON from LLM response
     */
    async extractJSON<T>(
        prompt: string,
        schema: string,
        systemPrompt?: string
    ): Promise<T> {
        const fullPrompt = `${prompt}\n\nProvide your response as valid JSON matching this schema: ${schema}\n\nJSON response:`

        const completion = await this.generateCompletion(fullPrompt, systemPrompt)

        try {
            // Try to find JSON in the response
            const jsonMatch = completion.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]) as T
            }

            // Try parsing the entire response
            return JSON.parse(completion) as T
        } catch (error) {
            console.error('Failed to parse JSON from LLM response:', completion)
            throw new Error('Invalid JSON response from LLM')
        }
    }

    /**
     * Analyze RFP text and extract key information
     */
    async analyzeRFP(rfpText: string): Promise<{
        scopeOfSupply: string
        quantity: string
        keyRequirements: string[]
        estimatedValue?: number
    }> {
        const prompt = `Analyze this RFP and extract key information:

${rfpText}

Extract:
1. Scope of Supply (brief summary)
2. Quantity
3. Key requirements (3-5 points)
4. Estimated value (if mentioned)

Provide response in JSON format:
{
  "scopeOfSupply": "...",
  "quantity": "...",
  "keyRequirements": ["...", "..."],
  "estimatedValue": number or null
}`

        try {
            const result = await this.extractJSON<{
                scopeOfSupply: string
                quantity: string
                keyRequirements: string[]
                estimatedValue?: number
            }>(
                prompt,
                '{ scopeOfSupply: string, quantity: string, keyRequirements: string[], estimatedValue?: number }',
                'You are an expert RFP analyst. Extract structured information from RFP documents.'
            )

            return result
        } catch (error) {
            // Fallback to rule-based extraction
            return {
                scopeOfSupply: rfpText.substring(0, 200),
                quantity: 'Not specified',
                keyRequirements: ['Standard compliance', 'Quality testing', 'Timely delivery'],
            }
        }
    }

    /**
     * Calculate win probability
     */
    async calculateWinProbability(
        technicalMatch: number,
        pricingCompetitiveness: string,
        riskLevel: string
    ): Promise<{ probability: number; reasoning: string }> {
        const prompt = `Calculate win probability for an RFP bid:

Technical Match Score: ${technicalMatch}%
Pricing Competitiveness: ${pricingCompetitiveness}
Risk Level: ${riskLevel}

Provide win probability (0-100%) and brief reasoning (2-3 sentences).

Response format:
{
  "probability": number,
  "reasoning": "explanation"
}`

        try {
            return await this.extractJSON<{ probability: number; reasoning: string }>(
                prompt,
                '{ probability: number, reasoning: string }',
                'You are a business analyst specializing in RFP bid analysis.'
            )
        } catch {
            // Fallback calculation
            let prob = technicalMatch * 0.7
            if (pricingCompetitiveness === 'competitive') prob += 20
            if (pricingCompetitiveness === 'premium') prob -= 10
            if (riskLevel === 'low') prob += 10
            if (riskLevel === 'high') prob -= 15

            return {
                probability: Math.min(100, Math.max(0, prob)),
                reasoning: 'Based on technical match and pricing analysis.',
            }
        }
    }

    /**
     * Generate pricing recommendation
     */
    async generatePricingRecommendation(
        baseCost: number,
        marketAverage: number,
        margin: number
    ): Promise<string> {
        const prompt = `Provide pricing strategy recommendation:

Our Base Cost: ₹${baseCost.toLocaleString()}
Market Average: ₹${marketAverage.toLocaleString()}
Target Margin: ${margin}%

Recommend which pricing scenario to use and why (2-3 sentences).`

        try {
            return await this.generateCompletion(
                prompt,
                'You are a pricing strategy expert for B2B industrial equipment.'
            )
        } catch {
            return 'Use recommended pricing for balanced competitiveness and profitability.'
        }
    }
}

// Singleton instance
export const localLLM = new LocalLLMService()

// Initialize on import
if (typeof window !== 'undefined') {
    localLLM.checkAvailability().catch(() => {
        console.log('Local LLM not available - install Ollama for AI features')
    })
}
