# 🩺 RapidAid Campus — SU Health Unilorin Project

**RapidAid Campus** is a high-performance, mobile-first, and serverless-ready healthcare portal built for the **University of Ilorin (Unilorin)** students. It delivers instant emergency assistance, real-time clinic booking, 24/7 AI-guided symptom triage, and customized diet recommendation hubs.

---

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Database & Backend:** Supabase (PostgreSQL) with Row Level Security (RLS) & WebSockets Realtime Subscriptions
- **AI Core:** Llama 3.3-70B via Groq API (custom clinical reasoning and response streaming)
- **State Management:** Custom React hooks scoping authentication, appointments, SOS triggers, and chat streams

---

## 🌟 Core Features

### 1. Onboarding & Digital Health ID
- **Multi-Step Form:** Streamlined academic info, credentials, and medical vitals (Blood group, Genotype, Allergies, Medical History).
- **Unique Digital ID:** Auto-generates a student health card with a custom identifier (e.g., `RA-2026-XXXXX`).

### 2. One-Tap Emergency SOS (High-Contrast Red Action)
- **GPS Broadcasting:** Instantly captures current latitude/longitude coordinates.
- **Vitals Broadcast:** Streams GPS coordinates and the student's medical vitals directly to the clinic dashboard.
- **Offline Protocol:** Configured for SMS fallback capability if the network connection fails.

### 3. Smart Clinic Booking & Live Queue Tracking
- **Department Selection:** General Outpatient, Dental Clinic, Nursing Unit, Pharmacy, and Laboratory.
- **Queue Countdowns:** Provides a live countdown of the queue position (`#1`, `#2`, etc.) and estimated wait times.

### 4. Smart AI Triage Chat (Clinical Adviser)
- **Medical Advisor Mode:** Guided by a professional clinical adviser persona tailored to the student's profile.
- **Time-Aware Greetings:** Tailors greetings (morning/evening) based on the user's local timezone.
- **Clinical Thinking Process:** Displays a collapsible **Clinical Reasoning & Screening** thought block before every response.
- **Realtime Typewriter Streaming:** Word-by-word streaming animation for a premium feel.
- **Direct Scheduling CTA:** Detects suggested departments in the AI's response and renders a **Book Slot** shortcut that pre-selects the clinic department automatically.

### 5. Custom Student Diet Hub
- **Budget-Friendly Local Meals:** Focuses on popular Nigerian dishes (Amala, Ewedu, Moin-Moin, Yam & Egg, Eba, Oatmeal).
- **Automatic Health Filters:** Excludes meals that conflict with the student's medical conditions (e.g., hides spicy egusi/peppered rice for students with ulcer histories).

---

## 🛠️ Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/[username]/Rapid-Aid.git
cd Rapid-Aid
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GROQ_API_KEY=your-groq-api-key
```

### 3. Setup Database (Supabase SQL Editor)
1. Go to your **Supabase Dashboard** -> **SQL Editor** -> **New Query**.
2. Run the full schema script found in [supabase/schema.sql](file:///c:/Users/AdeRanju/OneDrive/Desktop/Rapid-Aid/supabase/schema.sql) (this creates profiles, appointments, emergencies, meals, and chat tables, enables RLS, and creates policies).
3. Run the seed data script found in [supabase/seed-meals.sql](file:///c:/Users/AdeRanju/OneDrive/Desktop/Rapid-Aid/supabase/seed-meals.sql) to populate local student meals.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
Rapid-Aid/
├── supabase/
│   ├── schema.sql         # Database tables, RLS, and policies
│   └── seed-meals.sql     # Seed script for Nigerian student meals
├── src/
│   ├── app/               # Next.js pages & API routes
│   │   ├── api/triage/    # AI Triage Router (Groq Llama 3.3 endpoint)
│   │   ├── dashboard/     # Restructured user dashboard sub-modules
│   │   └── register/      # Multi-step onboarding portal
│   ├── components/        # Reusable UI elements (Sidebar, SOS Button, etc.)
│   ├── hooks/             # Custom database & state management hooks
│   └── lib/               # Supabase clients & Database typescript types
```
