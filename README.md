# 💎 JD Prism — Career Intelligence Refracted

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Powered by Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue?style=flat-square&logo=google-gemini)](https://ai.google.dev/)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-61DAFB?style=flat-square&logo=react)](https://react.dev/)

**JD Prism** is a sophisticated, AI-powered career intelligence tool designed to help job seekers distill complex job descriptions into actionable study roadmaps. By "refracting" multiple JDs through advanced LLMs, it identifies the "Golden Skills" that top-tier companies actually care about.

---

## ✨ Key Features

### 🔍 Deep Extraction
Upload your target JDs in PDF format. JD Prism uses **Gemini 1.5 Flash** to perform high-fidelity extraction of:
- **Technical Requirements**: Languages, frameworks, and tools.
- **Hidden Soft Skills**: Communication, leadership, and cultural fit markers.
- **Role Summaries**: Concise distillations of what the job actually entails.

### 📊 Intelligence Dashboard
See the big picture with aggregated insights:
- **Common Skills**: Frequency-based analysis of skills across all uploaded documents.
- **Study Priority Roadmap**: A data-driven learning plan categorized by High, Medium, and Low priority.
- **Overall Summary**: A strategic overview of your current career target landscape.

### 🤖 AI Career Coach
A context-aware conversational interface that knows your target JDs.
- Ask about specific technical concepts.
- Get advice on how to bridge skill gaps.
- Practice interview questions tailored to your specific JD context.

### 💾 Local Persistence
Your workspace is automatically saved to your browser's `localStorage`. Close the tab and return later—your analyzed JDs and insights will be right where you left them.

---

## 🎨 Design Philosophy

JD Prism features a **Professional Flat Design** aesthetic:
- **Slate Gray Palette**: A sophisticated `#334155` primary accent for a modern, executive feel.
- **Fluid Motion**: Powered by `framer-motion` for smooth, meaningful transitions.
- **Clean Typography**: Utilizing `Inter` and `Outfit` for maximum readability and a tech-forward vibe.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/jd-prism.git
   cd jd-prism
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **AI**: Google Generative AI SDK (`@google/genai`)
- **PDF Parsing**: `pdfjs-dist`
- **Animations**: Framer Motion (`motion/react`)
- **Icons**: Lucide React

---

## ⚠️ Rate Limit Guidance

To ensure the best experience on the Gemini API Free Tier:
- **Optimal Batch**: Upload **1-4 documents** at a time.
- **Processing**: The app includes visual warnings when high volume is detected to prevent `429` errors.

---

## 📄 License

MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for the next generation of builders.
</p>
