'use client'

import { useState, useCallback } from 'react'
import { Settings, Download, Copy, Check, Loader2, Sparkles, Clock, FileText, Mic } from 'lucide-react'
import SettingsModal from '../components/SettingsModal'
import FileUpload from '../components/FileUpload'
import VoiceInput from '../components/VoiceInput'
import MarkdownPreview from '../components/MarkdownPreview'
import HistoryPanel from '../components/HistoryPanel'
import { aiService } from '../lib/ai-service'
import { useLocalStorage, useSettings } from '../hooks/useLocalStorage'

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('text')
  
  const { history, saveToHistory, deleteHistoryItem, clearHistory, isLoaded } = useLocalStorage()
  const { settings, updateSettings, isLoaded: settingsLoaded } = useSettings()

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim()) {
      alert('Please enter some text to generate a skill file.')
      return
    }

    setIsGenerating(true)
    try {
      const result = await aiService.generateSkillFile(inputText, {
        provider: settings.provider,
        apiKey: settings.apiKey,
        model: settings.model,
        temperature: settings.temperature,
      })
      
      setGeneratedContent(result)
      
      if (settings.autoSave) {
        saveToHistory({
          content: result,
          inputSource: activeTab,
        })
      }
    } catch (error) {
      console.error('Generation error:', error)
      alert(`Failed to generate skill file: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }, [inputText, settings, activeTab, saveToHistory])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [generatedContent])

  const handleDownload = useCallback(() => {
    const titleMatch = generatedContent.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].replace(/[^a-zA-Z0-9]/g, '_') : 'skill_file'
    const filename = `${title}.md`
    
    const blob = new Blob([generatedContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [generatedContent])

  const handleFileContent = useCallback((content, filename) => {
    setInputText(content)
    setActiveTab('text')
  }, [])

  const handleVoiceTranscript = useCallback((transcript) => {
    setInputText(transcript)
  }, [])

  const handleLoadFromHistory = useCallback((item) => {
    setGeneratedContent(item.content)
    setShowHistory(false)
  }, [])

  const handleReset = useCallback(() => {
    setInputText('')
    setGeneratedContent('')
  }, [])

  if (!isLoaded || !settingsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Skill File Generator</h1>
              <p className="text-xs text-gray-500">Turn ideas into structured skill files</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="History"
            >
              <Clock className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Input</h2>
                {inputText && (
                  <button
                    onClick={handleReset}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'text'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Text
                </button>
                <button
                  onClick={() => setActiveTab('voice')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'voice'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  Voice
                </button>
                <button
                  onClick={() => setActiveTab('file')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'file'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  File
                </button>
              </div>

              {activeTab === 'text' && (
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter your idea, topic, or raw content here..."
                  className="input-field min-h-[200px] resize-y font-mono text-sm"
                  disabled={isGenerating}
                />
              )}

              {activeTab === 'voice' && (
                <VoiceInput
                  onTranscriptChange={handleVoiceTranscript}
                  disabled={isGenerating}
                />
              )}

              {activeTab === 'file' && (
                <FileUpload
                  onFileContent={handleFileContent}
                  disabled={isGenerating}
                />
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !inputText.trim()}
                className="mt-4 w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Skill File
                  </>
                )}
              </button>
            </div>

            {generatedContent && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="card min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
              <span className="text-xs text-gray-500">
                {generatedContent ? `${generatedContent.length} characters` : 'Empty'}
              </span>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 min-h-[400px] overflow-y-auto bg-gray-50">
              <MarkdownPreview content={generatedContent} />
            </div>
          </div>
        </div>
      </main>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      <HistoryPanel
        history={history}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadItem={handleLoadFromHistory}
        onDeleteItem={deleteHistoryItem}
        onClearHistory={clearHistory}
      />
    </div>
  )
}