'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { user, profile, signIn, error: authError, clearError } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [healthId, setHealthId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && profile) {
      router.push('/dashboard');
    }
  }, [user, profile, router]);

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!healthId || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    clearError();

    const success = await signIn(healthId, password);
    setSubmitting(false);
    if (success) {
      router.push('/dashboard');
    } else {
      setError(authError ?? 'Invalid credentials. Please check your Health ID and password.');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-40 w-full border-b border-border glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-medical-green-light">
              <svg className="w-5 h-5 text-medical-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
              </svg>
            </div>
            <div className="leading-none">
              <span className="font-heading font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Rapid<span className="text-medical-green">Aid</span>
              </span>
              <span className="block text-[10px] tracking-widest font-semibold uppercase text-medical-blue">
                Campus Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition whitespace-nowrap"
            >
              Sign In
            </button>
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-semibold rounded-xl bg-medical-green hover:bg-medical-green-hover text-white transition shadow-sm hover:shadow-md whitespace-nowrap"
            >
              Register Now
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <main className="flex-1 flex flex-col">
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left */}
          <div className="flex-1 flex flex-col items-start text-left max-w-xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-medical-blue-light border border-medical-blue/20 text-medical-blue text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-blue opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-medical-blue" />
              </span>
              SU Health Week Unilorin Project
            </div>

            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.08] mb-6">
              Instant Student Healthcare,{' '}
              <span className="text-medical-green">One Tap Away.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-lg">
              RapidAid Campus gives Unilorin students a 24/7 lifeline. Trigger GPS-tracked Emergency SOS, book clinic slots with real-time queues, chat with our AI triage, and get budget-friendly diet recommendations.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link
                href="/register"
                className="inline-flex items-center justify-center h-12 px-7 rounded-2xl bg-medical-green hover:bg-medical-green-hover text-white text-sm font-bold transition shadow-lg shadow-medical-green/20 hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap touch-target"
              >
                Create Health Account
              </Link>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center justify-center h-12 px-7 rounded-2xl bg-white dark:bg-slate-800 border border-border hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm font-bold transition hover:-translate-y-0.5 whitespace-nowrap touch-target"
              >
                Access Portal
              </button>
            </div>

            <div className="flex items-center gap-5 mt-8 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-medical-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Offline-Ready SMS
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-medical-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                GPS SOS Broadcast
              </span>
            </div>
          </div>

          {/* Right — SOS Preview Card */}
          <div className="flex-1 w-full max-w-md flex justify-center items-center relative animate-fade-in">
            <div className="absolute w-64 h-64 bg-medical-green/10 rounded-full blur-3xl -top-8 -left-8 pointer-events-none" />
            <div className="absolute w-64 h-64 bg-medical-blue/10 rounded-full blur-3xl -bottom-8 -right-8 pointer-events-none" />

            <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-xl overflow-hidden transition hover:scale-[1.01]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emergency animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Emergency System</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emergency-light text-emergency text-[10px] font-bold">READY</span>
              </div>

              <div className="flex flex-col items-center py-8">
                <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-emergency-light animate-pulse-emergency cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-emergency flex flex-col items-center justify-center text-white shadow-lg">
                    <svg className="w-10 h-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-heading font-extrabold text-xs tracking-wider">TAP SOS</span>
                  </div>
                </div>
                <span className="mt-6 text-center text-xs text-slate-500 font-medium max-w-[200px] leading-relaxed">
                  Tapping SOS captures GPS and broadcasts medical vital info immediately to clinic staff.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Features Grid ─── */}
        <section className="w-full bg-slate-50 dark:bg-slate-900/50 border-t border-border py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mb-3">
                Engineered for Student Emergency and Care
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                A fully optimized medical layer designed to perform instantly under high campus stress.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[
                {
                  title: 'GPS Emergency SOS',
                  desc: 'One tap broadcasts location and essential health profiles to SU Clinic. Offline SMS backup enabled.',
                  color: 'emergency',
                  icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
                },
                {
                  title: 'Smart Clinic Booking',
                  desc: 'Schedule consultations at general, dental, or nursing units. Watch your queue count down live.',
                  color: 'medical-green',
                  icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
                },
                {
                  title: 'AI Symptom Triage',
                  desc: 'Describe symptoms in plain text for non-diagnostic sorting. Automated check-ins and recovery guides.',
                  color: 'medical-blue',
                  icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
                },
                {
                  title: 'Diet & Vitals Match',
                  desc: 'Budget local meals filtered by your health history. Hides spicy or trigger dishes automatically.',
                  color: 'amber',
                  icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
                },
              ].map((f) => {
                const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
                  emergency: { bg: 'bg-emergency-light', text: 'text-emergency', icon: 'text-emergency' },
                  'medical-green': { bg: 'bg-medical-green-light', text: 'text-medical-green', icon: 'text-medical-green' },
                  'medical-blue': { bg: 'bg-medical-blue-light', text: 'text-medical-blue', icon: 'text-medical-blue' },
                  amber: { bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-600', icon: 'text-amber-600' },
                };
                const c = colorMap[f.color];
                return (
                  <div key={f.title} className="bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
                    <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.icon} flex items-center justify-center mb-5`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {f.icon.split(' M').map((segment, i) => (
                          <path key={i} strokeLinecap="round" strokeLinejoin="round" d={i === 0 ? segment : `M${segment}`} />
                        ))}
                      </svg>
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1.5">{f.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ─── Login Modal ─── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-7 sm:p-8 shadow-2xl relative animate-slide-up">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 touch-target"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">Sign In to RapidAid</h3>
              <p className="text-sm text-slate-500 mt-1">Access your digital health card and clinic dashboard.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-emergency-light border border-emergency/20 text-emergency text-sm font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleQuickLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Student Health ID
                </label>
                <input
                  type="text"
                  value={healthId}
                  onChange={(e) => setHealthId(e.target.value)}
                  placeholder="e.g. RA-2026-12345"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-green text-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-green text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 rounded-xl bg-medical-green hover:bg-medical-green-hover text-white text-sm font-bold tracking-wide transition flex items-center justify-center gap-2 shadow-primary disabled:opacity-50 touch-target"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Enter Portal'
                  )}
                </button>
              </div>

              <div className="text-center text-xs font-semibold text-slate-500 pt-4 border-t border-border mt-4">
                Don&apos;t have a health account?{' '}
                <Link href="/register" className="text-medical-green hover:underline">
                  Register here
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Footer ─── */}
      <footer className="py-6 border-t border-border text-center text-xs text-slate-400 font-semibold bg-slate-50 dark:bg-slate-900/30">
        © 2026 RapidAid Campus. SU Health Week Initiative for the University of Ilorin.
      </footer>
    </div>
  );
}
