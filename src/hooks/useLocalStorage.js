import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'skill_file_history'

export function useLocalStorage() {
  const [history, setHistory] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load history from localStorage:', error)
    }
    setIsLoaded(true)
  }, [])

  const saveToHistory = useCallback((skillFile) => {
    const entry = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: extractTitle(skillFile.content) || 'Untitled Skill',
      content: skillFile.content,
      inputSource: skillFile.inputSource || 'unknown',
    }

    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 50)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
      return updated
    })

    return entry
  }, [])

  const updateHistoryItem = useCallback((id, updates) => {
    setHistory((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      )
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Failed to update localStorage:', error)
      }
      return updated
    })
  }, [])

  const deleteHistoryItem = useCallback((id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Failed to delete from localStorage:', error)
      }
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }, [])

  const getHistoryItem = useCallback((id) => {
    return history.find((item) => item.id === id)
  }, [history])

  return {
    history,
    isLoaded,
    saveToHistory,
    updateHistoryItem,
    deleteHistoryItem,
    clearHistory,
    getHistoryItem,
  }
}

function extractTitle(content) {
  if (!content) return null
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

export function useSettings() {
  const [settings, setSettings] = useState({
    provider: 'openai',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    autoSave: true,
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('skill_generator_settings')
      if (stored) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(stored) }))
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
    setIsLoaded(true)
  }, [])

  const updateSettings = useCallback((updates) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates }
      try {
        localStorage.setItem('skill_generator_settings', JSON.stringify(updated))
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
      return updated
    })
  }, [])

  return { settings, updateSettings, isLoaded }
}