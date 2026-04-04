# LessonLens

**The Offline-First, Privacy-Preserving AI Teaching Assistant**

> Snap a photo of any student worksheet. Get instant grading, conceptual gap analysis, bilingual translations, and personalized intervention plans — all powered by Gemma 4 running completely on your device.

[![Built with Gemma 4](https://img.shields.io/badge/Powered%20by-Gemma%204-blue)](https://ai.google.dev/gemma)
[![Runs on Ollama](https://img.shields.io/badge/Runs%20on-Ollama-green)](https://ollama.com)
[![Hackathon](https://img.shields.io/badge/Kaggle-Gemma%204%20Good%20Hackathon-orange)](https://kaggle.com/competitions/gemma-4-good-hackathon)

---

## The Problem

Teachers in under-resourced and remote schools spend **hours each week grading paper worksheets** by hand. They lack the tools to quickly diagnose _why_ a student is struggling and generate targeted interventions. Meanwhile, strict privacy laws like **FERPA and COPPA** prevent them from uploading photos of student work to cloud-based AI services.

## The Solution

**LessonLens** puts frontier AI directly in the teacher's hands — offline, private, and instant.

1. **Scan** — Take a photo of a student's worksheet using your tablet or laptop camera (or upload an image).
2. **Analyze** — Gemma 4's multimodal vision model, running locally via Ollama, grades the work and identifies specific conceptual misunderstandings.
3. **Intervene** — Receive a personalized intervention plan, simplified reading materials, bilingual translations, and formative assessment questions — all generated in seconds.
4. **Track** — View class-level analytics on a dashboard showing score distributions, common gaps, and student progress over time.
5. **Sync (Optional)** — When internet is available, anonymized class statistics can sync to a cloud dashboard for district-level insights.

## Architecture

```
┌──────────────────────────────────────────────────┐
│                  Teacher's Device                 │
│                                                   │
│  ┌───────────┐    ┌──────────────────────────┐   │
│  │  React    │───▶│  Ollama (Local)           │   │
│  │  PWA      │◀───│  Gemma 4 Vision Model     │   │
│  │  (Vite)   │    │  • Multimodal grading     │   │
│  └─────┬─────┘    │  • Function calling (JSON)│   │
│        │          └──────────────────────────┘   │
│        │ localStorage                             │
│        ▼                                          │
│  ┌───────────┐                                    │
│  │ Offline   │                                    │
│  │ Storage   │                                    │
│  └─────┬─────┘                                    │
└────────┼─────────────────────────────────────────┘
         │ Optional Wi-Fi sync
         ▼
┌──────────────────┐     ┌───────────────────┐
│  Railway Backend │────▶│   GCP Analytics   │
│  (Express.js)    │     │   (District View) │
└──────────────────┘     └───────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite 8, Framer Motion | Responsive PWA with camera integration |
| **AI Engine** | Gemma 4 via Ollama | Local multimodal inference — zero cloud dependency |
| **Persistence** | localStorage | Offline-first student analysis storage |
| **Backend** | Express 5 on Railway | Optional cloud sync for anonymized class stats |
| **Cloud** | Google Cloud Platform | District-level analytics aggregation |

## Getting Started

### Prerequisites

- [Node.js 22+](https://nodejs.org)
- [Ollama](https://ollama.com) installed locally

### 1. Install Ollama & Gemma 4

```bash
# Install Ollama (https://ollama.com/download)
# Then pull the Gemma 4 model:
ollama pull gemma4:latest
```

### 2. Start the Frontend

```bash
cd LessonLens
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Start the Backend (Optional — for cloud sync)

```bash
cd server
npm install
npm run dev
```

The API runs at [http://localhost:3001](http://localhost:3001).

## Project Structure

```
LessonLens/
├── src/
│   ├── components/        # React UI components
│   │   ├── Navbar.tsx         # App header + Ollama status
│   │   ├── Landing.tsx        # Hero landing page
│   │   ├── Scanner.tsx        # Camera capture + file upload
│   │   ├── Analyzing.tsx      # Progress indicator
│   │   ├── AnalysisPanel.tsx  # Full results display
│   │   ├── ResultCard.tsx     # Reusable result card + gap badge
│   │   └── Dashboard.tsx      # Class analytics + cloud sync
│   ├── services/
│   │   ├── ollama.ts          # Gemma 4 API client
│   │   ├── storage.ts         # localStorage persistence
│   │   └── sync.ts            # Cloud sync client
│   ├── types.ts               # Shared TypeScript interfaces
│   └── App.tsx                # Main application shell
├── server/
│   ├── server.ts              # Express API (Railway deployment)
│   └── Dockerfile             # Production container
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker for offline support
├── railway.json               # Railway deployment config
└── PLAN.md                    # Detailed build plan & architecture
```

## Hackathon Tracks

- **Main Track** — Best overall project with exceptional vision and real-world impact.
- **Future of Education** — Reimagining learning with multi-tool agents that adapt to the individual.
- **Ollama** — Best project running Gemma 4 locally via Ollama.

## Key Features for Judges

| Feature | Why It Matters |
|---------|---------------|
| **100% Offline AI** | Works in classrooms with zero internet |
| **Student Privacy** | No data ever leaves the device (FERPA/COPPA compliant) |
| **Multimodal Grading** | Gemma 4 vision reads handwritten work |
| **Conceptual Gap Detection** | Pinpoints _why_ students struggle, not just _what_ they got wrong |
| **Bilingual Output** | Instant Spanish translations at A2 CEFR level |
| **Personalized Interventions** | AI-generated lesson plans tailored to each student |
| **Class Analytics** | Teachers see patterns across their classroom |
| **PWA** | Install on any tablet — no app store needed |

## Demo

When Ollama is not running, LessonLens automatically falls back to rich demo data showcasing the full analysis pipeline (Fractions worksheet example with 3 conceptual gaps, intervention plan, bilingual translations, and assessment questions).

## License

MIT

---

Built with love for the [Gemma 4 Good Hackathon](https://kaggle.com/competitions/gemma-4-good-hackathon) by **Team LessonLens**.
