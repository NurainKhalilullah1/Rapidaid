'use client';

import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useAppointments } from '../../hooks/useAppointments';

export default function DashboardHome() {
  const { profile, signOut } = useAuth();
  const { activeAppointment } = useAppointments(profile?.id);

  if (!profile) return null;

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 w-full border-b border-border glass">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-base text-slate-900 dark:text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{profile.name}</span>
              <span className="text-[10px] font-mono text-slate-400">{profile.student_health_id}</span>
            </div>
            <button onClick={signOut} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition touch-target" title="Log Out">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 sm:space-y-8 animate-slide-up">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
              Alafia, {profile.name.split(' ')[0]} 👋
            </h2>
            <p className="text-sm text-slate-500 font-semibold mt-1">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-medical-green-light border border-medical-green/10 text-medical-green text-xs font-bold w-fit">
            <span className="w-2 h-2 rounded-full bg-medical-green animate-pulse" />
            SU Clinic: Online
          </div>
        </div>

        {/* Active Appointment Banner */}
        {activeAppointment && (
          <div className="w-full bg-gradient-to-r from-medical-blue to-sky-600 rounded-2xl text-white p-5 sm:p-7 shadow-lg relative overflow-hidden border border-sky-500/25">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider">Active Booking</span>
                <h3 className="font-heading font-bold text-lg sm:text-xl mt-2">{activeAppointment.department} Appointment</h3>
                <p className="text-sky-100 text-sm">
                  Scheduled for <span className="font-bold text-white font-mono text-xs bg-sky-800/40 px-2 py-0.5 rounded border border-white/10">{activeAppointment.time}</span>
                </p>
              </div>
              <div className="flex gap-5 border-t md:border-t-0 md:border-l border-white/20 pt-3 md:pt-0 md:pl-7">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-sky-200 tracking-wider">Queue</span>
                  <span className="font-heading font-black text-3xl block text-white mt-0.5">#{activeAppointment.queue_position}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-sky-200 tracking-wider">Est. Wait</span>
                  <span className="font-heading font-black text-3xl block text-white mt-0.5">{activeAppointment.estimated_wait_minutes}m</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vitals Badge + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Digital Vitals Badge */}
          <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Digital Health Badge</h3>
                <span className="px-2 py-0.5 rounded bg-medical-green-light border border-medical-green/10 text-medical-green text-[9px] font-bold font-mono">{profile.student_health_id}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-border">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Blood Group</span>
                  <span className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100 mt-0.5 block">{profile.blood_group}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-border">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Genotype</span>
                  <span className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100 mt-0.5 block">{profile.genotype}</span>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">Allergies</span>
                  {profile.allergies?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {profile.allergies.map((a, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30 text-xs font-semibold">{a}</span>
                      ))}
                    </div>
                  ) : <span className="text-xs font-semibold text-slate-400 italic">None logged</span>}
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">Medical History</span>
                  {profile.medical_history?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {profile.medical_history.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-medical-blue-light text-medical-blue border border-medical-blue/20 text-xs font-semibold">{c}</span>
                      ))}
                    </div>
                  ) : <span className="text-xs font-semibold text-slate-400 italic">None logged</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white px-0.5">Health Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/dashboard/appointments', title: 'Book Clinic Slot', desc: 'Pre-book and trace real-time wait times.', bg: 'bg-medical-blue-light', text: 'text-medical-blue', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { href: '/dashboard/triage', title: 'Smart AI Triage', desc: '24/7 symptom triaging & recovery guides.', bg: 'bg-medical-green-light', text: 'text-medical-green', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
                { href: '/dashboard/diet', title: 'Diet Hub', desc: 'Budget meals filtered by your allergies.', bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-600', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              ].map((card) => (
                <Link key={card.href} href={card.href} className="group bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition hover:-translate-y-0.5 flex flex-col justify-between min-h-[10rem]">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.text} flex items-center justify-center mb-auto`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {card.icon.split(' M').map((seg, i) => (
                        <path key={i} strokeLinecap="round" strokeLinejoin="round" d={i === 0 ? seg : `M${seg}`} />
                      ))}
                    </svg>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white mb-1">{card.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
