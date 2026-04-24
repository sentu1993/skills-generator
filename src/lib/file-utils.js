export async function extractTextFromPDF(file) {
  const pdfParse = (await import('pdf-parse')).default
  
  const arrayBuffer = await file.arrayBuffer()
  const data = await pdfParse(Buffer.from(arrayBuffer))
  return cleanText(data.text)
}

export async function extractTextFromDOCX(file) {
  const mammoth = await import('mammoth')
  
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return cleanText(result.value)
}

export async function extractTextFromTXT(file) {
  const text = await file.text()
  return cleanText(text)
}

export async function extractTextFromMarkdown(file) {
  const text = await file.text()
  return cleanText(text)
}

export function cleanText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \n]+/g, ' ')
    .replace(/^\s+|\s+$/g, '')
    .trim()
}

export async function extractTextFromFile(file) {
  const extension = file.name.split('.').pop().toLowerCase()
  
  switch (extension) {
    case 'pdf':
      return extractTextFromPDF(file)
    case 'docx':
      return extractTextFromDOCX(file)
    case 'txt':
      return extractTextFromTXT(file)
    case 'md':
    case 'markdown':
      return extractTextFromMarkdown(file)
    default:
      throw new Error(`Unsupported file type: .${extension}`)
  }
}