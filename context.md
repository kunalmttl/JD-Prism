# PROJECT CONTEXT — JD Prism
**Last Updated:** 2026-04-14T09:39:18-07:00
**Last Active Platform:** Antigravity (AI Studio Build)
**Current Phase:** Polishing / Refinement

## 🎯 Project Goal
JD Prism is an AI-powered career intelligence tool that helps job seekers distill patterns from multiple job descriptions. By uploading PDF JDs, users receive a structured analysis of technical and soft skills, a prioritized study roadmap based on frequency of requirements across companies, and access to a context-aware AI Career Coach for personalized interview preparation.

## ✅ Completed So Far
- **Core Infrastructure**: Setup React + Vite + Tailwind CSS environment.
- **PDF Processing**: Implemented client-side PDF text extraction using `pdfjs-dist`.
- **AI Integration**: Integrated Gemini 1.5 Flash for JD analysis, insight aggregation, and conversational coaching.
- **Persistence**: Implemented `localStorage` to save analyzed JDs and insights across browser sessions.
- **UI/UX Design**: 
    - Established a professional **Slate Gray** flat design theme.
    - Created a "JD Context Indicator" for the chat interface.
    - Added proactive rate limit warnings (visual cues for >4 JDs).
- **Stability**: Optimized model selection to `gemini-1.5-flash` to handle free-tier quota constraints effectively.
- **Chat History**: Enhanced the AI Coach to maintain conversational context across multiple messages.

## 🔴 Last Output
I've added clear rate limit warnings to the UI to help users have a smoother experience.

### UI Enhancements:
*   **Landing Page Note**: Added a subtle but clear message on the main landing page: *"Best results with 1-4 documents at a time."*
*   **Upload Area Warning**: Included a permanent note in the file drop zone advising users not to upload more than 4 JDs at once.
*   **Dynamic Visual Feedback**: If a user selects more than 4 files, the "Analyze" button now turns **Rose Red** and displays a *"Rate Limit Risk"* warning, along with a pulsing alert message.

## ➡️ Next Task
The application is currently stable and feature-complete for the initial scope. Potential next steps include:
- Implementing an "Export to PDF/Markdown" feature for the generated study roadmap.
- Adding a "Comparison Mode" to see side-by-side differences between specific companies.
- Exploring user authentication (Firebase) if cloud-based persistence is desired over local storage.

## 📂 Key Artifacts
- `src/lib/gemini.ts` — Manages all interactions with the Google GenAI SDK.
- `src/lib/pdf.ts` — Handles client-side PDF parsing and text extraction.
- `src/components/InsightsDashboard.tsx` — Visualizes the aggregated "Intelligence" and study roadmap.
- `src/components/ChatInterface.tsx` — Context-aware chat component for the AI Career Coach.
- `src/App.tsx` — Main application logic, tab state, and localStorage persistence.
- `metadata.json` — Application name and permissions.

## ⚙️ Constraints / Rules
- **Tech Stack**: TypeScript, React, Tailwind CSS, Framer Motion.
- **Design**: Professional flat design, Slate Gray accent (`#334155`), high readability.
- **AI Strategy**: Prefer `gemini-1.5-flash` to avoid `429` quota errors on free tier.
- **Architecture**: Client-side only (SPA) with browser-based persistence.
- **Security**: No hardcoded API keys; use environment variables via Vite.
