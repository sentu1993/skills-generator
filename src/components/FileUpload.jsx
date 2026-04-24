import { useCallback, useState } from 'react'
import { Upload, File, X, Loader2 } from 'lucide-react'
import { extractTextFromFile } from '../lib/file-utils'

export default function FileUpload({ onFileContent, disabled }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  const handleFile = useCallback(async (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown']
    const validExtensions = ['pdf', 'docx', 'txt', 'md']
    const extension = file.name.split('.').pop().toLowerCase()

    if (!validTypes.includes(file.type) && !validExtensions.includes(extension)) {
      alert('Please upload a PDF, DOCX, TXT, or Markdown file.')
      return
    }

    setIsProcessing(true)
    setUploadedFile(file.name)

    try {
      const text = await extractTextFromFile(file)
      onFileContent(text, file.name)
    } catch (error) {
      console.error('Error processing file:', error)
      alert('Failed to process file. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [onFileContent])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const clearFile = useCallback(() => {
    setUploadedFile(null)
  }, [])

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Upload File</label>
      
      {!uploadedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <input
            type="file"
            accept=".pdf,.docx,.txt,.md"
            onChange={handleInputChange}
            disabled={disabled || isProcessing}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                <span className="text-sm text-gray-500">Processing file...</span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600">
                  Drop a file here or click to upload
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Supports PDF, DOCX, TXT, MD
                </p>
              </>
            )}
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <File className="w-5 h-5 text-primary-500" />
          <span className="flex-1 text-sm text-gray-700 truncate">{uploadedFile}</span>
          <button
            onClick={clearFile}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  )
}