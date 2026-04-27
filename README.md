# 🧠 AI Skill File Generator

**AI Skill File Generator** is a powerful, open-source web application designed to help creators, developers, and knowledge workers transform raw ideas, voice notes, and documents into structured, reusable `.md` (Markdown) skill files.

Built with a focus on privacy and modularity, it leverages free-tier AI models to provide high-quality knowledge structuring without complex setups.

---

## 🎯 Project Objective

The goal is to provide a seamless interface where users can:
1. **Input raw information** via text, voice, or files.
2. **AI-Structure the data** into a standardized "Skill File" format.
3. **Export & Reuse** the knowledge in personal knowledge management (PKM) systems, documentation, or team wikis.

---

## 🚀 Key Features

### 🎙️ Multi-Input System
- **Text Input**: Direct manual entry for quick ideas.
- **Voice Input**: Real-time speech-to-text using the **Web Speech API**.
- **File Upload**: Extract text from **PDF, DOCX, TXT, and Markdown** files.

### 🧠 AI Processing Engine
- **Modular Provider System**: Easily switch between **OpenAI (GPT-3.5/4)**, **Google Gemini (Pro/Flash)**, and **Local Models (Ollama)**.
- **Context Chunking**: Support for large documents through intelligent text chunking.
- **Actionable Output**: Specifically tuned prompts to extract key concepts, steps, and tools.

### 📄 Output & Management
- **Live Preview**: Real-time Markdown rendering with syntax highlighting.
- **Export Options**: One-click **Copy to Clipboard** or **Download as .md**.
- **Local History**: Automatic local storage of generated files for later access (Privacy First - No database required).

---

## Video

https://github.com/user-attachments/assets/882e3b8b-6db8-4dc8-ae53-4cd83f9b7a97

---

## 🛠️ Installation Guide

### Prerequisites
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Ollama** (Optional): If you wish to run local models.

### Setup Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ai-skill-file-generator.git
   cd ai-skill-file-generator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file (or copy `.env.example`):
   ```bash
   cp .env.example .env.local
   ```
   *Note: You can also configure API keys directly in the app's Settings UI.*

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Application Guide

1. **Configure AI**: Click the **Settings (Gear Icon)** and select your preferred AI provider. If using OpenAI or Gemini, enter your API key.
2. **Provide Input**:
   - **Text**: Type your topic (e.g., "How to bake sourdough bread").
   - **Voice**: Click "Start Voice" and describe your skill.
   - **File**: Drag and drop a document to extract its content.
3. **Generate**: Click **"Generate Skill File"**.
4. **Review & Edit**: The AI will generate a structured file in the preview pane.
5. **Save**: Use the **Download** button to save the `.md` file or **Copy** it to your clipboard.
6. **History**: Click the **History (Clock Icon)** to view your previously generated files.

---

## 🏗️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown**: [React Markdown](https://github.com/remarkjs/react-markdown), [Prism Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- **File Parsing**: [Mammoth.js](https://github.com/mwilliamson/mammoth.js) (DOCX), [PDF-Parse](https://github.com/nisaacson/pdf-parse) (PDF)
- **AI Clients**: [OpenAI SDK](https://github.com/openai/openai-node), [Google Generative AI SDK](https://github.com/google/generative-ai-js)

---

## 🔐 Privacy First

- **No Login Required**: Start generating immediately.
- **Local Data**: All history and settings are stored in your browser's `localStorage`.
- **Local AI Support**: Use **Ollama** to keep your data 100% on your machine.

---

## 👨‍💻 Built By

**Souptik Guha Roy**
*Turning raw ideas into structured knowledge.*

---

## 📄 Licensing

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get involved.
