# Agent System Specification: RapidAid Campus (SU Health Unilorin Project)

This document serves as the comprehensive architectural blueprint and development ruleset for **RapidAid Campus**, built using a high-performance modern web stack and **Supabase** as the backend engine.

---

## 1. System Architecture & Tech Stack

The application is structured as a decoupled, serverless-ready architecture designed to provide instant response times, offline-first reliability for critical emergencies, and secure data handling.

* **Frontend Framework:** Next.js (App Router) using TypeScript. It leverages Server Components for fast initial data fetching (like pulling student directories or nutrition logs) and Client Components for highly interactive elements (like the live queue tracker and AI chat).
* **Styling Engine:** Tailwind CSS combined with an accessible component library (such as shadcn/ui or Radix primitives) to deliver a clean, modern, and high-contrast user interface.
* **Backend & Database:** Supabase (PostgreSQL). It handles user accounts, relational medical tables, and utilizes Row Level Security (RLS) to keep private student health data completely confidential.
* **Realtime Layer:** Supabase Realtime (WebSockets) to dynamically push live clinic queue changes and active emergency alerts to the client dashboard without requiring manual page refreshes.
* **AI Engine:** Supabase Edge Functions routing sanitized payloads to a Large Language Model (LLM) API to power the 24/7 symptom triaging chatbot and automated post-visit recovery follow-ups.

---

## 2. Core App Feature & Navigation Workflows

### Onboarding Pipeline
1.  **Landing Page:** High-impact hero section with a singular, prominent "Register" Call to Action (CTA).
2.  **Multi-Step Registration:** Form fields broken into logical steps (Academic Info $\rightarrow$ Account Credentials $\rightarrow$ Critical Medical Vitals like Blood Group, Genotype, Allergies, and Current History) to avoid user fatigue.
3.  **Digital ID Generation:** Upon form completion, the backend triggers an automated routine that generates a unique Student Health ID (e.g., `RA-2026-XXXXX`). A beautiful, downloadable digital health card state is rendered immediately on-screen showing their new ID and password mask.

### Post-Login Features Hub
* **Main Dashboard:** Displays a personalized student greeting, an immediate view of their Digital Health Badge (vitals), and any active clinic appointment banners.
* **One-Tap Emergency SOS:** A floating or top-anchored, high-contrast action button. Tapping it captures real-time GPS coordinates and broadcasts them alongside the student's vital medical info to the clinic emergency dashboard. Includes an offline SMS fallback protocol.
* **Smart Appointment Booking:** A clean calendar and department selection wizard allowing students to book slots at specific clinics (General Outpatient, Dental, Nursing) and view a live countdown of their queue position.
* **Smart AI Triage Chat:** An interactive sidebar or floating module where students can text symptoms to get immediate, non-diagnostic guidance and automated check-ins days after a clinic visit.
* **Nutritional Diet Hub:** A dedicated panel providing student-budget-friendly local meal recommendations, automatically filtered to exclude items that conflict with medical history logged during registration (e.g., hiding spicy foods for ulcer histories).

---

## 3. Rules for Generating Clean, Error-Free Code

When generating components, APIs, or data modules for this project, compliance with the following technical boundaries is mandatory:

### TypeScript & Type Safety
* **Strict Typing:** Never use `any`. All database models must strictly map to the auto-generated Supabase database types.
* **Null & Undefined Safety:** Always utilize optional chaining (`?.`) and nullish coalescing (`??`) when handling profile records, ensuring the UI never crashes if optional registration data (like specific allergies) is empty.

### Supabase & Data Rules
* **Enforce RLS Everywhere:** Every single database table query must assume Row Level Security is active. Queries must execute through the authenticated user client instance so that records are strictly scoped to `auth.uid()`.
* **Optimistic UI Updates:** When booking an appointment or triggering an SOS alert, update the local client state instantly to show success or loading feedback while the backend network transaction resolves in the background.

### Next.js Architecture Rules
* **Isolate Side Effects:** Keep data fetching inside Next.js Server Components where possible. Use Client Components explicitly for stateful behaviors like opening the AI chat drawer, countdown timers, or handling the SOS gesture.
* **Clean Architecture:** Separate business logic from presentation. Custom hooks must encapsulate all data handling, mutation events, and real-time socket connections, leaving UI files completely clean and readable.

---

## 4. Rules for Clean, Modern UI/UX

To win over the SU Health Week judges, the visual layout must feel premium, reassuring, and highly accessible:

* **Visual Hierarchy:** Use a clean, professional color palette—primarily crisp medical greens, soothing blues, and deep neutral slate for typography. High-contrast reds must be reserved exclusively for the Emergency SOS features.
* **Scannability & Spacing:** Campus healthcare apps are often opened under stress. Avoid dense text blocks. Maximize white space, use large readable typography, and leverage highly descriptive icon sets for navigation tiles.
* **Responsive Adaptation:** Ensure the interface scales seamlessly down to budget mobile screens. Touch targets for all primary action buttons (especially booking dates and the SOS button) must have a minimum interactive area of $44 \times 44\text{ px}$ to avoid accidental taps.
* **State Signalling:** Every interactive element must feature explicit micro-interactions: loading spinners on form submission, smooth skeleton layouts during initial dashboard data hydration, and distinct color transitions during state updates.
