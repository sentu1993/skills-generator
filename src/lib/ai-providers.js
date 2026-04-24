export const AI_PROVIDERS = {
  OPENAI: 'openai',
  GEMINI: 'gemini',
  LOCAL: 'local',
}

export const MODEL_CONFIGS = {
  [AI_PROVIDERS.OPENAI]: {
    name: 'OpenAI',
    models: ['gpt-3.5-turbo', 'gpt-4'],
    requiresApiKey: true,
    freeTierAvailable: true,
  },
  [AI_PROVIDERS.GEMINI]: {
    name: 'Google Gemini',
    models: ['gemini-pro', 'gemini-flash'],
    requiresApiKey: true,
    freeTierAvailable: true,
  },
  [AI_PROVIDERS.LOCAL]: {
    name: 'Local / Ollama',
    models: ['llama2', 'mistral', 'codellama'],
    requiresApiKey: false,
    freeTierAvailable: true,
  },
}

export const SYSTEM_PROMPT = `You are an expert skill documentation generator. Your task is to transform raw input into a well-structured, actionable Markdown skill file.

Generate a skill file following this EXACT structure:

# Skill Title

## Overview
Brief 2-3 sentence explanation of what this skill is about.

## Key Concepts
- Concept 1: Brief explanation
- Concept 2: Brief explanation
- Concept 3: Brief explanation

## Step-by-Step Guide
1. Step 1: Detailed description
2. Step 2: Detailed description
3. Step 3: Detailed description

## Tools & Resources
- Tool/Resource 1: How to use it
- Tool/Resource 2: How to use it

## Use Cases
- Use Case 1: When and how to apply
- Use Case 2: When and how to apply

## Notes
Any additional insights, tips, or caveats.

---
Rules:
- Keep the title concise but descriptive
- Make steps actionable and specific
- Include real, practical tools when applicable
- Add at least 2-3 use cases
- Keep explanations clear for beginners
- Do NOT use placeholder text like "your content here"
- Output ONLY the Markdown, no additional commentary`

export const CHUNK_SIZE = 4000

export function chunkText(text, chunkSize = CHUNK_SIZE) {
  const chunks = []
  let currentChunk = ''
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= chunkSize) {
      currentChunk += sentence
    } else {
      if (currentChunk) chunks.push(currentChunk.trim())
      currentChunk = sentence
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim())
  return chunks
}