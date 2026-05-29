'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useEmergency } from '../hooks/useEmergency';

export default function SOSButton() {
  const { user, profile } = useAuth();
  const { activeEmergency, triggerEmergency, resolveEmergency, loading } = useEmergency(user?.id, profile);
  const [showOverlay, setShowOverlay] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (activeEmergency) setShowOverlay(true);
  }, [activeEmergency]);

  const handleSOSSmsCountdown = () => {
    let current = 5;
    setCountdown(5);
    const interval = setInterval(() => {
      current -= 1;
      setCountdown(current);
      if (current <= 0) clearInterval(interval);
    }, 1000);
  };

  const handleSOS = () => {
    if (loading || activeEmergency) return;
    handleSOSSmsCountdown();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => triggerEmergency(pos.coords.latitude, pos.coords.longitude),
        () => triggerEmergency(8.4816, 4.6738),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      triggerEmergency(8.4816, 4.6738);
    }
  };

  const handleResolve = () => {
    if (activeEmergency) {
      resolveEmergency(activeEmergency.id);
      setShowOverlay(false);
    }
  };

  return (
    <>
      {/* Floating SOS Button */}
      <div className="fixed bottom-20 lg:bottom-5 right-5 z-40">
        <button onClick={handleSOS} disabled={loading}
          className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emergency hover:bg-emergency-hover text-white shadow-emergency shadow-lg animate-pulse-emergency transition transform hover:scale-105 active:scale-95 disabled:opacity-50 touch-target"
          aria-label="Trigger Emergency SOS" id="sos-button-main">
          {loading ? (
            <div className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </button>
      </div>

      {/* Emergency Overlay */}
      {showOverlay && activeEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-md animate-fade-in text-white overflow-y-auto">
          <div className="bg-slate-900 border-2 border-emergency rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative animate-slide-up overflow-hidden my-4">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full border-[12px] border-emergency/10 animate-ping pointer-events-none" />

            <div className="flex flex-col items-center text-center relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emergency rounded-full flex items-center justify-center mb-5 animate-bounce">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-wide">Emergency SOS Active</h2>
              <p className="text-red-300 text-sm mt-2 max-w-sm">Distress broadcast sent to SU Health Center and Campus Security.</p>

              <div className="mt-5 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs text-slate-300 flex items-center gap-3">
                <span>LAT: {activeEmergency.latitude.toFixed(6)}</span>
                <span className="w-px h-3 bg-slate-600" />
                <span>LON: {activeEmergency.longitude.toFixed(6)}</span>
              </div>

              {/* SMS Protocol */}
              <div className="mt-5 w-full p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${countdown <= 0 ? 'bg-medical-green' : 'bg-amber-500 animate-pulse'}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Offline SMS Protocol</span>
                </div>
                {countdown > 0 ? (
                  <p className="text-xs text-slate-300">Broadcasting SMS fallback in <span className="text-amber-500 font-bold">{countdown}s</span>...</p>
                ) : (
                  <p className="text-xs text-medical-green font-bold flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Distress SMS Broadcasted!
                  </p>
                )}
              </div>

              {/* Vitals */}
              <div className="mt-5 w-full border-t border-slate-800 pt-5">
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">Vitals Transmitted</span>
                <div className="grid grid-cols-2 gap-3 text-left">
                  {[
                    { label: 'Name', value: activeEmergency.user_name },
                    { label: 'Health ID', value: activeEmergency.student_health_id },
                    { label: 'Blood / Genotype', value: `${activeEmergency.blood_group} / ${activeEmergency.genotype}` },
                    { label: 'Allergies', value: (activeEmergency.allergies ?? []).join(', ') || 'None' },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-800/30 p-2.5 rounded-xl border border-slate-800">
                      <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold">{item.label}</span>
                      <span className="font-bold text-xs text-slate-200 block mt-0.5">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3 w-full pt-4 border-t border-slate-800">
                <a href="tel:+2348030000000" className="flex-1 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 touch-target">
                  📞 Call Clinic
                </a>
                <button onClick={handleResolve} className="flex-1 h-11 rounded-xl bg-emergency hover:bg-emergency-hover text-white text-xs font-bold transition flex items-center justify-center gap-2 touch-target shadow-lg shadow-emergency/25">
                  Cancel / Resolve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
