# AI Powered Study Companion 🚀

A production-ready, full-stack web application built to help students manage their study workflow, track subjects, and leverage artificial intelligence to automatically generate summaries, flashcards, and practice questions from their class notes.

**🔗 Live Demo:** [https://ai-study-companion-335ca.web.app](https://ai-study-companion-335ca.web.app)

---

## 🌟 Core Features
- **Intelligent AI Tools**: Powered by the **Google Gemini API**, users can instantly generate custom study summaries, interactive flashcards, and challenging practice questions directly from their notes.
- **Secure Authentication**: Protected routing and user sessions using **Firebase Authentication**.
- **Real-Time Database**: All tasks, subjects, and topics are synchronized instantly across devices using **Firebase Firestore**.
- **Dashboard Analytics**: Visualize study progress, task completion rates, and active subjects with dynamic, responsive charts.
- **Task Management**: Prioritize tasks, track deadlines, and organize revision schedules seamlessly.

## 🛠️ Tech Stack
- **Frontend Framework**: React 18 (Vite), JavaScript (ES6+), JSX
- **Styling**: Tailwind CSS v4 (Custom UI variables, glassmorphism design, and micro-animations)
- **Backend / Database**: Google Firebase (Firestore)
- **Authentication**: Google Firebase (Email/Password)
- **AI Integration**: Google Gemini API
- **Routing**: React Router DOM v7
- **Charts**: Recharts
- **Icons**: Lucide React

---

## ⚙️ Local Development Setup

To run this project locally, follow these steps:

1. **Clone the repository & install dependencies:**
   ```bash
   git clone https://github.com/ariyan452007/ai-study-companion.git
   cd "ai-study-companion"
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env` file in the root of the project and add your Firebase and Gemini API configurations:
   ```env
   VITE_FIREBASE_API_KEY="your_firebase_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
   VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
   VITE_FIREBASE_APP_ID="your_app_id"
   VITE_FIREBASE_MEASUREMENT_ID="your_measurement_id"

   # Google Gemini API
   VITE_GEMINI_API_KEY="your_gemini_api_key"
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to view the app!

---

## 🚢 Deployment
This project is configured for seamless deployment via **Firebase Hosting**.
To deploy updates to the live site:
```bash
npm run build
npx firebase-tools deploy
```

---
*Developed as a comprehensive Endterm Project demonstrating full-stack React capabilities.*
