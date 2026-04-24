import './globals.css'

export const metadata = {
  title: 'AI Skill File Generator',
  description: 'Turn ideas, voice notes, or documents into structured Markdown skill files',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}