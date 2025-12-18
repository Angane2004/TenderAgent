import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { aiConfig } from '../config/ai-config'

export interface AIMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export interface AIResponse {
    content: string
    tokensUsed?: number
    model: string
}

export interface AIServiceOptions {
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
}

/**
 * Unified AI service that supports multiple providers
 */
export class AIService {
    private openaiClient?: OpenAI
    private anthropicClient?: Anthropic
    private googleClient?: GoogleGenerativeAI
    private provider: 'openai' | 'anthropic' | 'google'

    constructor() {
        this.provider = aiConfig.provider

        // Initialize clients based on configuration
        if (this.provider === 'openai' && aiConfig.openai.apiKey) {
            this.openaiClient = new OpenAI({
                apiKey: aiConfig.openai.apiKey,
            })
        } else if (this.provider === 'anthropic' && aiConfig.anthropic.apiKey) {
            this.anthropicClient = new Anthropic({
                apiKey: aiConfig.anthropic.apiKey,
            })
        } else if (this.provider === 'google' && aiConfig.google.apiKey) {
            this.googleClient = new GoogleGenerativeAI(aiConfig.google.apiKey)
        }
    }

    /**
     * Generate a completion from the AI service
     */
    async complete(
        prompt: string,
        options: AIServiceOptions = {}
    ): Promise<AIResponse> {
        const { temperature = 0.7, maxTokens = 4000, systemPrompt } = options

        try {
            if (this.provider === 'openai' && this.openaiClient) {
                return await this.completeOpenAI(prompt, systemPrompt, temperature, maxTokens)
            } else if (this.provider === 'anthropic' && this.anthropicClient) {
                return await this.completeAnthropic(prompt, systemPrompt, temperature, maxTokens)
            } else if (this.provider === 'google' && this.googleClient) {
                return await this.completeGoogle(prompt, systemPrompt, temperature, maxTokens)
            } else {
                throw new Error(`AI provider "${this.provider}" is not configured or API key is missing`)
            }
        } catch (error) {
            console.error('AI Service Error:', error)
            throw new Error(`AI Service failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    private async completeOpenAI(
        prompt: string,
        systemPrompt?: string,
        temperature?: number,
        maxTokens?: number
    ): Promise<AIResponse> {
        if (!this.openaiClient) throw new Error('OpenAI client not initialized')

        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = []

        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt })
        }

        messages.push({ role: 'user', content: prompt })

        const response = await this.openaiClient.chat.completions.create({
            model: aiConfig.openai.model,
            messages,
            temperature,
            max_tokens: maxTokens,
        })

        return {
            content: response.choices[0]?.message?.content || '',
            tokensUsed: response.usage?.total_tokens,
            model: aiConfig.openai.model,
        }
    }

    private async completeAnthropic(
        prompt: string,
        systemPrompt?: string,
        temperature?: number,
        maxTokens?: number
    ): Promise<AIResponse> {
        if (!this.anthropicClient) throw new Error('Anthropic client not initialized')

        const response = await this.anthropicClient.messages.create({
            model: aiConfig.anthropic.model,
            max_tokens: maxTokens || 4000,
            temperature,
            system: systemPrompt,
            messages: [{ role: 'user', content: prompt }],
        })

        const content = response.content[0]
        const textContent = content.type === 'text' ? content.text : ''

        return {
            content: textContent,
            tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
            model: aiConfig.anthropic.model,
        }
    }

    private async completeGoogle(
        prompt: string,
        systemPrompt?: string,
        temperature?: number,
        maxTokens?: number
    ): Promise<AIResponse> {
        if (!this.googleClient) throw new Error('Google AI client not initialized')

        const model = this.googleClient.getGenerativeModel({
            model: aiConfig.google.model,
            generationConfig: {
                temperature,
                maxOutputTokens: maxTokens,
            },
        })

        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
        const result = await model.generateContent(fullPrompt)
        const response = result.response
        const text = response.text()

        return {
            content: text,
            model: aiConfig.google.model,
        }
    }

    /**
     * Extract structured JSON from AI response
     */
    async extractJSON<T>(
        prompt: string,
        schema: string,
        options: AIServiceOptions = {}
    ): Promise<T> {
        const systemPrompt = `${options.systemPrompt || ''}\n\nYou must respond with valid JSON only. No markdown, no explanation. Schema: ${schema}`

        const response = await this.complete(prompt, {
            ...options,
            systemPrompt,
            temperature: 0.3, // Lower temperature for structured output
        })

        // Remove markdown code blocks if present
        let content = response.content.trim()
        if (content.startsWith('```json')) {
            content = content.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
        } else if (content.startsWith('```')) {
            content = content.replace(/```\n?/g, '')
        }

        try {
            return JSON.parse(content) as T
        } catch (error) {
            console.error('Failed to parse AI JSON response:', content)
            throw new Error('AI returned invalid JSON')
        }
    }

    /**
     * Check if the service is properly configured
     */
    isConfigured(): boolean {
        return !!(
            (this.provider === 'openai' && this.openaiClient) ||
            (this.provider === 'anthropic' && this.anthropicClient) ||
            (this.provider === 'google' && this.googleClient)
        )
    }

    /**
     * Get the current provider name
     */
    getProvider(): string {
        return this.provider
    }
}

// Export singleton instance
export const aiService = new AIService()
