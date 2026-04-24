import { Mic, MicOff, Loader2 } from 'lucide-react'
import { useVoiceInput } from '../hooks/useVoiceInput'

export default function VoiceInput({ onTranscriptChange, disabled }) {
  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    toggleListening,
    resetTranscript,
  } = useVoiceInput()

  const handleToggle = () => {
    toggleListening()
  }

  const handleUseTranscript = () => {
    if (transcript) {
      onTranscriptChange(transcript)
    }
  }

  const handleReset = () => {
    resetTranscript()
  }

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          Voice input is not supported in your browser. Please use Chrome or Edge.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          disabled={disabled}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              Stop
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Start Voice
            </>
          )}
        </button>

        {transcript && (
          <>
            <button
              onClick={handleUseTranscript}
              className="btn-primary text-sm"
              disabled={disabled}
            >
              Use Transcript
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary text-sm"
            >
              Clear
            </button>
          </>
        )}
      </div>

      {(transcript || interimTranscript) && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {transcript}
            {interimTranscript && (
              <span className="text-gray-400 italic">{interimTranscript}</span>
            )}
          </p>
        </div>
      )}

      {isListening && !transcript && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Listening...
        </div>
      )}
    </div>
  )
}