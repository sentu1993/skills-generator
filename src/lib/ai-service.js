import { AI_PROVIDERS, SYSTEM_PROMPT, chunkText } from './ai-providers'

class AIService {
  constructor() {
    this.providers = {
      [AI_PROVIDERS.OPENAI]: null,
      [AI_PROVIDERS.GEMINI]: null,
      [AI_PROVIDERS.LOCAL]: null,
    }
    this.currentProvider = AI_PROVIDERS.OPENAI
  }

  setProvider(provider) {
    this.currentProvider = provider
  }

  async initializeProvider(provider, apiKey) {
    if (provider === AI_PROVIDERS.OPENAI && apiKey) {
      const { OpenAI } = await import('openai')
      this.providers[AI_PROVIDERS.OPENAI] = new OpenAI({ apiKey })
    } else if (provider === AI_PROVIDERS.GEMINI && apiKey) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      this.providers[AI_PROVIDERS.GEMINI] = new GoogleGenerativeAI(apiKey)
    }
  }

  async generateSkillFile(input, options = {}) {
    const { provider = this.currentProvider, model, apiKey, temperature = 0.7, maxTokens = 2000 } = options

    await this.initializeProvider(provider, apiKey)

    if (input.length > 4000) {
      return this.generateFromLongText(input, { provider, model, temperature, maxTokens })
    }

    switch (provider) {
      case AI_PROVIDERS.OPENAI:
        return this.generateWithOpenAI(input, { model, temperature, maxTokens })
      case AI_PROVIDERS.GEMINI:
        return this.generateWithGemini(input, { model, temperature })
      case AI_PROVIDERS.LOCAL:
        return this.generateWithLocal(input, { model, temperature })
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }
  }

  async generateFromLongText(text, options = {}) {
    const chunks = chunkText(text)
    let accumulatedContext = ''
    let finalOutput = ''

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const isLastChunk = i === chunks.length - 1
      const contextPrompt = isLastChunk
        ? `This is the final chunk. Generate the complete skill file based on ALL previous context:\n\n${accumulatedContext}\n\nCurrent chunk:\n${chunk}`
        : `Continue processing. Build on the context:\n\n${accumulatedContext}\n\nCurrent chunk:\n${chunk}\n\nProvide a partial output that will be continued.`

      const partialOutput = await this.generateSkillFile(contextPrompt, options)
      
      if (isLastChunk) {
        finalOutput = partialOutput
      } else {
        accumulatedContext += `\n${chunk}`
      }
    }

    return finalOutput || await this.generateSkillFile(text.slice(-4000), options)
  }

  async generateWithOpenAI(input, options = {}) {
    const { model = 'gpt-3.5-turbo', temperature = 0.7, maxTokens = 2000 } = options
    
    if (!this.providers[AI_PROVIDERS.OPENAI]) {
      throw new Error('OpenAI not initialized. Please provide an API key.')
    }

    const response = await this.providers[AI_PROVIDERS.OPENAI].chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: input }
      ],
      temperature,
      max_tokens: maxTokens,
    })

    return response.choices[0].message.content
  }

  async generateWithGemini(input, options = {}) {
    const { model = 'gemini-pro', temperature = 0.7 } = options
    
    if (!this.providers[AI_PROVIDERS.GEMINI]) {
      throw new Error('Gemini not initialized. Please provide an API key.')
    }

    const genModel = this.providers[AI_PROVIDERS.GEMINI].getGenerativeModel({ model })
    const result = await genModel.generateContent(`${SYSTEM_PROMPT}\n\nInput:\n${input}`)
    const response = await result.response
    return response.text()
  }

  async generateWithLocal(input, options = {}) {
    const { model = 'llama2', temperature = 0.7 } = options
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: `${SYSTEM_PROMPT}\n\nInput:\n${input}`,
        stream: false,
        options: { temperature }
      })
    })

    if (!response.ok) {
      throw new Error('Local AI service not available. Please ensure Ollama is running.')
    }

    const data = await response.json()
    return data.response
  }
}

export const aiService = new AIService()
export default aiService