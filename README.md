# MindSpark - AI Study Planner & Gamified Learning Dashboard

MindSpark is an intelligent, gamified study planner and study companion dashboard designed to help students, scholars, and professionals master complex subjects with structured AI-generated roadmaps, focused study sessions, and interactive learning tools.

---

## 🌟 Key Features

- **📊 Comprehensive Study Dashboard**:
  - Daily Study Streak tracking with day-by-day activity indicators.
  - Total XP and Level progression system rewarding finished tasks and pomodoro focus blocks.
  - Exam Target countdown and overall milestone completion metrics.
  - Interactive weekly study hours bar chart with AI study habit tips.

- **🗓️ Today's Study Plan & Task Management**:
  - Categorized learning tasks sorted by subject, estimated time, difficulty, and XP rewards.
  - Filter tasks by status (*All*, *Pending*, *Completed*).
  - Add custom tasks and start focused timer sessions directly from tasks.

- **⏱️ Integrated Pomodoro Focus Timer**:
  - Custom 25-minute deep focus and 5-minute break timer modes.
  - Ambient audio toggle for concentration.
  - Instant +25 XP reward upon completing focus sessions.

- **🤖 AI Mentor (Powered by Gemini 3.6 Flash)**:
  - Context-aware AI tutor answering queries on Algorithms, System Design, Data Structures, and technical topics.
  - Code snippet formatting and one-click prompt templates.

- **🗺️ Smart AI Roadmap Generator**:
  - Dynamically creates multi-week study plans tailored to subject goals and exam dates.
  - Track topic completion module by module.

- **📝 Smart Notes & AI Summaries**:
  - Markdown note-taking with automated AI Executive Summaries and instant Quiz/Flashcard generation.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons
- **Build Tool**: Vite & esbuild
- **Backend / AI Proxy**: Express.js server with `@google/genai` (Gemini API)
- **Styling**: Sleek modern dark interface with high-contrast typography and subtle glassmorphic container aesthetics

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Development Server**:
   ```bash
   npm run dev
   ```
   Open `https://mindspark-ai-study-planner.ai.studio`
 to view the application.

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---
 **Author**:

**Uzma Batool**

BS Computer Science Student


## 📄 License


MIT License. Designed with focus for high-efficiency learning.
