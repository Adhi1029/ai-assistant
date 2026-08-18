<div align="center">
  <h1>🌌 Nexus AI</h1>
  <p><strong>A Next-Generation Multimodal AI Assistant with a Fluid UI</strong></p>
  
  [![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://ai-assistant-73xk.vercel.app/)
  [![React](https://img.shields.io/badge/React-18-blue?logo=react)](#)
  [![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](#)
</div>

---

Nexus AI is an immersive, highly responsive voice and text AI assistant built with React and Vite. It utilizes top-tier language models (Groq for ultra-fast text generation, and Gemini for advanced vision processing) wrapped inside an edge-to-edge, zero-latency fluid interface featuring WebGL animations.

### 🌐 Live Demo
**[Try Nexus AI here!](https://ai-assistant-73xk.vercel.app/)**

> **Note**: If you are cloning or deploying this yourself, you must supply your own API keys.

---

## ✨ Key Features

- **Fluid, Full-Screen UI**: Adheres to modern design principles with critically-damped spring animations (`framer-motion`), deep translucent materials (`backdrop-filter`), and zero-latency click interactions.
- **Multimodal Inputs**: 
  - Send standard text messages.
  - Attach images for deep visual analysis.
  - Share your screen directly with the assistant.
  - Voice-to-text integration with real-time text-to-speech output.
- **Dynamic 3D Backgrounds**: Beautiful, continuous WebGL strand and floating-line animations running smoothly via `ogl`.
- **Intelligent Fallbacks**: Automatically routes text generation to `Groq (gpt-oss-20b)` for speed and image generation to `Google Gemini 1.5 Flash` for capability, with built-in error handling and fallback logic.

---

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Vanilla CSS with modern Glassmorphism and optical-sizing typography.
- **Motion & 3D**: `framer-motion` (spring physics), `ogl` (WebGL).
- **APIs**: 
  - `groq-sdk` (Text Inference)
  - `@google/genai` (Vision Inference)

---

## 🚀 Local Development Setup

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/Adhi1029/ai-assistant.git
cd ai-assistant
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root of the project and add your API keys:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
> *You can obtain these keys from the [Groq Console](https://console.groq.com/) and [Google AI Studio](https://aistudio.google.com/).*

### 4. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## ☁️ Deployment

This project is configured for easy deployment on **Vercel** via the included `vercel.json` file.

1. Import the repository into your Vercel Dashboard.
2. In the project settings, navigate to **Environment Variables**.
3. Add `VITE_GROQ_API_KEY` and `VITE_GEMINI_API_KEY` with your respective keys.
4. Deploy!

---
*Built with speed, aesthetics, and intelligence in mind.*
