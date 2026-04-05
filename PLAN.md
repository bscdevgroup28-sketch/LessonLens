# LessonLens: Project Build Plan & Architecture

## 1. Executive Summary
**LessonLens** is an offline-first, privacy-preserving AI teaching assistant designed to help educators in under-resourced or remote areas. By leveraging the multimodal capabilities of **Gemma 4** running locally via **Ollama**, LessonLens allows teachers to snap a photo of a student's handwritten work, automatically grade it, identify specific conceptual gaps, and instantly generate personalized intervention worksheets—all without requiring an internet connection or compromising student privacy data.

## 2. Target Hackathon Tracks
*   **Main Track ($50k):** Best overall project demonstrating exceptional vision and real-world impact.
*   **Future of Education Track ($10k):** Tools bridging the gap between humans and data to reimagine learning and empower educators.
*   **Ollama Special Technology Track ($10k):** Best project utilizing Gemma 4 running locally via Ollama.

## 3. System Architecture
*   **Frontend (PWA):** React, Vite, Tailwind CSS (for rapid, responsive UI).
*   **Core UI Components:**
    *   **Camera Scanner:** `react-webcam` integration for capturing student worksheets.
    *   **Analysis Dashboard:** Displays the Gemma 4 interpreted grade, conceptual feedback, and generated lesson plan.
    *   **Class Overview:** High-level metrics showing class trends over time.
*   **Local AI Engine (Edge):**
    *   **Ollama:** Running the Gemma 4 multimodal model (`gemma-4-vision` or equivalent) completely locally.
    *   **Prompting & Function Calling:** Structured JSON output to parse grades and action items natively.
*   **Cloud Sync (Optional/Analytics):**
    *   **Backend:** Express/Node.js hosted on **Railway** (Project ID: `7d9aba08-260f-4238-9888-9fc4dde3650e`).
    *   **Cloud Infrastructure:** **GCP** (Project ID: `lessonlens-492316`) for data aggregation / district-level dashboards when the teacher eventually connects to Wi-Fi.

## 4. Implementation Phases

### Phase 1: Frontend Core UI & Scaffolding ✅ COMPLETE
- [x] Initialize React/Vite workspace.
- [x] Install dependencies (`react-webcam`, `lucide-react`, `axios`, `framer-motion`).
- [x] Custom CSS design system (glassmorphism, animations, responsive).
- [x] Build `types.ts`: Shared TypeScript interfaces.
- [x] Build `Navbar.tsx`: App header with Ollama status indicator.
- [x] Build `Landing.tsx`: Hero landing page with feature cards.
- [x] Build `Scanner.tsx`: Real webcam + file upload with student name input.
- [x] Build `Analyzing.tsx`: Progress bar with stage-based status text.
- [x] Build `AnalysisPanel.tsx`: Full results view (grade, gaps, reading, translation, prompts, plan).
- [x] Build `ResultCard.tsx` + `GapBadge`: Reusable result rendering.
- [x] Build `Dashboard.tsx`: Class-level analytics (stats, score distribution, gap ranking, activity log).
- [x] Build `App.tsx`: Main shell wiring all views with AnimatePresence routing.

### Phase 2: Local AI Integration ✅ COMPLETE
- [x] Create `services/ollama.ts`: Full API client for Ollama REST endpoint with structured JSON prompting.
- [x] Multimodal prompt engineered for educational grading, gap detection, translations.
- [x] Graceful fallback to rich demo data when Ollama is unavailable.
- [x] Auto-detect Ollama status on mount + 30s polling.
- [ ] Install Ollama locally and download `gemma4:latest` model (user setup step).
- [ ] Fine-tune prompt based on real Gemma 4 output quality.

### Phase 3: Backend & Cloud Sync ✅ COMPLETE
- [x] Initialize Express.js server in `server/` with separate package.json.
- [x] Health check endpoint, POST `/api/sync` for anonymized stats upload.
- [x] GET `/api/district/:schoolId` for district-level aggregation.
- [x] Create `services/sync.ts` frontend client with cloud status check.
- [x] `services/storage.ts`: localStorage-based offline persistence with class stats computation.
- [x] Deploy to Railway (`https://lessonlens-api-production.up.railway.app`).
- [ ] Connect to GCP Firestore for persistent storage.
- [x] Wire "Sync to Cloud" button in Dashboard UI.

### Phase 4: Pitch, Video, & Kaggle Writeup
- [ ] Record the demonstration video showing the offline capabilities (turning off Wi-Fi before scanning).
- [ ] Draft the Kaggle Writeup following the 1,500-word limit, emphasizing architecture, privacy, and Gemma 4 usage.
- [x] Finalize the public GitHub repository documentation.
