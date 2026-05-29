'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import { useChat } from '../../../hooks/useChat';

function getRecommendedDepartment(content: string): string | null {
  const text = content.toLowerCase();
  if (text.includes('general outpatient') || text.includes('outpatient')) return 'General Outpatient';
  if (text.includes('dental')) return 'Dental Clinic';
  if (text.includes('nursing')) return 'Nursing Unit';
  if (text.includes('pharmacy') || text.includes('pharmacist')) return 'Pharmacy';
  if (text.includes('laboratory') || text.includes(' lab ') || text.includes(' lab.')) return 'Laboratory';
  return null;
}

export default function TriagePage() {
  const { user, profile } = useAuth();
  const { messages, sending, sendMessage, clearChat } = useChat(user?.id, profile);
  const [inputText, setInputText] = useState('');
  const [researchStep, setResearchStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sending) {
      setResearchStep(0);
      const interval = setInterval(() => {
        setResearchStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 700);
      return () => clearInterval(interval);
    }
  }, [sending]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;
    const query = inputText.trim();
    setInputText('');
    await sendMessage(query);
  };

  if (!profile) return null;

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-4rem)] lg:h-dvh overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 w-full border-b border-border glass shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <h1 className="font-heading font-bold text-base text-slate-900 dark:text-white">AI Triage Chat</h1>
          <button onClick={clearChat} className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            Clear Chat
          </button>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
          <div className="max-w-3xl mx-auto space-y-3">
            {/* Welcome message if empty */}
            {messages.length === 0 && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-sm bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  <p className="font-semibold">👋 Hi {profile.name.split(' ')[0]}!</p>
                  <p className="mt-1 text-slate-500">I&apos;m your RapidAid AI health assistant. Describe any symptoms you&apos;re experiencing and I&apos;ll provide guidance based on your medical profile.</p>
                  <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Note: This is not a diagnosis. For emergencies, use the SOS button.</p>
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const isAI = msg.role === 'assistant';
              return (
                <div key={msg.id} className={`flex ${isAI ? 'justify-start' : 'justify-end'} animate-fade-in`}>
                  <div className={`max-w-[85%] sm:max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                    isAI
                      ? 'bg-card border-border text-slate-800 dark:text-slate-100 rounded-tl-sm'
                      : 'bg-medical-green border-medical-green text-white rounded-tr-sm shadow-sm'
                  }`}>
                    {isAI && msg.thought && (
                      <details className="mb-2 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs overflow-hidden group">
                        <summary className="px-3 py-2 flex items-center justify-between cursor-pointer select-none font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[9px] hover:bg-slate-100/50 dark:hover:bg-slate-850/30 transition">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-medical-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Clinical Reasoning & Screening
                          </div>
                          <span className="text-[10px] text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="p-3 border-t border-slate-200/50 dark:border-slate-850/50 text-slate-600 dark:text-slate-350 font-mono whitespace-pre-line leading-relaxed">
                          {msg.thought}
                        </div>
                      </details>
                    )}
                    <p className="whitespace-pre-line">{msg.content}</p>
                    {isAI && (
                      (() => {
                        const recommendedDept = getRecommendedDepartment(msg.content);
                        if (!recommendedDept) return null;
                        return (
                          <div className="mt-3 pt-2.5 border-t border-slate-200/40 dark:border-slate-800/40 flex justify-start">
                            <Link href={`/dashboard/appointments?dept=${encodeURIComponent(recommendedDept)}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-medical-blue hover:bg-medical-blue-hover text-white text-[10px] font-bold uppercase tracking-wider transition touch-target shadow-sm">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Book {recommendedDept} Slot
                            </Link>
                          </div>
                        );
                      })()
                    )}
                    <span className={`block text-[9px] mt-1.5 text-right font-medium font-mono ${isAI ? 'text-slate-400' : 'text-emerald-200'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {sending && (
              <div className="flex justify-start animate-pulse-subtle">
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 text-xs space-y-2 shadow-sm max-w-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                    <svg className="w-3.5 h-3.5 animate-spin text-medical-green" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Clinical Triage Research
                  </div>
                  <div className="space-y-1.5 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className={researchStep >= 0 ? "text-medical-green font-bold" : "text-slate-300"}>
                        {researchStep > 0 ? "✓" : "●"}
                      </span>
                      <span className={researchStep === 0 ? "font-semibold text-slate-700 dark:text-slate-250" : "opacity-70"}>
                        Checking student medical vitals...
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={researchStep >= 1 ? "text-medical-green font-bold" : "text-slate-300"}>
                        {researchStep > 1 ? "✓" : researchStep === 1 ? "●" : "○"}
                      </span>
                      <span className={researchStep === 1 ? "font-semibold text-slate-700 dark:text-slate-250" : "opacity-70"}>
                        Cross-checking allergies & history...
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={researchStep >= 2 ? "text-medical-green font-bold" : "text-slate-300"}>
                        {researchStep > 2 ? "✓" : researchStep === 2 ? "●" : "○"}
                      </span>
                      <span className={researchStep === 2 ? "font-semibold text-slate-700 dark:text-slate-250" : "opacity-70"}>
                        Analyzing symptom risk severity...
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={researchStep >= 3 ? "text-medical-green font-bold" : "text-slate-300"}>
                        {researchStep === 3 ? "●" : "○"}
                      </span>
                      <span className={researchStep === 3 ? "font-semibold text-slate-700 dark:text-slate-250" : "opacity-70"}>
                        Formulating clinical advice...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-border bg-card shrink-0">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe your symptoms (e.g. 'I have headache and fever')"
              className="flex-1 h-11 px-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-green text-sm touch-target text-slate-900 dark:text-white placeholder:text-slate-400"
              disabled={sending} />
            <button type="submit" disabled={sending || !inputText.trim()}
              className="h-11 w-11 rounded-2xl bg-medical-green hover:bg-medical-green-hover text-white transition flex items-center justify-center disabled:opacity-50 touch-target shrink-0">
              <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <div className="max-w-3xl mx-auto mt-2 text-center text-[10px] text-slate-400 font-semibold">
            🤖 AI triage provides guidance, not medical diagnoses. In emergencies, use the SOS.
          </div>
        </div>
      </div>
    </div>
  );
}
